/**
 * Payment verification helpers.
 *
 * Trust model:
 *  - Omise: a charge counts as paid only after we fetch it from api.omise.co with
 *    our own secret key. Webhook bodies are treated as a hint, never as proof.
 *  - Bank slip APIs (EasySlip / Thunder / SlipOK): the Mini-QR payload is checked
 *    against bank records by the provider; we then check amount, receiver and
 *    reuse ourselves.
 *  - Gemini: advisory only. It helps the admin review a slip but can never
 *    approve a payment on its own (an image can always be edited).
 */
import { GoogleGenAI, Type } from '@google/genai';
import { getEffectiveSlipApiKeys, type PublicSettings } from './store';

// ---------------------------------------------------------------------------
// Omise
// ---------------------------------------------------------------------------
const OMISE_MIN_SATANG = 2000; // Omise PromptPay minimum is 20 THB

function omiseAuth(secretKey: string) {
  return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
}

export function omiseEnabledFor(amountBaht: number): boolean {
  const key = getEffectiveSlipApiKeys().omiseSecretKey;
  return Boolean(key) && Math.round(amountBaht * 100) >= OMISE_MIN_SATANG;
}

export async function createOmiseCharge(params: {
  amountBaht: number;
  orderId: string;
}): Promise<{ chargeId?: string; qrImageUrl?: string; error?: string }> {
  const secretKey = getEffectiveSlipApiKeys().omiseSecretKey;
  if (!secretKey) return { error: 'Omise not configured' };
  const body = new URLSearchParams();
  body.append('amount', String(Math.round(params.amountBaht * 100)));
  body.append('currency', 'THB');
  body.append('source[type]', 'promptpay');
  body.append('metadata[orderId]', params.orderId);
  try {
    const resp = await fetch('https://api.omise.co/charges', {
      method: 'POST',
      headers: {
        Authorization: omiseAuth(secretKey),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const json: any = await resp.json().catch(() => ({}));
    if (resp.ok && json?.id) {
      return {
        chargeId: json.id,
        qrImageUrl: json?.source?.scannable_code?.image?.download_uri || '',
      };
    }
    return { error: json?.message || `Omise HTTP ${resp.status}` };
  } catch (err: any) {
    return { error: err?.message || 'Cannot reach api.omise.co' };
  }
}

/** Fetches a charge from Omise with our secret key. This is the only proof of payment we accept from Omise. */
export async function fetchVerifiedOmiseCharge(chargeId: string): Promise<{
  paid: boolean;
  orderId?: string;
  amountSatang?: number;
  currency?: string;
  chargeId?: string;
} | null> {
  const secretKey = getEffectiveSlipApiKeys().omiseSecretKey;
  if (!secretKey || !/^chrg_[A-Za-z0-9_]+$/.test(chargeId)) return null;
  try {
    const resp = await fetch(`https://api.omise.co/charges/${encodeURIComponent(chargeId)}`, {
      headers: { Authorization: omiseAuth(secretKey) },
    });
    if (!resp.ok) return null;
    const c: any = await resp.json();
    return {
      paid: c?.status === 'successful' && c?.paid === true,
      orderId: c?.metadata?.orderId,
      amountSatang: Number(c?.amount),
      currency: String(c?.currency || '').toUpperCase(),
      chargeId: c?.id,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Bank slip verification APIs
// ---------------------------------------------------------------------------
export interface BankSlipOutcome {
  provider: 'EASYSLIP_API' | 'THUNDER_API' | 'SLIPOK_API' | 'NONE';
  /** true = provider confirmed the transfer exists in bank records */
  verified: boolean;
  /** true = we could not reach the provider (fall back to manual review) */
  unavailable?: boolean;
  amount?: number;
  transRef?: string;
  senderBank?: string;
  senderName?: string;
  receiverName?: string;
  receiverAccount?: string;
  transDate?: string;
  errorReason?: string;
}

export async function verifyWithBankSlipApi(
  qrPayload: string,
  expectedAmount: number
): Promise<BankSlipOutcome> {
  const k = getEffectiveSlipApiKeys();

  const parseEasyThunder = (provider: 'EASYSLIP_API' | 'THUNDER_API', d: any): BankSlipOutcome => ({
    provider,
    verified: true,
    amount: Number(d?.amount?.amount ?? -1),
    transRef: d?.transRef || '',
    senderBank: d?.sender?.bank?.name || d?.sender?.bank?.short || '',
    senderName: d?.sender?.account?.name?.th || d?.sender?.account?.name?.en || '',
    receiverName: d?.receiver?.account?.name?.th || d?.receiver?.account?.name?.en || '',
    receiverAccount:
      d?.receiver?.account?.proxy?.account || d?.receiver?.account?.bank?.account || '',
    transDate: d?.date || '',
  });

  const call = async (
    provider: BankSlipOutcome['provider'],
    fn: () => Promise<BankSlipOutcome>
  ): Promise<BankSlipOutcome> => {
    try {
      return await fn();
    } catch (err: any) {
      return { provider, verified: false, unavailable: true, errorReason: err?.message || 'network error' };
    }
  };

  if (k.easySlipKey) {
    return call('EASYSLIP_API', async () => {
      const resp = await fetch(
        `https://developer.easyslip.com/api/v1/verify?payload=${encodeURIComponent(qrPayload)}`,
        { headers: { Authorization: `Bearer ${k.easySlipKey}` } }
      );
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.status === 200 && json?.data) return parseEasyThunder('EASYSLIP_API', json.data);
      return {
        provider: 'EASYSLIP_API',
        verified: false,
        unavailable: resp.status >= 500 || resp.status === 429 || resp.status === 401 || resp.status === 403,
        errorReason: json?.message || `EasySlip ไม่พบรายการนี้ในระบบธนาคาร (HTTP ${resp.status})`,
      };
    });
  }

  if (k.thunderKey) {
    return call('THUNDER_API', async () => {
      const resp = await fetch(
        `https://api.thunder.in.th/v1/verify?payload=${encodeURIComponent(qrPayload)}`,
        { headers: { Authorization: `Bearer ${k.thunderKey}` } }
      );
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.status === 200 && json?.data) return parseEasyThunder('THUNDER_API', json.data);
      return {
        provider: 'THUNDER_API',
        verified: false,
        unavailable: resp.status >= 500 || resp.status === 429 || resp.status === 401 || resp.status === 403,
        errorReason: json?.message || `Thunder ไม่พบรายการนี้ในระบบธนาคาร (HTTP ${resp.status})`,
      };
    });
  }

  if (k.slipOkKey && k.slipOkBranch) {
    return call('SLIPOK_API', async () => {
      const resp = await fetch(
        `https://api.slipok.com/api/line/apikey/${encodeURIComponent(k.slipOkBranch)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-authorization': k.slipOkKey },
          body: JSON.stringify({ data: qrPayload, amount: expectedAmount, log: true }),
        }
      );
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.success && json?.data) {
        const d = json.data;
        return {
          provider: 'SLIPOK_API',
          verified: true,
          amount: Number(d?.amount ?? -1),
          transRef: d?.transRef || '',
          senderBank: d?.sendingBank || '',
          senderName: d?.sender?.displayName || d?.sender?.name || '',
          receiverName: d?.receiver?.displayName || d?.receiver?.name || '',
          receiverAccount: d?.receiver?.proxy?.value || d?.receiver?.account?.value || '',
          transDate: `${d?.transDate || ''} ${d?.transTime || ''}`.trim(),
        };
      }
      return {
        provider: 'SLIPOK_API',
        verified: false,
        unavailable: resp.status >= 500 || resp.status === 429 || resp.status === 401 || resp.status === 403,
        errorReason: json?.message || `SlipOK ปฏิเสธสลิปนี้ (HTTP ${resp.status})`,
      };
    });
  }

  return { provider: 'NONE', verified: false };
}

/**
 * Receiver check using data returned by the bank API (not the AI, not the browser).
 * Bank APIs usually mask account numbers, so we accept a match on the visible
 * trailing digits of the PromptPay ID, or on the account name.
 */
export function receiverMatches(
  outcome: BankSlipOutcome,
  settings: PublicSettings
): boolean {
  const expectedDigits = settings.promptPayId.replace(/\D/g, '');
  const accDigits = (outcome.receiverAccount || '').replace(/\D/g, '');
  const digitsOk =
    expectedDigits.length >= 4 && accDigits.length >= 4 && expectedDigits.endsWith(accDigits.slice(-4));

  const norm = (s: string) => s.toLowerCase().replace(/[\s().\-·/]+/g, '');
  const slipName = norm(outcome.receiverName || '');
  const expected = norm(settings.accountName);
  const nameOk = slipName.length >= 6 && (expected.includes(slipName) || slipName.includes(expected));

  const extraNames = (process.env.PROMPTPAY_RECEIVER_NAMES || '')
    .split(',')
    .map((s) => norm(s))
    .filter((s) => s.length >= 3);
  const aliasOk = extraNames.some((n) => slipName.includes(n));

  return digitsOk || nameOk || aliasOk;
}

// ---------------------------------------------------------------------------
// Gemini (advisory only)
// ---------------------------------------------------------------------------
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    })
  : null;

/** Returns a short Thai summary for the admin, or undefined if AI is unavailable. */
export async function aiSlipAdvisory(params: {
  mimeType: string;
  base64Data: string;
  expectedAmount: number;
  settings: PublicSettings;
}): Promise<string | undefined> {
  if (!ai) return undefined;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: params.mimeType, data: params.base64Data } },
          {
            text:
              `อ่านสลิปโอนเงินธนาคารไทยในภาพนี้ตามที่เห็นจริง ห้ามเดา\n` +
              `บัญชีผู้จัดงาน: "${params.settings.accountName}" พร้อมเพย์ ${params.settings.promptPayId}\n` +
              `ยอดที่ควรได้รับ: ${params.expectedAmount.toFixed(2)} บาท`,
          },
        ],
      },
      config: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isBankSlip: { type: Type.BOOLEAN },
            amount: { type: Type.NUMBER, description: 'Amount printed on slip, -1 if not found' },
            receiverName: { type: Type.STRING },
            receiverAccount: { type: Type.STRING },
            transactionRef: { type: Type.STRING },
            transferDateTime: { type: Type.STRING },
            tamperingSuspected: { type: Type.BOOLEAN },
          },
          required: ['isBankSlip', 'amount', 'receiverName', 'receiverAccount', 'transactionRef', 'transferDateTime', 'tamperingSuspected'],
        },
      },
    });
    const r = JSON.parse(response.text?.trim() || '{}');
    const amountOk = typeof r.amount === 'number' && Math.abs(r.amount - params.expectedAmount) <= 0.01;
    return [
      r.isBankSlip ? 'AI: ดูเหมือนสลิปธนาคาร' : 'AI: ไม่น่าใช่สลิปธนาคาร',
      `ยอด ${r.amount >= 0 ? Number(r.amount).toFixed(2) : '?'} บาท${amountOk ? ' (ตรง)' : ' (ไม่ตรง)'}`,
      `ผู้รับ ${r.receiverName || '?'} ${r.receiverAccount || ''}`.trim(),
      `อ้างอิง ${r.transactionRef || '?'}`,
      r.transferDateTime ? `เวลา ${r.transferDateTime}` : '',
      r.tamperingSuspected ? '⚠ สงสัยการตัดต่อ' : '',
    ]
      .filter(Boolean)
      .join(' · ');
  } catch (err: any) {
    console.warn('[gemini] advisory failed:', err?.message || err);
    return undefined;
  }
}
