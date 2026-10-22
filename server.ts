/**
 * CHANG SUEK RUN 2027 — web server.
 *
 * Money rules (all enforced here, never in the browser):
 *  1. Prices come from src/data/eventData.ts on the server. The browser cannot set the amount.
 *  2. An order becomes PAID only by:
 *       a) an Omise charge we re-fetched from api.omise.co with our secret key, or
 *       b) a bank slip confirmed by EasySlip / Thunder / SlipOK with matching amount,
 *          matching receiver, and an unused transaction reference, or
 *       c) an authenticated admin approving it.
 *  3. BIB numbers are assigned by the server at the moment an order is paid.
 *  4. Admin endpoints require a signed token from /api/admin/login.
 */
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import type { RouteId } from './src/types';
import { calcTicketTotal, isDogCategory, ticketById, ticketCategories } from './src/data/eventData';
import {
  DATA_DIR,
  SLIP_DIR,
  getEffectiveSlipApiKeys,
  getOrder,
  hasBankSlipApi,
  hashToken,
  isSlipHashUsed,
  isTransRefUsed,
  markOrderPaid,
  mutate,
  nextBibPreview,
  read,
  toAdminView,
  toRunnerView,
  tokenMatches,
  type StoredOrder,
} from './server/store';
import { checkCredentials, issueToken, requireAdmin } from './server/auth';
import {
  aiSlipAdvisory,
  createOmiseCharge,
  fetchVerifiedOmiseCharge,
  omiseEnabledFor,
  receiverMatches,
  verifyWithBankSlipApi,
} from './server/payments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTE_IDS: RouteId[] = ticketCategories.map((t) => t.id);
const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const MAX_EXTRA = 9;
const SLIP_ACCEPT_WINDOW_MS = 48 * 60 * 60 * 1000;
const MAX_SLIP_BYTES = 6 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function clean(input: unknown, max: number): string {
  return String(input ?? '')
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .trim()
    .slice(0, max);
}

function clientIp(req: express.Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

const hits = new Map<string, number[]>();
function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > limit;
}

function orderToken(req: express.Request): string | undefined {
  const h = req.headers['x-order-token'];
  return typeof h === 'string' ? h : undefined;
}

function loadOwnedOrder(req: express.Request, res: express.Response): StoredOrder | null {
  const order = getOrder(String(req.params.orderId));
  if (!order || !tokenMatches(order, orderToken(req))) {
    res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
    return null;
  }
  return order;
}

/** Re-checks an Omise charge and marks the order paid if (and only if) Omise confirms it. */
async function settleFromOmise(order: StoredOrder): Promise<StoredOrder> {
  if (!order.omiseChargeId || order.paymentStatus === 'PAID') return order;
  const charge = await fetchVerifiedOmiseCharge(order.omiseChargeId);
  if (
    charge?.paid &&
    charge.orderId === order.orderId &&
    charge.currency === 'THB' &&
    charge.amountSatang === Math.round(order.totalPrice * 100)
  ) {
    return (
      markOrderPaid(order.orderId, {
        status: 'AUTO_VERIFIED',
        verifiedBy: 'Omise PromptPay (ยืนยันจาก Omise API)',
        paymentRef: charge.chargeId || order.omiseChargeId,
        senderBank: 'Omise PromptPay',
      }) || order
    );
  }
  return order;
}

function publicConfig() {
  const s = read().settings;
  const keys = getEffectiveSlipApiKeys();
  return {
    promptPayId: s.promptPayId,
    accountName: s.accountName,
    bankLabel: s.bankLabel,
    paymentTimeoutMinutes: s.paymentTimeoutMinutes,
    nextBib: Object.fromEntries(ROUTE_IDS.map((r) => [r, nextBibPreview(r)])),
    autoSlipVerification: hasBankSlipApi(),
    omiseEnabled: Boolean(keys.omiseSecretKey),
  };
}

