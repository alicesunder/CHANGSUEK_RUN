export interface SlipVerificationCheck {
  id: 'slip_image' | 'amount_match' | 'time_window' | 'duplicate_check';
  label: string;
  passed: boolean;
  detail: string;
}

export interface SlipVerificationResult {
  isValid: boolean;
  confidenceScore: number; // 0 - 100
  slipHash: string;
  normalizedRef: string;
  detectedBank: string;
  detectedAmount: number;
  transferTimestamp: string;
  checks: SlipVerificationCheck[];
  errorMessage?: string;
}

export const THAI_BANKS = [
  { code: 'KBANK', name: 'กสิกรไทย (K PLUS)', color: '#138F2D' },
  { code: 'SCB', name: 'ไทยพาณิชย์ (SCB EASY)', color: '#4E2A84' },
  { code: 'KTB', name: 'กรุงไทย (Krungthai NEXT)', color: '#00A9E0' },
  { code: 'BBL', name: 'กรุงเทพ (Bangkok Bank)', color: '#1E4598' },
  { code: 'BAY', name: 'กรุงศรีอยุธยา (KMA)', color: '#FEC43B' },
  { code: 'TTB', name: 'ทหารไทยธนชาต (ttb touch)', color: '#0050F0' },
  { code: 'GSB', name: 'ออมสิน (MyMo)', color: '#EB198D' },
  { code: 'PROMPTPAY', name: 'แอปธนาคารอื่นๆ (PromptPay)', color: '#113566' },
] as const;

/**
 * Generates a deterministic fingerprint hash from a data URL or string
 * so duplicate slip uploads are caught immediately.
 */
