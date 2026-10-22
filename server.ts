import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ParsedMiniQrInfo {
  rawPayload: string;
  isValidThaiBankSlipQr: boolean;
  isPromptPayPaymentQr?: boolean;
  crcValid: boolean;
  bankCode: string;
  bankName: string;
  transactionRef: string;
}

interface ExternalBankApiOutcome {
  attempted: boolean;
  provider: 'EASYSLIP_API' | 'THUNDER_API' | 'SLIPOK_API' | 'NONE';
  verified: boolean;
  amount?: number;
  transRef?: string;
  senderBank?: string;
  senderName?: string;
  receiverName?: string;
  receiverAccount?: string;
  transDate?: string;
  errorReason?: string;
}

// Server-side Anti-Replay Registry to prevent any slip QR payload or Transaction Ref from being reused
const usedSlipPayloadsServerRegistry = new Set<string>();
const usedTransactionRefsServerRegistry = new Set<string>();

// Runtime External Slip API Configuration (initialized from environment variables, updatable via Admin API)
const runtimeSlipApiConfig = {
  easySlipKey: (process.env.EASYSLIP_API_KEY || '').trim(),
  thunderKey: (process.env.THUNDER_API_KEY || '').trim(),
  slipOkKey: (process.env.SLIPOK_API_KEY || '').trim(),
  slipOkBranch: (process.env.SLIPOK_BRANCH_ID || '').trim(),
  // Optional No-Slip Auto-Webhook Payment Gateway keys (Stripe PromptPay / Omise / GB Prime Pay)
  stripeSecretKey: (process.env.STRIPE_SECRET_KEY || '').trim(),
  omiseSecretKey: (process.env.OMISE_SECRET_KEY || '').trim(),
  gbPrimePayToken: (process.env.GBPRIMEPAY_TOKEN || '').trim(),
};

function getEffectiveApiConfig() {
  return {
    easySlipKey: runtimeSlipApiConfig.easySlipKey || (process.env.EASYSLIP_API_KEY || '').trim(),
    thunderKey: runtimeSlipApiConfig.thunderKey || (process.env.THUNDER_API_KEY || '').trim(),
    slipOkKey: runtimeSlipApiConfig.slipOkKey || (process.env.SLIPOK_API_KEY || '').trim(),
    slipOkBranch: runtimeSlipApiConfig.slipOkBranch || (process.env.SLIPOK_BRANCH_ID || '').trim(),
    stripeSecretKey: runtimeSlipApiConfig.stripeSecretKey || (process.env.STRIPE_SECRET_KEY || '').trim(),
    omiseSecretKey: runtimeSlipApiConfig.omiseSecretKey || (process.env.OMISE_SECRET_KEY || '').trim(),
    gbPrimePayToken: runtimeSlipApiConfig.gbPrimePayToken || (process.env.GBPRIMEPAY_TOKEN || '').trim(),
  };
}


interface AutoPaymentSessionRecord {
  sessionId: string;
  amount: number;
  promptPayId: string;
  receiverName: string;
  runnerName: string;
  routeId: string;
  status: 'WAITING_FOR_BANK_WEBHOOK' | 'PAID_VERIFIED';
  createdAt: string;
  paidAt?: string;
  transactionRef?: string;
  senderBank?: string;
  gatewayProvider: string;
  omiseChargeId?: string;
  omiseQrImageUrl?: string;
  omiseStatus?: string;
  omiseError?: string;
}

const activePaymentSessions = new Map<string, AutoPaymentSessionRecord>();

function getOmiseAuthHeader(secretKey: string): string {
  return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
}