function slipApiStatus() {
  const k = getEffectiveSlipApiKeys();
  return {
    activeExternalProvider: k.easySlipKey
      ? 'EASYSLIP_API'
      : k.thunderKey
      ? 'THUNDER_API'
      : k.slipOkKey && k.slipOkBranch
      ? 'SLIPOK_API'
      : 'MANUAL_ADMIN_REVIEW',
    activeAutoGateway: k.omiseSecretKey ? 'OMISE_PROMPTPAY_WEBHOOK' : 'NONE',
    hasEasySlipKey: Boolean(k.easySlipKey),
    hasThunderKey: Boolean(k.thunderKey),
    hasSlipOkKey: Boolean(k.slipOkKey && k.slipOkBranch),
    hasStripeKey: false,
    hasOmiseKey: Boolean(k.omiseSecretKey),
    hasGbPrimePayKey: false,
    slipOkBranch: k.slipOkBranch || '',
    strictSixLayerGate: true,
  };
}

// ---------------------------------------------------------------------------
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  const smallJson = express.json({ limit: '200kb' });
  const slipJson = express.json({ limit: '10mb' });

  // ---------------- Public ----------------
  app.get('/api/public-config', (_req, res) => {
    res.json(publicConfig());
  });

  // Create an order. The server computes the price; the browser only sends runner details.
  app.post('/api/orders', smallJson, async (req, res) => {
    if (rateLimited(`order:${clientIp(req)}`, 15, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'สร้างคำสั่งซื้อบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่' });
      return;
    }
    const b = req.body || {};
    const routeId = b.routeId as RouteId;
    if (!ROUTE_IDS.includes(routeId)) {
      res.status(400).json({ error: 'ระยะวิ่งไม่ถูกต้อง' });
      return;
    }
    const isDog = isDogCategory(routeId);
    const extraPeople = isDog ? Math.min(MAX_EXTRA, Math.max(0, Math.floor(Number(b.extraPeople) || 0))) : 0;
    const extraDogs = isDog ? Math.min(MAX_EXTRA, Math.max(0, Math.floor(Number(b.extraDogs) || 0))) : 0;

    const fullName = clean(b.fullName, 120);
    const phone = clean(b.phone, 30);
    const email = clean(b.email, 120);
    const emergencyPhone = clean(b.emergencyPhone, 30);
    const shirtSize = SHIRT_SIZES.includes(b.shirtSize) ? b.shirtSize : '';
    const errors: string[] = [];
    if (fullName.length < 2) errors.push('กรุณากรอกชื่อ-นามสกุล');
    if (phone.replace(/\D/g, '').length < 9) errors.push('เบอร์โทรศัพท์ไม่ถูกต้อง');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('อีเมลไม่ถูกต้อง');
    if (emergencyPhone.replace(/\D/g, '').length < 9) errors.push('เบอร์ติดต่อฉุกเฉินไม่ถูกต้อง');
    if (!shirtSize) errors.push('กรุณาเลือกไซซ์เสื้อ');
    if (errors.length) {
      res.status(400).json({ error: errors.join(' · ') });
      return;
    }

    const total = calcTicketTotal(routeId, extraPeople, extraDogs);
    const token = crypto.randomBytes(24).toString('base64url');
    const now = new Date();
    const timeoutMin = Math.max(1, read().settings.paymentTimeoutMinutes || 15);

    const order = mutate((d) => {
      d.orderSeq += 1;
      const o: StoredOrder = {
        orderId: `CSR27-${String(d.orderSeq).padStart(5, '0')}`,
        accessTokenHash: hashToken(token),
        fullName,
        idCardOrPassport: clean(b.idCardOrPassport, 40),
        phone,
        email,
        emergencyPhone,
        routeId,
        routeName: ticketById(routeId).name,
        shirtSize,
        runningWithDog: isDog,
        dogName: isDog ? clean(b.dogName, 80) : undefined,
        dogBreed: isDog ? clean(b.dogBreed, 80) : undefined,
        extraPeople,
        extraDogs,
        extraRunnerNames: extraPeople > 0 ? clean(b.extraRunnerNames, 240) : undefined,
        peopleCount: isDog ? 1 + extraPeople : 1,
        dogCount: isDog ? 1 + extraDogs : 0,
        totalPrice: total,
        bibNumber: '',
        paymentMethod: 'PROMPTPAY_QR',
        paymentStatus: 'PENDING',
        paymentRef: '',
        senderBank: '',
        verificationStatus: 'AWAITING_PAYMENT',
        kitStatus: 'PENDING_PICKUP',
        registrationStatus: 'REGISTERED',
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + timeoutMin * 60 * 1000).toISOString(),
      };
      d.orders.unshift(o);
      return o;
    });

    if (omiseEnabledFor(total)) {
      const charge = await createOmiseCharge({ amountBaht: total, orderId: order.orderId });
      if (charge.chargeId) {
        mutate(() => {
          order.omiseChargeId = charge.chargeId;
          order.omiseQrImageUrl = charge.qrImageUrl;
        });
      } else {
        console.warn(`[omise] charge create failed for ${order.orderId}: ${charge.error}`);
      }
    }

    res.json({ order: toRunnerView(order), accessToken: token, config: publicConfig() });
  });

  // Order status for the runner who created it (requires the order's access token).
  app.get('/api/orders/:orderId', async (req, res) => {
    let order = loadOwnedOrder(req, res);
    if (!order) return;
    order = await settleFromOmise(order);
    res.json({ order: toRunnerView(order) });
  });

  // Runner submits a bank slip for their order.
  app.post('/api/orders/:orderId/slip', slipJson, async (req, res) => {
    const order = loadOwnedOrder(req, res);
    if (!order) return;
    if (rateLimited(`slip:${order.orderId}`, 8, 15 * 60 * 1000)) {
      res.status(429).json({ error: 'ส่งสลิปบ่อยเกินไป กรุณารอ 15 นาที' });
      return;
    }
    if (order.paymentStatus === 'PAID') {
      res.json({ orderStatus: order.verificationStatus, message: 'คำสั่งซื้อนี้ชำระเงินแล้ว', reasons: [], order: toRunnerView(order) });
      return;
    }
    if (Date.now() - new Date(order.createdAt).getTime() > SLIP_ACCEPT_WINDOW_MS) {
      res.status(400).json({ error: 'คำสั่งซื้อนี้หมดอายุแล้ว กรุณาสมัครใหม่หรือติดต่อผู้จัดงาน' });
      return;
    }

    const m = String(req.body?.imageDataUrl || '').match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!m) {
      res.status(400).json({ error: 'กรุณาอัปโหลดรูปสลิปเป็นไฟล์ JPG, PNG หรือ WEBP' });
      return;
    }
    const mimeType = m[1];
    const bytes = Buffer.from(m[2], 'base64');
    if (bytes.length === 0 || bytes.length > MAX_SLIP_BYTES) {
      res.status(400).json({ error: 'ไฟล์รูปสลิปใหญ่เกินไป (สูงสุด 6 MB)' });
      return;
    }
    const slipHash = crypto.createHash('sha256').update(bytes).digest('hex');
    if (isSlipHashUsed(slipHash) && order.slipHash !== slipHash) {
      res.json({ orderStatus: order.verificationStatus, message: 'สลิปนี้เคยถูกใช้กับคำสั่งซื้ออื่นแล้ว', reasons: ['ห้ามใช้สลิปซ้ำ'], order: toRunnerView(order) });
      return;
    }

    const saveSlip = () => {
      const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
      const file = `${order.orderId}-${Date.now()}.${ext}`;
      fs.writeFileSync(path.join(SLIP_DIR, file), bytes);
      mutate((d) => {
        if (order.slipFile) fs.rm(path.join(SLIP_DIR, order.slipFile), { force: true }, () => {});
        order.slipFile = file;
        order.slipHash = slipHash;
        if (!d.usedSlipHashes.includes(slipHash)) d.usedSlipHashes.push(slipHash);
      });
    };

    const qrPayload = typeof req.body?.qrPayload === 'string' ? req.body.qrPayload.trim() : '';
    const settings = read().settings;

    // ---- Path A: automatic verification through a bank slip API ----
    if (hasBankSlipApi() && /^[0-9A-Za-z]{20,512}$/.test(qrPayload)) {
      const outcome = await verifyWithBankSlipApi(qrPayload, order.totalPrice);
      if (outcome.verified) {
        const reasons: string[] = [];
        if (typeof outcome.amount !== 'number' || Math.abs(outcome.amount - order.totalPrice) > 0.01) {
          reasons.push(`ยอดโอน ${outcome.amount ?? '?'} บาท ไม่ตรงกับยอดที่ต้องชำระ ${order.totalPrice} บาท`);
        }
        if (!receiverMatches(outcome, settings)) {
          reasons.push(`ผู้รับโอน (${outcome.receiverName || '?'} ${outcome.receiverAccount || ''}) ไม่ใช่บัญชีผู้จัดงาน`);
        }
        if (!outcome.transRef) reasons.push('ไม่พบเลขที่รายการจากธนาคาร');
        else if (isTransRefUsed(outcome.transRef)) reasons.push(`เลขที่รายการ ${outcome.transRef} ถูกใช้ไปแล้ว`);

        if (reasons.length === 0) {
          saveSlip();
          const paid = markOrderPaid(order.orderId, {
            status: 'AUTO_VERIFIED',
            verifiedBy: `ตรวจสลิปอัตโนมัติ (${outcome.provider})`,
            paymentRef: outcome.transRef!,
            senderBank: outcome.senderBank || '',
          })!;
          res.json({ orderStatus: paid.verificationStatus, message: 'ตรวจสอบกับธนาคารแล้ว ชำระเงินสำเร็จ', reasons: [], order: toRunnerView(paid) });
          return;
        }
        res.json({ orderStatus: order.verificationStatus, message: 'สลิปไม่ผ่านการตรวจสอบ', reasons, order: toRunnerView(order) });
        return;
      }
      if (!outcome.unavailable) {
        res.json({
          orderStatus: order.verificationStatus,
          message: 'ไม่พบรายการโอนนี้ในระบบธนาคาร',
          reasons: [outcome.errorReason || 'สลิปไม่ผ่านการตรวจสอบ'],
          order: toRunnerView(order),
        });
        return;
      }
      console.warn(`[slip-api] ${outcome.provider} unavailable for ${order.orderId}: ${outcome.errorReason}`);
      // fall through to manual review
    }

    // ---- Path B: manual review by admin (AI reading attached as a hint only) ----
    saveSlip();
    const aiReview = await aiSlipAdvisory({
      mimeType,
      base64Data: m[2],
      expectedAmount: order.totalPrice,
      settings,
    });
    mutate(() => {
      order.verificationStatus = 'PENDING_REVIEW';
      order.aiReview = aiReview;
      order.verificationNote = qrPayload ? `Mini-QR: ${qrPayload.slice(0, 80)}` : 'อ่าน Mini-QR บนสลิปไม่ได้';
    });
    res.json({
      orderStatus: 'PENDING_REVIEW',
      message: 'ได้รับสลิปแล้ว เจ้าหน้าที่จะตรวจสอบและออกเลข BIB ให้',
      reasons: [],
      order: toRunnerView(order),
    });
  });

  // Omise webhook. The body is only a hint — we always re-fetch the charge from Omise.
  app.post('/api/payment-webhook', smallJson, async (req, res) => {
    const chargeId = req.body?.data?.object === 'charge' ? String(req.body.data.id || '') : '';
    if (chargeId) {
      const charge = await fetchVerifiedOmiseCharge(chargeId);
      const order = charge?.orderId ? getOrder(charge.orderId) : undefined;
      if (order && order.omiseChargeId === chargeId) await settleFromOmise(order);
    }
    res.json({ received: true });
  });

  // ---------------- Admin ----------------
  app.post('/api/admin/login', smallJson, (req, res) => {
    const r = checkCredentials(clientIp(req), req.body?.username, req.body?.password);
    if (r.ok) {
      const username = String(req.body.username).trim();
      console.log(`[admin] login ok: ${username} from ${clientIp(req)}`);
      res.json({ ...issueToken(username), username });
      return;
    }
    console.warn(`[admin] login failed from ${clientIp(req)}`);
    res.status(r.lockedSeconds ? 429 : 401).json({
      error: r.lockedSeconds
        ? `ใส่รหัสผิดหลายครั้ง ระงับการเข้าสู่ระบบ ${Math.ceil(r.lockedSeconds / 60)} นาที`
        : `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (เหลืออีก ${r.remaining} ครั้ง)`,
      lockedSeconds: r.lockedSeconds,
    });
  });

  app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
    // Settle any Omise orders still waiting (covers missed webhooks).
    const waiting = read().orders.filter((o) => o.omiseChargeId && o.paymentStatus !== 'PAID').slice(0, 20);
    for (const o of waiting) await settleFromOmise(o);
    res.json({
      orders: read().orders.map(toAdminView),
      bibCounters: read().bibCounters,
      nextBib: publicConfig().nextBib,
    });
  });

  app.post('/api/admin/orders/:orderId/verification', requireAdmin, smallJson, (req, res) => {
    const order = getOrder(String(req.params.orderId));
    if (!order) {
      res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
      return;
    }
    const admin = (req as any).admin.username as string;
    const status = req.body?.status;
    if (status === 'ADMIN_APPROVED') {
      const ref = clean(req.body?.paymentRef, 60) || order.paymentRef || `MANUAL-${order.orderId}`;
      if (ref !== order.paymentRef && isTransRefUsed(ref)) {
        res.status(400).json({ error: `เลขที่รายการ ${ref} ถูกใช้กับคำสั่งซื้ออื่นแล้ว` });
        return;
      }
      markOrderPaid(order.orderId, {
        status: 'ADMIN_APPROVED',
        verifiedBy: admin,
        paymentRef: ref,
        senderBank: clean(req.body?.senderBank, 80) || order.senderBank,
      });
    } else if (status === 'REJECTED' || status === 'PENDING_REVIEW') {
      mutate(() => {
        order.verificationStatus = status;
        order.paymentStatus = 'PENDING';
        order.registrationStatus = 'REGISTERED';
        order.verifiedAt = new Date().toISOString();
        order.verifiedBy = admin;
      });
    } else {
      res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
      return;
    }
    console.log(`[admin] ${admin} set ${order.orderId} -> ${status}`);
    res.json({ order: toAdminView(getOrder(order.orderId)!) });
  });

  app.post('/api/admin/orders/:orderId/kit', requireAdmin, (req, res) => {
    const order = getOrder(String(req.params.orderId));
    if (!order) {
      res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
      return;
    }
    if (order.paymentStatus !== 'PAID') {
      res.status(400).json({ error: 'คำสั่งซื้อนี้ยังไม่ได้ชำระเงิน' });
      return;
    }
    mutate(() => {
      order.kitStatus = order.kitStatus === 'CHECKED_IN' ? 'PENDING_PICKUP' : 'CHECKED_IN';
      order.registrationStatus = order.kitStatus === 'CHECKED_IN' ? 'CHECKED_IN' : 'CONFIRMED';
    });
    res.json({ order: toAdminView(order) });
  });

  app.delete('/api/admin/orders/:orderId', requireAdmin, (req, res) => {
    const id = String(req.params.orderId);
    const order = getOrder(id);
    if (!order) {
      res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
      return;
    }
    mutate((d) => {
      d.orders = d.orders.filter((o) => o.orderId !== id);
    });
    if (order.slipFile) fs.rm(path.join(SLIP_DIR, order.slipFile), { force: true }, () => {});
    console.log(`[admin] ${(req as any).admin.username} deleted ${id}`);
    res.json({ ok: true });
  });

  app.get('/api/admin/orders/:orderId/slip', requireAdmin, (req, res) => {
    const order = getOrder(String(req.params.orderId));
    if (!order?.slipFile) {
      res.status(404).json({ error: 'ไม่มีไฟล์สลิป' });
      return;
    }
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(path.join(SLIP_DIR, path.basename(order.slipFile)));
  });

  app.get('/api/admin/settings', requireAdmin, (_req, res) => {
    res.json({ settings: read().settings, bibCounters: read().bibCounters });
  });

  app.put('/api/admin/settings', requireAdmin, smallJson, (req, res) => {
    const s = req.body?.settings || {};
    const counters = req.body?.bibCounters || {};
    const promptPayId = String(s.promptPayId || '').replace(/[^0-9]/g, '');
    if (![10, 13, 15].includes(promptPayId.length)) {
      res.status(400).json({ error: 'หมายเลขพร้อมเพย์ต้องเป็นเบอร์โทร 10 หลัก หรือเลขบัตร/เลขผู้เสียภาษี 13 หลัก' });
      return;
    }
    const current = read().bibCounters;
    for (const r of ROUTE_IDS) {
      const v = counters[r];
      if (v !== undefined && (!Number.isInteger(v) || v < current[r] || v > 9999)) {
        res.status(400).json({ error: `ลำดับ BIB ของ ${r} ต้องไม่น้อยกว่าที่ออกไปแล้ว (${current[r]})` });
        return;
      }
    }
    mutate((d) => {
      d.settings = {
        promptPayId,
        accountName: clean(s.accountName, 150) || d.settings.accountName,
        bankLabel: clean(s.bankLabel, 80) || d.settings.bankLabel,
        paymentTimeoutMinutes: Math.min(120, Math.max(5, Math.floor(Number(s.paymentTimeoutMinutes) || 15))),
      };
      for (const r of ROUTE_IDS) if (counters[r] !== undefined) d.bibCounters[r] = counters[r];
    });
    console.log(`[admin] ${(req as any).admin.username} updated settings`);
    res.json({ settings: read().settings, bibCounters: read().bibCounters });
  });

  app.get('/api/slip-verifier-status', requireAdmin, (_req, res) => {
    res.json(slipApiStatus());
  });

  app.post('/api/slip-verifier-config', requireAdmin, smallJson, (req, res) => {
    const { provider } = req.body || {};
    const key = clean(req.body?.apiKey, 200);
    const branch = clean(req.body?.branchId, 60);
    mutate((d) => {
      const s = d.slipApi;
      if (provider === 'EASYSLIP_API') Object.assign(s, { easySlipKey: key, thunderKey: '', slipOkKey: '', slipOkBranch: '' });
      else if (provider === 'THUNDER_API') Object.assign(s, { thunderKey: key, easySlipKey: '', slipOkKey: '', slipOkBranch: '' });
      else if (provider === 'SLIPOK_API') Object.assign(s, { slipOkKey: key, slipOkBranch: branch, easySlipKey: '', thunderKey: '' });
      else if (provider === 'OMISE_PROMPTPAY_WEBHOOK') s.omiseSecretKey = key;
      else if (provider === 'CLEAR') d.slipApi = {};
    });
    console.log(`[admin] ${(req as any).admin.username} changed slip API config (${provider})`);
    res.json({ success: true, ...slipApiStatus() });
  });

  // Any other /api path is a 404 (prevents the SPA fallback from answering API calls).
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}  (data: ${DATA_DIR})`);
  });
}

startServer();