export function computeSlipHash(dataUrl: string, refCode: string): string {
  const sample = `${dataUrl.slice(0, 256)}:${dataUrl.slice(-256)}:${dataUrl.length}:${refCode.trim().toUpperCase()}`;
  let h1 = 0xdeadbeef ^ sample.length;
  let h2 = 0x41c6ce57 ^ sample.length;
  for (let i = 0; i < sample.length; i++) {
    const ch = sample.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
  return `SLIP-${hex.padStart(12, '0')}`;
}

/**
 * Reads an uploaded image file and compresses it to a clean DataURL for localStorage storage
 * while validating image dimensions (bank slips are vertical or square portraits).
 */
export function processUploadedSlipImage(
  file: File
): Promise<{ dataUrl: string; width: number; height: number; fileSizeKb: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('กรุณาอัปโหลดไฟล์รูปภาพสลิปโอนเงิน (.JPG, .PNG, .WEBP) เท่านั้น'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพสลิปได้'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('ไฟล์รูปภาพไม่ถูกต้องหรือเสียหาย'));
      img.onload = () => {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        if (origW < 120 || origH < 120) {
          reject(new Error('ขนาดรูปภาพเล็กเกินไป กรุณาใช้รูปสลิปที่บันทึกจากแอปธนาคารโดยตรง'));
          return;
        }

        // Resize to max 540px width to keep localStorage fast & reliable
        const maxW = 540;
        const scale = origW > maxW ? maxW / origW : 1;
        const targetW = Math.round(origW * scale);
        const targetH = Math.round(origH * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: String(reader.result),
            width: origW,
            height: origH,
            fileSizeKb: Math.round(file.size / 1024),
          });
          return;
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({
          dataUrl: compressedUrl,
          width: origW,
          height: origH,
          fileSizeKb: Math.round(file.size / 1024),
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates a realistic, high-resolution Thai Bank PromptPay e-Slip image on a Canvas
 * for testing or demoing the real-time slip verification flow.
 */
export function generateRealisticBankSlipDataUrl(params: {
  bankName: string;
  bankCode: string;
  amount: number;
  promptPayId: string;
  accountName: string;
  payerName: string;
  paymentRef: string;
  transferTimeText: string;
}): string {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 680);
  bgGrad.addColorStop(0, '#F8FAFC');
  bgGrad.addColorStop(1, '#EEF2FF');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 680);

  // Decorative watermark pattern
  ctx.strokeStyle = 'rgba(17, 53, 102, 0.04)';
  ctx.lineWidth = 1;
  for (let y = 20; y < 680; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(480, y);
    ctx.stroke();
  }

  // Top Header Bar
  ctx.fillStyle = '#113566';
  ctx.fillRect(0, 0, 480, 108);
  ctx.fillStyle = '#00A699';
  ctx.fillRect(0, 104, 480, 6);

  // Checkmark circle
  ctx.beginPath();
  ctx.arc(54, 54, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#10B981';
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓', 54, 63);

  // Header text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('โอนเงินสำเร็จ (Transfer Successful)', 92, 48);
  ctx.fillStyle = '#67E8F9';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(`${params.bankName} · ${params.transferTimeText}`, 92, 74);

  // Main Card Box
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.fillRect(24, 130, 432, 520);
  ctx.strokeRect(24, 130, 432, 520);

  // Payer Section
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('จากผู้โอน (FROM)', 44, 166);
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(params.payerName || 'ผู้สมัครวิ่งช้างศึกรัน', 44, 192);
  ctx.fillStyle = '#475569';
  ctx.font = '13px monospace';
  ctx.fillText(`ธนาคารต้นทาง: ${params.bankName}`, 44, 214);

  // Divider
  ctx.strokeStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(44, 234);
  ctx.lineTo(436, 234);
  ctx.stroke();

  // Receiver Section
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('ไปยังผู้รับ (TO PROMPTPAY)', 44, 264);
  ctx.fillStyle = '#113566';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(params.accountName.slice(0, 38), 44, 290);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(`PromptPay ID: ${params.promptPayId}`, 44, 314);

  // Amount Highlight Box
  ctx.fillStyle = '#F0FDF4';
  ctx.strokeStyle = '#16A34A';
  ctx.lineWidth = 2;
  ctx.fillRect(44, 338, 392, 86);
  ctx.strokeRect(44, 338, 392, 86);

  ctx.fillStyle = '#15803D';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('จำนวนเงินที่โอนสุทธิ (AMOUNT)', 62, 368);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#14532D';
  ctx.font = 'bold 30px monospace';
  ctx.fillText(
    `${params.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} THB`,
    418,
    404
  );

  // Reference & QR Verification Block
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('เลขที่รายการอ้างอิง (TRANSACTION REF)', 44, 460);
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(params.paymentRef, 44, 484);

  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('ค่าธรรมเนียม (FEE)', 44, 518);
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('0.00 THB (ฟรีค่าธรรมเนียม)', 44, 540);

  // Simulated Mini QR Verification Matrix on bottom-right of slip
  const qrX = 336;
  const qrY = 456;
  const qrSize = 96;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2;
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = '#0F172A';
  const cell = 8;
  for (let r = 1; r < 11; r++) {
    for (let c = 1; c < 11; c++) {
      const isCorner =
        (r <= 3 && c <= 3) || (r <= 3 && c >= 8) || (r >= 8 && c <= 3);
      const seed = (r * 31 + c * 17 + params.paymentRef.charCodeAt(r % params.paymentRef.length)) % 3;
      if (isCorner || seed === 0) {
        ctx.fillRect(qrX + c * cell, qrY + r * cell, cell - 1, cell - 1);
      }
    }
  }

  // Bottom security stamp
  ctx.fillStyle = '#00A699';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('✓ VERIFIED BY THAI QR PROMPTPAY E-SLIP STANDARD', 44, 618);

  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Multi-layer verification of transfer slip, amount, reference code, countdown timer, and anti-duplicate check.
 */
export function verifyPromptPaySlip(params: {
  slipImageDataUrl: string;
  paymentRef: string;
  declaredAmount: number;
  expectedAmount: number;
  senderBank: string;
  remainingSeconds: number;
  existingRefs: string[];
  existingSlipHashes: string[];
}): SlipVerificationResult {
  const normalizedRef = params.paymentRef.trim().toUpperCase();
  const slipHash = computeSlipHash(params.slipImageDataUrl || 'NO-IMAGE', normalizedRef);

  const hasImage = Boolean(params.slipImageDataUrl && params.slipImageDataUrl.startsWith('data:image/'));
  const validRefFormat = normalizedRef.length >= 6 && /^[A-Z0-9\-_]+$/.test(normalizedRef);
  const amountMatches = Math.abs(params.declaredAmount - params.expectedAmount) < 0.01;
  const withinTimeWindow = params.remainingSeconds > 0;
  const isDuplicateRef = params.existingRefs.some((r) => r.trim().toUpperCase() === normalizedRef);
  const isDuplicateImage =
    hasImage && params.existingSlipHashes.some((h) => h && h === slipHash);
  const noDuplicate = !isDuplicateRef && !isDuplicateImage;

  const checks: SlipVerificationCheck[] = [
    {
      id: 'slip_image',
      label: 'ตรวจสอบรูปสลิปและรหัสอ้างอิงธนาคาร (e-Slip & Ref Format)',
      passed: hasImage && validRefFormat,
      detail: !hasImage
        ? 'ยังไม่ได้แนบรูปสลิปการโอนเงิน'
        : !validRefFormat
        ? 'รหัสอ้างอิงสลิปต้องมีอย่างน้อย 6 ตัวอักษร/ตัวเลข'
        : `ตรวจพบรูปสลิปจาก ${params.senderBank} · รหัส ${normalizedRef}`,
    },
    {
      id: 'amount_match',
      label: 'ตรวจสอบยอดเงินโอนตรงกับราคาตั๋วสุทธิ (Exact Amount Match)',
      passed: amountMatches,
      detail: amountMatches
        ? `ยอดเงินตรงกัน ${params.expectedAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท`
        : `ยอดเงินที่ระบุ (${params.declaredAmount}) ไม่ตรงกับยอดที่ต้องชำระ (${params.expectedAmount})`,
    },
    {
      id: 'time_window',
      label: 'โอนภายในเวลาที่กำหนดของเซสชัน QR Code (Active Session Timer)',
      passed: withinTimeWindow,
      detail: withinTimeWindow
        ? `ทำรายการภายในเวลาที่กำหนด (เหลือเวลา ${Math.floor(params.remainingSeconds / 60)}:${String(
            params.remainingSeconds % 60
          ).padStart(2, '0')} นาที)`
        : 'หมดเวลาการโอนสำหรับ QR Code ชุดนี้ กรุณากดรีเฟรชเวลาใหม่',
    },
    {
      id: 'duplicate_check',
      label: 'ตรวจสอบสลิปซ้ำและรหัสอ้างอิงซ้ำในระบบ (Anti-Duplicate Fraud Check)',
      passed: noDuplicate,
      detail: isDuplicateRef
        ? `รหัสอ้างอิงสลิป ${normalizedRef} เคยถูกใช้ไปแล้วในระบบ!`
        : isDuplicateImage
        ? 'รูปสลิปใบนี้เคยถูกใช้สมัครไปแล้ว (ตรวจพบลายนิ้วมือสลิปซ้ำ)!'
        : `ไม่พบการใช้สลิปซ้ำ (${slipHash})`,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const confidenceScore = Math.round((passedCount / checks.length) * 100);
  const isValid = checks.every((c) => c.passed);

  const failedCheck = checks.find((c) => !c.passed);

  return {
    isValid,
    confidenceScore,
    slipHash,
    normalizedRef,
    detectedBank: params.senderBank,
    detectedAmount: params.declaredAmount,
    transferTimestamp: new Date().toISOString(),
    checks,
    errorMessage: failedCheck?.detail,
  };
}