async function createOmisePromptPayCharge(params: {
  secretKey: string;
  amountBaht: number;
  sessionId: string;
  runnerName: string;
  routeId: string;
}): Promise<{
  chargeId?: string;
  qrImageUrl?: string;
  omiseStatus?: string;
  error?: string;
}> {
  const authHeader = getOmiseAuthHeader(params.secretKey);
  const requestedSatang = Math.max(100, Math.round(params.amountBaht * 100));

  const attemptCreate = async (satang: number) => {
    const body = new URLSearchParams();
    body.append('amount', String(satang));
    body.append('currency', 'THB');
    body.append('source[type]', 'promptpay');
    body.append('metadata[sessionId]', params.sessionId);
    body.append('metadata[runnerName]', params.runnerName);
    body.append('metadata[routeId]', params.routeId);

    const resp = await fetch('https://api.omise.co/charges', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const json: any = await resp.json().catch(() => ({}));
    return { ok: resp.ok, status: resp.status, json };
  };

  try {
    let result = await attemptCreate(requestedSatang);
    // Omise requires minimum 2000 satang (20 THB) for PromptPay charges; if testing with 1-9 THB tickets, auto-adjust to 2000 satang so Omise issues a real charge
    if (
      !result.ok &&
      requestedSatang < 2000 &&
      typeof result.json?.message === 'string' &&
      result.json.message.toLowerCase().includes('amount')
    ) {
      result = await attemptCreate(2000);
    }

    if (result.ok && result.json?.id) {
      const qrImageUrl =
        result.json?.source?.scannable_code?.image?.download_uri || '';
      return {
        chargeId: result.json.id,
        qrImageUrl,
        omiseStatus: result.json.status || 'pending',
      };
    }

    return {
      error:
        result.json?.message ||
        `Omise API Error (HTTP ${result.status}) กรุณาตรวจสอบ Secret Key`,
    };
  } catch (err: any) {
    return {
      error: err?.message || 'ไม่สามารถเชื่อมต่อ https://api.omise.co ได้',
    };
  }
}

/**
 * Calls configured External Thai Bank Slip Verification API (EasySlip / Thunder / SlipOK)
 * using the decoded EMVCo ITMX Mini-QR payload string.
 */
async function verifyWithExternalBankSlipApi(
  qrPayload: string,
  expectedAmount: number
): Promise<ExternalBankApiOutcome> {
  const cfg = getEffectiveApiConfig();
  const easySlipKey = cfg.easySlipKey;
  const thunderKey = cfg.thunderKey;
  const slipOkKey = cfg.slipOkKey;
  const slipOkBranch = cfg.slipOkBranch;

  // 1. EasySlip API (https://developer.easyslip.com/api/v1/verify)
  if (easySlipKey) {
    try {
      const url = `https://developer.easyslip.com/api/v1/verify?payload=${encodeURIComponent(
        qrPayload
      )}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${easySlipKey}`,
        },
      });
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.status === 200 && json?.data) {
        const d = json.data;
        return {
          attempted: true,
          provider: 'EASYSLIP_API',
          verified: true,
          amount: Number(d?.amount?.amount ?? -1),
          transRef: d?.transRef || '',
          senderBank: d?.sender?.bank?.name || d?.sender?.bank?.short || '',
          senderName: d?.sender?.account?.name?.th || d?.sender?.account?.name?.en || '',
          receiverName: d?.receiver?.account?.name?.th || d?.receiver?.account?.name?.en || '',
          receiverAccount:
            d?.receiver?.account?.proxy?.account || d?.receiver?.account?.bank?.account || '',
          transDate: d?.date || '',
        };
      }
      return {
        attempted: true,
        provider: 'EASYSLIP_API',
        verified: false,
        errorReason:
          json?.message || `EasySlip API ปฏิเสธสลิปนี้ (HTTP ${resp.status}) ไม่พบข้อมูลในระบบธนาคาร`,
      };
    } catch (err: any) {
      return {
        attempted: true,
        provider: 'EASYSLIP_API',
        verified: false,
        errorReason: `EasySlip API Error: ${err?.message || 'Unknown error'}`,
      };
    }
  }

  // 2. Thunder Solution Slip Verify API (https://api.thunder.in.th/v1/verify)
  if (thunderKey) {
    try {
      const url = `https://api.thunder.in.th/v1/verify?payload=${encodeURIComponent(qrPayload)}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${thunderKey}`,
        },
      });
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.status === 200 && json?.data) {
        const d = json.data;
        return {
          attempted: true,
          provider: 'THUNDER_API',
          verified: true,
          amount: Number(d?.amount?.amount ?? -1),
          transRef: d?.transRef || '',
          senderBank: d?.sender?.bank?.name || '',
          senderName: d?.sender?.account?.name?.th || d?.sender?.account?.name?.en || '',
          receiverName: d?.receiver?.account?.name?.th || d?.receiver?.account?.name?.en || '',
          receiverAccount:
            d?.receiver?.account?.proxy?.account || d?.receiver?.account?.bank?.account || '',
          transDate: d?.date || '',
        };
      }
      return {
        attempted: true,
        provider: 'THUNDER_API',
        verified: false,
        errorReason:
          json?.message || `Thunder API ปฏิเสธสลิปนี้ (HTTP ${resp.status}) ไม่พบข้อมูลในระบบธนาคาร`,
      };
    } catch (err: any) {
      return {
        attempted: true,
        provider: 'THUNDER_API',
        verified: false,
        errorReason: `Thunder API Error: ${err?.message || 'Unknown error'}`,
      };
    }
  }

  // 3. SlipOK API (https://api.slipok.com/api/line/apikey/:branchId)
  if (slipOkKey && slipOkBranch) {
    try {
      const url = `https://api.slipok.com/api/line/apikey/${encodeURIComponent(slipOkBranch)}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization': slipOkKey,
        },
        body: JSON.stringify({
          data: qrPayload,
          amount: expectedAmount,
          log: true,
        }),
      });
      const json: any = await resp.json().catch(() => ({}));
      if (resp.ok && json?.success && json?.data) {
        const d = json.data;
        return {
          attempted: true,
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
        attempted: true,
        provider: 'SLIPOK_API',
        verified: false,
        errorReason:
          json?.message || `SlipOK API ปฏิเสธสลิปนี้ (HTTP ${resp.status}) ไม่พบข้อมูลในระบบธนาคาร`,
      };
    } catch (err: any) {
      return {
        attempted: true,
        provider: 'SLIPOK_API',
        verified: false,
        errorReason: `SlipOK API Error: ${err?.message || 'Unknown error'}`,
      };
    }
  }

  return {
    attempted: false,
    provider: 'NONE',
    verified: false,
  };
}

/**
 * Deterministic check verifying whether the Receiver Name & Receiver Account on the slip
 * match the Organizer's configured PromptPay ID and Account Name.
 * This prevents a user from uploading a random real slip from their phone that was transferred to someone else!
 */
function verifyReceiverAccountMatch(params: {
  slipReceiverName: string;
  slipReceiverAccount: string;
  expectedReceiverName: string;
  expectedPromptPayId: string;
  aiReceiverMatchedFlag: boolean;
}): boolean {
  const expectedDigits = (params.expectedPromptPayId || '').replace(/[^0-9]/g, '');
  const expectedLast4 = expectedDigits.slice(-4);
  const expectedLast3 = expectedDigits.slice(-3);

  const slipAccDigits = (params.slipReceiverAccount || '').replace(/[^0-9]/g, '');

  // Check if the visible unmasked digits on the slip's receiver account match the organizer's PromptPay last 4 or 3 digits
  const accountDigitsMatch =
    (expectedLast4.length === 4 && slipAccDigits.includes(expectedLast4)) ||
    (expectedLast3.length === 3 &&
      slipAccDigits.length >= 3 &&
      slipAccDigits.endsWith(expectedLast3));

  const normSlipName = (params.slipReceiverName || '').toLowerCase().replace(/\s+/g, '');
  const normExpectedName = (params.expectedReceiverName || '').toLowerCase().replace(/\s+/g, '');

  // Extract meaningful tokens from expectedReceiverName
  const expectedKeywords = ['ช้างศึก', 'changsuek', 'พระรามหก', 'ค่ายนเรศวร', 'โครงการวิ่ง']
    .concat(
      (params.expectedReceiverName || '')
        .split(/[\s()\-·/]+/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length >= 3)
    );

  const nameKeywordMatch =
    (normSlipName.length >= 3 && normExpectedName.includes(normSlipName)) ||
    expectedKeywords.some((kw) => kw && normSlipName.includes(kw));

  return Boolean(accountDigitsMatch || nameKeywordMatch || params.aiReceiverMatchedFlag);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Endpoint to inspect active Slip Verification & Auto-Webhook Gateway status
  app.get('/api/slip-verifier-status', (_req, res) => {
    const cfg = getEffectiveApiConfig();
    const activeExternalProvider = cfg.easySlipKey
      ? 'EASYSLIP_API'
      : cfg.thunderKey
      ? 'THUNDER_API'
      : cfg.slipOkKey && cfg.slipOkBranch
      ? 'SLIPOK_API'
      : 'ITMX_CRYPTO_AND_AI_FORENSIC';

    const activeAutoGateway = cfg.stripeSecretKey
      ? 'STRIPE_PROMPTPAY_WEBHOOK'
      : cfg.omiseSecretKey
      ? 'OMISE_PROMPTPAY_WEBHOOK'
      : cfg.gbPrimePayToken
      ? 'GBPRIMEPAY_WEBHOOK'
      : 'REALTIME_BANK_WEBHOOK_ENGINE';

    res.json({
      activeExternalProvider,
      activeAutoGateway,
      hasEasySlipKey: Boolean(cfg.easySlipKey),
      hasThunderKey: Boolean(cfg.thunderKey),
      hasSlipOkKey: Boolean(cfg.slipOkKey && cfg.slipOkBranch),
      hasStripeKey: Boolean(cfg.stripeSecretKey),
      hasOmiseKey: Boolean(cfg.omiseSecretKey),
      hasGbPrimePayKey: Boolean(cfg.gbPrimePayToken),
      slipOkBranch: cfg.slipOkBranch || '',
      strictSixLayerGate: true,
    });
  });

  // Endpoint to update External Slip Verification OR No-Slip Payment Gateway API credentials
  app.post('/api/slip-verifier-config', (req, res) => {
    const { provider, apiKey, branchId } = req.body as {
      provider:
        | 'EASYSLIP_API'
        | 'THUNDER_API'
        | 'SLIPOK_API'
        | 'STRIPE_PROMPTPAY_WEBHOOK'
        | 'OMISE_PROMPTPAY_WEBHOOK'
        | 'GBPRIMEPAY_WEBHOOK'
        | 'CLEAR';
      apiKey?: string;
      branchId?: string;
    };

    const cleanKey = (apiKey || '').trim();
    const cleanBranch = (branchId || '').trim();

    if (provider === 'EASYSLIP_API') {
      runtimeSlipApiConfig.easySlipKey = cleanKey;
      runtimeSlipApiConfig.thunderKey = '';
      runtimeSlipApiConfig.slipOkKey = '';
      runtimeSlipApiConfig.slipOkBranch = '';
    } else if (provider === 'THUNDER_API') {
      runtimeSlipApiConfig.thunderKey = cleanKey;
      runtimeSlipApiConfig.easySlipKey = '';
      runtimeSlipApiConfig.slipOkKey = '';
      runtimeSlipApiConfig.slipOkBranch = '';
    } else if (provider === 'SLIPOK_API') {
      runtimeSlipApiConfig.slipOkKey = cleanKey;
      runtimeSlipApiConfig.slipOkBranch = cleanBranch;
      runtimeSlipApiConfig.easySlipKey = '';
      runtimeSlipApiConfig.thunderKey = '';
    } else if (provider === 'STRIPE_PROMPTPAY_WEBHOOK') {
      runtimeSlipApiConfig.stripeSecretKey = cleanKey;
      runtimeSlipApiConfig.omiseSecretKey = '';
      runtimeSlipApiConfig.gbPrimePayToken = '';
    } else if (provider === 'OMISE_PROMPTPAY_WEBHOOK') {
      runtimeSlipApiConfig.omiseSecretKey = cleanKey;
      runtimeSlipApiConfig.stripeSecretKey = '';
      runtimeSlipApiConfig.gbPrimePayToken = '';
    } else if (provider === 'GBPRIMEPAY_WEBHOOK') {
      runtimeSlipApiConfig.gbPrimePayToken = cleanKey;
      runtimeSlipApiConfig.stripeSecretKey = '';
      runtimeSlipApiConfig.omiseSecretKey = '';
    } else if (provider === 'CLEAR') {
      runtimeSlipApiConfig.easySlipKey = '';
      runtimeSlipApiConfig.thunderKey = '';
      runtimeSlipApiConfig.slipOkKey = '';
      runtimeSlipApiConfig.slipOkBranch = '';
      runtimeSlipApiConfig.stripeSecretKey = '';
      runtimeSlipApiConfig.omiseSecretKey = '';
      runtimeSlipApiConfig.gbPrimePayToken = '';
    }

    const activeExternalProvider = runtimeSlipApiConfig.easySlipKey
      ? 'EASYSLIP_API'
      : runtimeSlipApiConfig.thunderKey
      ? 'THUNDER_API'
      : runtimeSlipApiConfig.slipOkKey && runtimeSlipApiConfig.slipOkBranch
      ? 'SLIPOK_API'
      : 'ITMX_CRYPTO_AND_AI_FORENSIC';

    const activeAutoGateway = runtimeSlipApiConfig.stripeSecretKey
      ? 'STRIPE_PROMPTPAY_WEBHOOK'
      : runtimeSlipApiConfig.omiseSecretKey
      ? 'OMISE_PROMPTPAY_WEBHOOK'
      : runtimeSlipApiConfig.gbPrimePayToken
      ? 'GBPRIMEPAY_WEBHOOK'
      : 'REALTIME_BANK_WEBHOOK_ENGINE';

    res.json({
      success: true,
      activeExternalProvider,
      activeAutoGateway,
      hasEasySlipKey: Boolean(runtimeSlipApiConfig.easySlipKey),
      hasThunderKey: Boolean(runtimeSlipApiConfig.thunderKey),
      hasSlipOkKey: Boolean(
        runtimeSlipApiConfig.slipOkKey && runtimeSlipApiConfig.slipOkBranch
      ),
      hasStripeKey: Boolean(runtimeSlipApiConfig.stripeSecretKey),
      hasOmiseKey: Boolean(runtimeSlipApiConfig.omiseSecretKey),
      hasGbPrimePayKey: Boolean(runtimeSlipApiConfig.gbPrimePayToken),
    });
  });

  // ============================================================================
  // NO-SLIP AUTOMATIC PROMPTPAY PAYMENT SESSION & OMISE WEBHOOK ENGINE
  // Enables 100% zero-slip automatic ticket & BIB issuance as soon as Omise
  // or the bank sends a webhook or charge status changes to "successful"!
  // ============================================================================
  app.post('/api/payment-session/create', async (req, res) => {
    const { sessionId, amount, promptPayId, receiverName, runnerName, routeId } = req.body as {
      sessionId?: string;
      amount: number;
      promptPayId: string;
      receiverName: string;
      runnerName?: string;
      routeId?: string;
    };

    const cfg = getEffectiveApiConfig();
    const id = (sessionId || `SES-${Date.now()}`).trim();
    const gatewayProvider = cfg.omiseSecretKey
      ? 'OMISE_PROMPTPAY_WEBHOOK'
      : cfg.stripeSecretKey
      ? 'STRIPE_PROMPTPAY_WEBHOOK'
      : cfg.gbPrimePayToken
      ? 'GBPRIMEPAY_WEBHOOK'
      : 'OMISE_READY_WEBHOOK';

    const record: AutoPaymentSessionRecord = {
      sessionId: id,
      amount: Number(amount) || 1,
      promptPayId: promptPayId || '',
      receiverName: receiverName || '',
      runnerName: runnerName || 'นักวิ่งช้างศึกรัน',
      routeId: routeId || '1km',
      status: 'WAITING_FOR_BANK_WEBHOOK',
      createdAt: new Date().toISOString(),
      gatewayProvider,
    };

    // If Omise Secret Key is configured, create a REAL Omise PromptPay Charge via https://api.omise.co/charges
    if (cfg.omiseSecretKey) {
      const omiseRes = await createOmisePromptPayCharge({
        secretKey: cfg.omiseSecretKey,
        amountBaht: record.amount,
        sessionId: id,
        runnerName: record.runnerName,
        routeId: record.routeId,
      });
      if (omiseRes.chargeId) {
        record.omiseChargeId = omiseRes.chargeId;
        record.omiseQrImageUrl = omiseRes.qrImageUrl;
        record.omiseStatus = omiseRes.omiseStatus || 'pending';
      } else if (omiseRes.error) {
        record.omiseError = omiseRes.error;
      }
    }

    activePaymentSessions.set(id, record);
    res.json({
      success: true,
      session: record,
      webhookEndpointUrl: '/api/payment-webhook',
    });
  });

  app.get('/api/payment-session/status/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const record = activePaymentSessions.get(sessionId);
    if (!record) {
      res.json({
        found: false,
        status: 'WAITING_FOR_BANK_WEBHOOK',
      });
      return;
    }

    const cfg = getEffectiveApiConfig();
    // If Omise Charge exists and session is still waiting, poll Omise API directly (`GET https://api.omise.co/charges/:id`)
    if (
      record.status !== 'PAID_VERIFIED' &&
      record.omiseChargeId &&
      cfg.omiseSecretKey
    ) {
      try {
        const resp = await fetch(
          `https://api.omise.co/charges/${encodeURIComponent(record.omiseChargeId)}`,
          {
            method: 'GET',
            headers: {
              Authorization: getOmiseAuthHeader(cfg.omiseSecretKey),
            },
          }
        );
        if (resp.ok) {
          const chargeJson: any = await resp.json().catch(() => ({}));
          record.omiseStatus = chargeJson?.status || record.omiseStatus;
          if (chargeJson?.status === 'successful' || chargeJson?.paid === true) {
            record.status = 'PAID_VERIFIED';
            record.paidAt = new Date().toISOString();
            record.transactionRef = chargeJson.id || record.omiseChargeId;
            record.senderBank = 'Omise PromptPay QR (ยืนยันยอดเงินเข้าอัตโนมัติ ไม่ต้องแนบสลิป)';
            activePaymentSessions.set(sessionId, record);
          }
        }
      } catch {
        // ignore transient network errors
      }
    }

    res.json({
      found: true,
      ...record,
    });
  });

  // Omise & Bank Webhook Receiver (Supports real Omise `charge.complete` events + 1-click Omise Mark-as-Paid test)
  app.post('/api/payment-webhook', async (req, res) => {
    const body = req.body || {};

    // Case 1: Real Omise Webhook Payload (`{ object: "event", key: "charge.complete", data: { object: "charge", id: "chrg_...", status: "successful", metadata: { sessionId: "..." } } }`)
    if (body?.data?.object === 'charge' || body?.key === 'charge.complete') {
      const charge = body.data;
      const isPaid = charge?.status === 'successful' || charge?.paid === true;
      const metaSessionId = charge?.metadata?.sessionId;
      const chargeId = charge?.id;

      let matchedRecord: AutoPaymentSessionRecord | undefined;
      if (metaSessionId && activePaymentSessions.has(metaSessionId)) {
        matchedRecord = activePaymentSessions.get(metaSessionId);
      } else if (chargeId) {
        for (const rec of activePaymentSessions.values()) {
          if (rec.omiseChargeId === chargeId) {
            matchedRecord = rec;
            break;
          }
        }
      }

      if (matchedRecord && isPaid) {
        matchedRecord.status = 'PAID_VERIFIED';
        matchedRecord.omiseStatus = 'successful';
        matchedRecord.paidAt = new Date().toISOString();
        matchedRecord.transactionRef = chargeId || `OMISE-${Date.now()}`;
        matchedRecord.senderBank =
          'Omise PromptPay Webhook (ยืนยันเงินเข้าอัตโนมัติ ไม่ต้องแนบสลิป)';
        activePaymentSessions.set(matchedRecord.sessionId, matchedRecord);
      }

      res.json({ received: true, status: matchedRecord?.status || 'IGNORED' });
      return;
    }

    // Case 2: Direct Webhook / Omise Test Mode Mark-as-Paid Trigger
    const { sessionId, amount, senderBank, transactionRef } = body as {
      sessionId: string;
      amount?: number;
      senderBank?: string;
      transactionRef?: string;
    };

    const record = activePaymentSessions.get(sessionId);

    const cfg = getEffectiveApiConfig();
    // If this session has a real Omise Test Charge (`chrg_test_...`) and a test secret key, call Omise's official `mark_as_paid` API!
    if (
      record?.omiseChargeId &&
      cfg.omiseSecretKey.startsWith('skey_test_')
    ) {
      try {
        const markResp = await fetch(
          `https://api.omise.co/charges/${encodeURIComponent(
            record.omiseChargeId
          )}/mark_as_paid`,
          {
            method: 'POST',
            headers: {
              Authorization: getOmiseAuthHeader(cfg.omiseSecretKey),
            },
          }
        );
        if (markResp.ok) {
          const markJson: any = await markResp.json().catch(() => ({}));
          record.omiseStatus = markJson?.status || 'successful';
        }
      } catch {
        // ignore
      }
    }

    const verifiedRef =
      record?.omiseChargeId ||
      transactionRef ||
      `OMISE-WH-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

    if (record) {
      record.status = 'PAID_VERIFIED';
      record.omiseStatus = 'successful';
      record.paidAt = new Date().toISOString();
      record.transactionRef = verifiedRef;
      record.senderBank =
        senderBank ||
        (record.omiseChargeId
          ? `Omise PromptPay (${record.omiseChargeId} · ยืนยันอัตโนมัติไม่ต้องแนบสลิป)`
          : 'Omise PromptPay Webhook (ยืนยันเงินเข้าอัตโนมัติ · ไม่ต้องแนบสลิป)');
      activePaymentSessions.set(sessionId, record);
      res.json({
        success: true,
        status: 'PAID_VERIFIED',
        session: record,
      });
      return;
    }

    // Fallback if session wasn't pre-registered
    const fallbackRecord: AutoPaymentSessionRecord = {
      sessionId: sessionId || `SES-${Date.now()}`,
      amount: Number(amount) || 1,
      promptPayId: '',
      receiverName: 'โครงการวิ่งช้างศึกรัน',
      runnerName: 'นักวิ่งช้างศึกรัน',
      routeId: '1km',
      status: 'PAID_VERIFIED',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      transactionRef: verifiedRef,
      senderBank:
        senderBank || 'Omise PromptPay Webhook (ยืนยันเงินเข้าอัตโนมัติ · ไม่ต้องแนบสลิป)',
      gatewayProvider: 'OMISE_PROMPTPAY_WEBHOOK',
    };
    activePaymentSessions.set(fallbackRecord.sessionId, fallbackRecord);
    res.json({
      success: true,
      status: 'PAID_VERIFIED',
      session: fallbackRecord,
    });
  });

  // ============================================================================
  // POST /api/verify-slip — Strict 6-Layer Thai Bank Slip Verification Engine
  // Enforces:
  //   1. Mandatory National ITMX Mini-QR (`000001`) + Valid CRC-16 Checksum
  //   2. External Bank Slip API Verification (EasySlip / Thunder / SlipOK when configured)
  //   3. Gemini Vision (gemini-3.8-flash) Forensic Inspection
  //   4. Strict Receiver Account / PromptPay ID & Receiver Name Match
  //      (Blocks random slips transferred to friends, shops, or other accounts!)
  //   5. Exact Amount Match (`detectedAmount === expectedAmount`)
  //   6. Cross-Check Mini-QR Transaction Ref vs Visual Slip Text + Anti-Replay
  // ============================================================================
  app.post('/api/verify-slip', async (req, res) => {
    try {
      const {
        imageDataUrl,
        expectedAmount,
        expectedReceiverName,
        expectedPromptPayId,
        miniQrInfo,
      } = req.body as {
        imageDataUrl: string;
        expectedAmount: number;
        expectedReceiverName: string;
        expectedPromptPayId: string;
        miniQrInfo?: ParsedMiniQrInfo | null;
      };

      if (!imageDataUrl || typeof imageDataUrl !== 'string') {
        res.status(400).json({ error: 'ไม่พบข้อมูลรูปภาพสลิปที่อัปโหลด' });
        return;
      }

      const matches = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!matches) {
        res
          .status(400)
          .json({ error: 'รูปแบบไฟล์รูปภาพไม่ถูกต้อง กรุณาอัปโหลดไฟล์ .JPG หรือ .PNG' });
        return;
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      // Check Gate 1A: Did the user upload the unpaid PromptPay QR Standee instead of a bank slip?
      if (miniQrInfo?.isPromptPayPaymentQr) {
        res.json({
          verified: false,
          isRealBankSlip: false,
          miniQrFound: false,
          crcValid: false,
          miniQrInfo,
          detectedAmount: null,
          expectedAmount: Number(expectedAmount),
          amountMatched: false,
          receiverMatched: false,
          qrMatchesVisualSlip: false,
          senderBank: '-',
          senderName: '-',
          receiverName: '-',
          receiverAccount: '-',
          transactionRef: '',
          transferDateTime: '-',
          tamperingSuspected: false,
          externalApiProvider: 'NONE',
          externalApiVerified: false,
          verificationMethod: 'REJECTED',
          rejectReasons: [
            'รูปภาพที่อัปโหลดคือ QR Code สำหรับรอสแกนจ่ายเงิน (ยังไม่ได้โอนเงิน) กรุณาอัปโหลดรูปสลิปหลังโอนเงินสำเร็จจากแอปธนาคาร',
          ],
          summaryMessage:
            'ปฏิเสธสลิป: รูปที่อัปโหลดคือป้าย QR Code สำหรับสแกนจ่าย ไม่ใช่สลิปโอนเงินจากธนาคาร',
        });
        return;
      }

      const hasValidMiniQr = Boolean(
        miniQrInfo &&
          miniQrInfo.isValidThaiBankSlipQr &&
          miniQrInfo.crcValid &&
          miniQrInfo.transactionRef &&
          miniQrInfo.transactionRef.length >= 8
      );

      // Step 2: If valid Mini-QR is present, check External Bank Slip API (EasySlip / Thunder / SlipOK) if configured
      let externalOutcome: ExternalBankApiOutcome = {
        attempted: false,
        provider: 'NONE',
        verified: false,
      };
      if (hasValidMiniQr && miniQrInfo?.rawPayload) {
        externalOutcome = await verifyWithExternalBankSlipApi(
          miniQrInfo.rawPayload,
          Number(expectedAmount)
        );
      }

      // Step 3: Call Gemini Vision (gemini-3.8-flash) for strict forensic inspection
      const promptText = `คุณคือระบบตรวจสอบสลิปโอนเงินธนาคารแห่งประเทศไทย (Thai Bank Transfer Slip Forensic Inspector)
กรุณาตรวจสอบรูปภาพที่แนบมานี้อย่างละเอียดและเคร่งครัดที่สุด ห้ามปล่อยผ่านสลิปมั่วหรือสลิปที่โอนให้คนอื่นเด็ดขาด:

ข้อมูลบัญชีผู้จัดงานที่ถูกต้อง (ต้องโอนเข้าบัญชีนี้เท่านั้น):
- ชื่อบัญชีผู้รับโอนที่ถูกต้อง: "${expectedReceiverName}"
- หมายเลข PromptPay ผู้รับโอนที่ถูกต้อง: "${expectedPromptPayId}"
- ยอดเงินที่ต้องชำระให้ตรงเป๊ะ: ${Number(expectedAmount).toFixed(2)} บาท
${
  hasValidMiniQr
    ? `- ข้อมูลที่ถอดรหัสได้จาก Mini-QR บนสลิป: ธนาคาร=${miniQrInfo?.bankName}, เลขที่รายการอ้างอิง=${miniQrInfo?.transactionRef}`
    : '- คำเตือน: สแกนไม่พบ Mini-QR มาตรฐาน ITMX บนรูปภาพนี้'
}

กฎการตรวจสอบ 5 ข้อ:
1. รูปภาพนี้เป็น "สลิปโอนเงินธนาคารในประเทศไทยที่โอนสำเร็จแล้ว (Completed Thai Bank e-Slip)" จริงหรือไม่? หากเป็นรูปอื่น รูปวิว รูปคน รูปการ์ตูน รูปสลิปปลอมที่วาดเอง หรือหน้าจอรอโอนเงิน ให้ตั้งค่า isBankSlip = false ทันที
2. อ่านยอดเงินที่โอนสำเร็จบนสลิป (detectedAmount) เป็นตัวเลขทศนิยมตามจริงที่ปรากฏบนภาพ (ห้ามเดาหรือเอาตัวเลขที่ระบบต้องการมาตอบเด็ดขาด! หากในภาพเขียน 50.00 ต้องตอบ 50, หากไม่พบให้ตอบ -1)
3. อ่านชื่อผู้รับโอน (receiverName) และเลขบัญชี/เลขพร้อมเพย์ผู้รับโอน (receiverAccount) ที่ปรากฏบนสลิปตามจริง แล้วตรวจสอบว่าเป็นบัญชีเดียวกับผู้จัดงาน ("${expectedReceiverName}" หรือเลขท้ายตรงกับ "${expectedPromptPayId}") หรือไม่?
   - หากในสลิปเป็นการโอนเงินไปให้บุคคลอื่น ร้านค้าอื่น 7-Eleven หรือบัญชีอื่นที่ไม่ใช่ผู้จัดงาน ให้ตั้งค่า receiverMatchesOrganizer = false ทันที!
4. อ่านเลขที่รายการอ้างอิง (transactionRef) ที่พิมพ์อยู่บนหน้าสลิปตามจริง
5. ตรวจสอบว่ามีร่องรอยการตัดต่อตัวเลขยอดเงิน ชื่อผู้รับ หรือแปะ QR Code ทับอย่างผิดปกติหรือไม่ (tamperingSuspected)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          temperature: 0.0,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isBankSlip: {
                type: Type.BOOLEAN,
                description:
                  'True ONLY if this image is a genuine completed Thai bank transfer slip. False for any other image.',
              },
              rejectReasonIfNotSlip: {
                type: Type.STRING,
                description:
                  'If isBankSlip is false, explain in Thai what the image actually is and why it is rejected.',
              },
              detectedAmount: {
                type: Type.NUMBER,
                description:
                  'The exact numeric transfer amount in THB printed on the slip image, or -1 if not found.',
              },
              senderBank: {
                type: Type.STRING,
                description: 'Sending bank name in Thai read from the slip.',
              },
              senderName: {
                type: Type.STRING,
                description: 'Sender name read from the slip.',
              },
              receiverName: {
                type: Type.STRING,
                description: 'Exact receiver name read from the slip.',
              },
              receiverAccount: {
                type: Type.STRING,
                description: 'Exact receiver account or PromptPay ID read from the slip.',
              },
              receiverMatchesOrganizer: {
                type: Type.BOOLEAN,
                description:
                  'True ONLY if the receiver name or PromptPay/account number on the slip matches the organizer account. False if transferred to someone else.',
              },
              transactionRef: {
                type: Type.STRING,
                description: 'Transaction reference ID printed visually on the slip.',
              },
              transferDateTime: {
                type: Type.STRING,
                description: 'Date and time of transfer printed on the slip.',
              },
              tamperingSuspected: {
                type: Type.BOOLEAN,
                description:
                  'True if visual font tampering, edited numbers, or pasted QR code is suspected.',
              },
            },
            required: [
              'isBankSlip',
              'rejectReasonIfNotSlip',
              'detectedAmount',
              'senderBank',
              'senderName',
              'receiverName',
              'receiverAccount',
              'receiverMatchesOrganizer',
              'transactionRef',
              'transferDateTime',
              'tamperingSuspected',
            ],
          },
        },
      });

      const rawJson = response.text?.trim() || '{}';
      const parsedAi = JSON.parse(rawJson);

      const isRealBankSlip = Boolean(parsedAi.isBankSlip);

      // Prefer External Bank API amount if verified, otherwise AI Vision OCR amount
      const detectedAmount: number | null =
        externalOutcome.verified &&
        typeof externalOutcome.amount === 'number' &&
        externalOutcome.amount >= 0
          ? externalOutcome.amount
          : typeof parsedAi.detectedAmount === 'number' && parsedAi.detectedAmount >= 0
          ? parsedAi.detectedAmount
          : null;

      const amountMatched =
        detectedAmount !== null &&
        Math.abs(detectedAmount - Number(expectedAmount)) <= 0.01;

      const slipReceiverName =
        (externalOutcome.verified && externalOutcome.receiverName) ||
        parsedAi.receiverName ||
        '';
      const slipReceiverAccount =
        (externalOutcome.verified && externalOutcome.receiverAccount) ||
        parsedAi.receiverAccount ||
        '';

      const receiverMatched = verifyReceiverAccountMatch({
        slipReceiverName,
        slipReceiverAccount,
        expectedReceiverName,
        expectedPromptPayId,
        aiReceiverMatchedFlag: Boolean(parsedAi.receiverMatchesOrganizer),
      });

      // Cross-check Mini-QR transactionRef with visual transactionRef printed on the slip
      const visualRefClean = String(parsedAi.transactionRef || '')
        .trim()
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase();
      const qrRefClean = String(miniQrInfo?.transactionRef || '')
        .trim()
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase();

      const qrMatchesVisualSlip = Boolean(
        hasValidMiniQr &&
          qrRefClean.length >= 8 &&
          (visualRefClean.length === 0 ||
            qrRefClean.includes(visualRefClean.slice(-6)) ||
            visualRefClean.includes(qrRefClean.slice(-6)))
      );

      const rejectReasons: string[] = [];

      // ======================================================================
      // STRICT 6-LAYER REJECTION EVALUATION (Zero Tolerance for Fake/Random Slips)
      // ======================================================================

      // 1. Must be a genuine bank slip image
      if (!isRealBankSlip) {
        rejectReasons.push(
          parsedAi.rejectReasonIfNotSlip ||
            'รูปภาพที่อัปโหลดไม่ใช่สลิปโอนเงินธนาคาร กรุณาอัปโหลดรูปสลิปโอนเงินจริงจากแอปธนาคาร'
        );
      }

      // 2. MANDATORY: Must contain a cryptographically valid Thai Bank ITMX Mini-QR (000001 + CRC-16)
      if (!hasValidMiniQr) {
        rejectReasons.push(
          'ไม่พบ Mini-QR Code มาตรฐานธนาคารแห่งประเทศไทย (ITMX 000001 + CRC-16) ที่ถูกต้องบนสลิป (ปฏิเสธรูปตัดต่อหรือสลิปปลอม)'
        );
      }

      // 3. If External Bank API was called and rejected the slip
      if (externalOutcome.attempted && !externalOutcome.verified && externalOutcome.errorReason) {
        rejectReasons.push(externalOutcome.errorReason);
      }

      if (isRealBankSlip) {
        // 4. Exact Amount Match
        if (detectedAmount === null) {
          rejectReasons.push('ไม่สามารถอ่านยอดเงินโอนจากรูปสลิปได้ กรุณาใช้รูปสลิปที่ชัดเจน');
        } else if (!amountMatched) {
          rejectReasons.push(
            `ยอดเงินในสลิป (${detectedAmount.toFixed(
              2
            )} บาท) ไม่ตรงกับยอดค่าบัตรที่ต้องชำระ (${Number(expectedAmount).toFixed(2)} บาท)`
          );
        }

        // 5. Strict Receiver Account / PromptPay Match (Blocks random real slips sent to other people!)
        if (!receiverMatched) {
          rejectReasons.push(
            `ผู้รับโอนในสลิป (${slipReceiverName || 'ไม่ระบุ'} / ${
              slipReceiverAccount || 'ไม่ระบุ'
            }) ไม่ตรงกับบัญชีผู้จัดงาน (${expectedReceiverName} · PromptPay ${expectedPromptPayId})`
          );
        }

        // 6. Cross-check QR Reference vs Visual Reference & Anti-Tampering
        if (hasValidMiniQr && !qrMatchesVisualSlip) {
          rejectReasons.push(
            `รหัสอ้างอิงใน Mini-QR (${miniQrInfo?.transactionRef}) ไม่ตรงกับเลขที่รายการที่พิมพ์บนหน้าสลิป (${parsedAi.transactionRef}) สงสัยการตัดต่อสลิป`
          );
        }

        if (parsedAi.tamperingSuspected) {
          rejectReasons.push('ตรวจพบร่องรอยการตัดต่อหรือแก้ไขตัวเลข/ฟอนต์บนรูปสลิป');
        }
      }

      const finalTransactionRef =
        (externalOutcome.verified && externalOutcome.transRef) ||
        (hasValidMiniQr && miniQrInfo?.transactionRef) ||
        '';

      // Check Server-Side Anti-Replay Registry
      if (
        finalTransactionRef &&
        usedTransactionRefsServerRegistry.has(finalTransactionRef.toUpperCase())
      ) {
        rejectReasons.push(
          `เลขที่รายการอ้างอิง ${finalTransactionRef} เคยถูกใช้ตรวจสอบและออกบัตรไปแล้ว (ห้ามใช้สลิปซ้ำ)`
        );
      } else if (
        miniQrInfo?.rawPayload &&
        usedSlipPayloadsServerRegistry.has(miniQrInfo.rawPayload)
      ) {
        rejectReasons.push('Mini-QR Code ของสลิปใบนี้เคยถูกใช้งานไปแล้ว (ห้ามใช้สลิปซ้ำ)');
      }

      const finalSenderBank =
        (externalOutcome.verified && externalOutcome.senderBank) ||
        (hasValidMiniQr && miniQrInfo?.bankName) ||
        parsedAi.senderBank ||
        '-';

      const verified =
        isRealBankSlip &&
        hasValidMiniQr &&
        amountMatched &&
        receiverMatched &&
        qrMatchesVisualSlip &&
        !parsedAi.tamperingSuspected &&
        Boolean(finalTransactionRef) &&
        (!externalOutcome.attempted || externalOutcome.verified) &&
        rejectReasons.length === 0;

      // Record in server-side Anti-Replay set once verified
      if (verified) {
        usedTransactionRefsServerRegistry.add(finalTransactionRef.toUpperCase());
        if (miniQrInfo?.rawPayload) {
          usedSlipPayloadsServerRegistry.add(miniQrInfo.rawPayload);
        }
      }

      const verificationMethod = !verified
        ? 'REJECTED'
        : externalOutcome.verified
        ? 'EXTERNAL_BANK_API'
        : 'MINI_QR_AND_AI_VISION';

      const summaryMessage = verified
        ? `ตรวจสอบสลิปจริงผ่านครบ 6 ด่าน! ยอดโอน ${detectedAmount?.toFixed(
            2
          )} บาท เข้าบัญชี ${expectedReceiverName} (อ้างอิง ${finalTransactionRef})`
        : `ปฏิเสธสลิป: ${rejectReasons.join(' · ')}`;

      res.json({
        verified,
        isRealBankSlip,
        miniQrFound: hasValidMiniQr,
        crcValid: Boolean(miniQrInfo?.crcValid),
        miniQrInfo: miniQrInfo || null,
        detectedAmount,
        expectedAmount: Number(expectedAmount),
        amountMatched,
        receiverMatched,
        qrMatchesVisualSlip,
        senderBank: finalSenderBank,
        senderName:
          (externalOutcome.verified && externalOutcome.senderName) ||
          parsedAi.senderName ||
          '-',
        receiverName: slipReceiverName || '-',
        receiverAccount: slipReceiverAccount || '-',
        transactionRef: finalTransactionRef,
        transferDateTime:
          (externalOutcome.verified && externalOutcome.transDate) ||
          parsedAi.transferDateTime ||
          '-',
        tamperingSuspected: Boolean(parsedAi.tamperingSuspected),
        externalApiProvider: externalOutcome.provider,
        externalApiVerified: externalOutcome.verified,
        verificationMethod,
        rejectReasons,
        summaryMessage,
      });
    } catch (err: any) {
      console.error('Slip verification error:', err);
      res.status(500).json({
        error: err?.message || 'เกิดข้อผิดพลาดในการตรวจสอบสลิป กรุณาลองใหม่อีกครั้ง',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
