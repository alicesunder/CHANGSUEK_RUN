/**
 * Browser-side API client. The server is the source of truth for prices,
 * payment status, BIB numbers and admin access.
 */
import type { RouteId } from '../types';
import type { TicketOrder } from './runnerStorage';

export interface PublicConfig {
  promptPayId: string;
  accountName: string;
  bankLabel: string;
  paymentTimeoutMinutes: number;
  nextBib: Record<RouteId, string>;
  autoSlipVerification: boolean;
  omiseEnabled: boolean;
}

export type ServerOrder = TicketOrder & {
  expiresAt: string;
  omiseQrImageUrl?: string;
  hasSlip?: boolean;
  aiReview?: string;
  verificationNote?: string;
  paidAt?: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(url, init);
  } catch {
    throw new ApiError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่', 0);
  }
  const data: any = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new ApiError(data?.error || `เกิดข้อผิดพลาด (${resp.status})`, resp.status);
  return data as T;
}

const jsonHeaders = { 'Content-Type': 'application/json' };

// ---------------------------------------------------------------------------
// Public / runner
// ---------------------------------------------------------------------------
let cachedConfig: PublicConfig | null = null;

export async function getPublicConfig(force = false): Promise<PublicConfig> {
  if (cachedConfig && !force) return cachedConfig;
  cachedConfig = await request<PublicConfig>('/api/public-config');
  return cachedConfig;
}

export interface CreateOrderInput {
  routeId: RouteId;
  extraPeople: number;
  extraDogs: number;
  fullName: string;
  idCardOrPassport: string;
  phone: string;
  email: string;
  emergencyPhone: string;
  shirtSize: string;
  dogName?: string;
  dogBreed?: string;
  extraRunnerNames?: string;
}

const PENDING_KEY = 'changsuek_pending_order_v2';

export interface PendingOrderRef {
  orderId: string;
  accessToken: string;
}

export function savePendingOrderRef(ref: PendingOrderRef | null): void {
  try {
    if (ref) localStorage.setItem(PENDING_KEY, JSON.stringify(ref));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // storage unavailable — the runner just won't be able to resume after closing the tab
  }
}

export function loadPendingOrderRef(): PendingOrderRef | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.orderId && parsed?.accessToken ? parsed : null;
  } catch {
    return null;
  }
}

export async function createOrder(
  input: CreateOrderInput
): Promise<{ order: ServerOrder; accessToken: string; config: PublicConfig }> {
  const res = await request<{ order: ServerOrder; accessToken: string; config: PublicConfig }>(
    '/api/orders',
    { method: 'POST', headers: jsonHeaders, body: JSON.stringify(input) }
  );
  cachedConfig = res.config;
  return res;
}

export async function fetchOrder(ref: PendingOrderRef): Promise<ServerOrder> {
  const res = await request<{ order: ServerOrder }>(`/api/orders/${encodeURIComponent(ref.orderId)}`, {
    headers: { 'x-order-token': ref.accessToken },
  });
  return res.order;
}

export interface SlipSubmitResult {
  orderStatus: TicketOrder['verificationStatus'];
  message: string;
  reasons: string[];
  order: ServerOrder;
}

export async function submitSlip(
  ref: PendingOrderRef,
  imageDataUrl: string,
  qrPayload?: string
): Promise<SlipSubmitResult> {
  return request<SlipSubmitResult>(`/api/orders/${encodeURIComponent(ref.orderId)}/slip`, {
    method: 'POST',
    headers: { ...jsonHeaders, 'x-order-token': ref.accessToken },
    body: JSON.stringify({ imageDataUrl, qrPayload }),
  });
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
const ADMIN_TOKEN_KEY = 'changsuek_admin_token_v2';

export function getAdminToken(): string | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw);
    if (!token || Date.now() > expiresAt) return null;
    return token;
  } catch {
    return null;
  }
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await request<{ token: string; expiresAt: number; username: string }>('/api/admin/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ username, password }),
  });
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify({ token: res.token, expiresAt: res.expiresAt }));
  } catch {
    // ignore
  }
  return res.username;
}

export function adminFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  return request<T>(url, {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token || ''}` },
  }).catch((err) => {
    if (err instanceof ApiError && err.status === 401) {
      clearAdminToken();
      window.dispatchEvent(new Event('changsuek_admin_logged_out'));
    }
    throw err;
  });
}

export interface AdminSettings {
  promptPayId: string;
  accountName: string;
  bankLabel: string;
  paymentTimeoutMinutes: number;
}

export const adminApi = {
  listOrders: () =>
    adminFetch<{ orders: ServerOrder[]; bibCounters: Record<RouteId, number>; nextBib: Record<RouteId, string> }>(
      '/api/admin/orders'
    ),
  setVerification: (orderId: string, status: 'ADMIN_APPROVED' | 'REJECTED' | 'PENDING_REVIEW') =>
    adminFetch<{ order: ServerOrder }>(`/api/admin/orders/${encodeURIComponent(orderId)}/verification`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ status }),
    }),
  toggleKit: (orderId: string) =>
    adminFetch<{ order: ServerOrder }>(`/api/admin/orders/${encodeURIComponent(orderId)}/kit`, { method: 'POST' }),
  deleteOrder: (orderId: string) =>
    adminFetch<{ ok: true }>(`/api/admin/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE' }),
  getSettings: () =>
    adminFetch<{ settings: AdminSettings; bibCounters: Record<RouteId, number> }>('/api/admin/settings'),
  saveSettings: (settings: AdminSettings, bibCounters: Record<RouteId, number>) =>
    adminFetch<{ settings: AdminSettings; bibCounters: Record<RouteId, number> }>('/api/admin/settings', {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({ settings, bibCounters }),
    }),
  /** Downloads the slip image with the admin token and returns an object URL. */
  async slipObjectUrl(orderId: string): Promise<string> {
    const resp = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/slip`, {
      headers: { Authorization: `Bearer ${getAdminToken() || ''}` },
    });
    if (!resp.ok) throw new ApiError('โหลดรูปสลิปไม่ได้', resp.status);
    return URL.createObjectURL(await resp.blob());
  },
};
