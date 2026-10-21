import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import {
  X,
  Check,
  Minus,
  Plus,
  UserPlus,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Shirt,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Medal,
  Ticket,
  QrCode,
  CheckCircle2,
  CreditCard,
  Download,
  Copy,
  ShieldCheck,
  IdCard,
  FileText,
  Printer,
  Upload,
  RotateCcw,
  AlertTriangle,
  ScanLine,
  Timer,
  Building2,
  Eye,
  Trophy,
  PartyPopper,
} from 'lucide-react';
import { RouteId } from '../types';
import { DogCharacter, ElephantCharacter } from './brand/BrandCharacters';
import { PawIcon } from './brand/DogDecor';
import { TICKET_CARD_IMAGES } from './brand/TicketCardArtwork';
import { playVictoryCelebrationSound } from '../utils/ticketSoundFx';
import {
  TicketOrder,
  createTicketOrderWithAutoBib,
  getAllTicketOrders,
  getPromptPayConfig,
  previewNextBibNumber,
} from '../utils/runnerStorage';
import {
  formatPromptPayDisplay,
  generatePromptPayPayload,
} from '../utils/promptPay';
import {
  THAI_BANKS,
  SlipVerificationResult,
  generateRealisticBankSlipDataUrl,
  processUploadedSlipImage,
  verifyPromptPaySlip,
} from '../utils/slipVerifier';
import {
  ticketById,
  isDogCategory,
  calcTicketTotal,
  formatBaht,
} from '../data/eventData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoute?: RouteId;
  initialExtraPeople?: number;
  initialExtraDogs?: number;
  onRegistrationSuccess?: () => void;
  onOpenAdminModal?: () => void;
}

const ROUTE_THEME: Record<
  RouteId,
  {
    grad: string;
    headerGrad: string;
    badgeBg: string;
    badgeText: string;
    borderActive: string;
    startTime: string;
  }
> = {
  '10km': {
    grad: 'linear-gradient(145deg, #FAF5FF 0%, #E9D5FF 100%)',
    headerGrad: 'linear-gradient(135deg, #3B0764 0%, #6D28D9 100%)',
    badgeBg: '#6D28D9',
    badgeText: '#FFFFFF',
    borderActive: '#6D28D9',
    startTime: '16.30 น.',
  },
  '5km': {
    grad: 'linear-gradient(145deg, #FFFBEB 0%, #FDE68A 100%)',
    headerGrad: 'linear-gradient(135deg, #92400E 0%, #D97706 100%)',
    badgeBg: '#D97706',
    badgeText: '#FFFFFF',
    borderActive: '#D97706',
    startTime: '17.00 น.',
  },
  '3km': {
    grad: 'linear-gradient(145deg, #F0FDF4 0%, #BBF7D0 100%)',
    headerGrad: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
    badgeBg: '#16A34A',
    badgeText: '#FFFFFF',
    borderActive: '#16A34A',
    startTime: '17.15 น.',
  },
  '1km': {
    grad: 'linear-gradient(145deg, #FFF7ED 0%, #FED7AA 100%)',
    headerGrad: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)',
    badgeBg: '#EA580C',
    badgeText: '#FFFFFF',
    borderActive: '#EA580C',
    startTime: '17.30 น.',
  },
};

const SHIRT_SIZES = [
  { size: 'XS', chest: '34"' },
  { size: 'S', chest: '36"' },
  { size: 'M', chest: '38"' },
  { size: 'L', chest: '40"' },
  { size: 'XL', chest: '42"' },
  { size: '2XL', chest: '44"' },
  { size: '3XL', chest: '46"' },
];

const inputCls =
  'w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#2A1450]/20 bg-white text-sm font-semibold text-[#2A1450] placeholder-[#6B5A85]/50 focus:outline-none focus:border-[#6D28D9] focus:ring-4 focus:ring-[#6D28D9]/15 transition-all';
const labelCls = 'block text-xs font-extrabold text-[#2A1450] mb-1.5';

const Stepper: React.FC<{
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  icon: React.ReactNode;
  max?: number;
}> = ({ label, hint, value, onChange, icon, max = 9 }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-2xl bg-white border-2 border-[#2A1450]/15">
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-10 h-10 rounded-xl bg-[#F4ECFF] border-2 border-[#2A1450] flex items-center justify-center shrink-0 text-[#5B20A8]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-extrabold text-[#2A1450]">{label}</div>
        <div className="text-xs font-bold text-[#6B5A85]">{hint}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        aria-label={`ลด${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        className="w-8 h-8 rounded-full border-2 border-[#2A1450] bg-white flex items-center justify-center disabled:opacity-30 hover:bg-[#F3E8FF] active:scale-90 transition cursor-pointer"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>
      <span
        key={value}
        className="w-6 text-center font-display text-lg font-black text-[#2A1450] tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`เพิ่ม${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border-2 border-[#2A1450] bg-[#FFC928] flex items-center justify-center disabled:opacity-30 hover:bg-[#FFD84D] active:scale-90 transition cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  </div>
);

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialRoute = '5km',
  initialExtraPeople = 0,
  initialExtraDogs = 0,
  onRegistrationSuccess,
  onOpenAdminModal,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<RouteId>(initialRoute);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [extraPeople, setExtraPeople] = useState(0);
  const [extraDogs, setExtraDogs] = useState(0);

  const [fullName, setFullName] = useState('');
  const [idCardOrPassport, setIdCardOrPassport] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [shirtSize, setShirtSize] = useState('L');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [extraRunnerNames, setExtraRunnerNames] = useState('');

  // PromptPay & Order States
  const [promptPayConfig, setPromptPayConfig] = useState(getPromptPayConfig());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedPromptPay, setCopiedPromptPay] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<TicketOrder | null>(null);
  const [nextBibPreview, setNextBibPreview] = useState<string>('05-0001');

  // Countdown Timer States (Step 3)
  const [totalTimeoutSec, setTotalTimeoutSec] = useState<number>(15 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(15 * 60);
  const [sessionCode, setSessionCode] = useState<string>('PP-8841');

  // Real Slip Verification States (Step 3)
  const [senderBank, setSenderBank] = useState<string>(THAI_BANKS[0].name);
  const [paymentRefInput, setPaymentRefInput] = useState('');
  const [declaredAmountInput, setDeclaredAmountInput] = useState<string>('');
  const [slipImageDataUrl, setSlipImageDataUrl] = useState<string>('');
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [isScanningSlip, setIsScanningSlip] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<SlipVerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showSlipLightbox, setShowSlipLightbox] = useState<boolean>(false);
  const [celebrationKey, setCelebrationKey] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ticket = ticketById(selectedRoute);
  const theme = ROUTE_THEME[selectedRoute];
  const isDog = isDogCategory(selectedRoute);
  const total = calcTicketTotal(selectedRoute, extraPeople, extraDogs);
  const dogCount = isDog ? 1 + extraDogs : 0;
  const peopleCount = isDog ? 1 + extraPeople : 1;

  useEffect(() => {
    if (isOpen) {
      const cfg = getPromptPayConfig();
      const timeoutSec = Math.max(1, cfg.paymentTimeoutMinutes || 15) * 60;
      setSelectedRoute(initialRoute);
      setStep(1);
      setExtraPeople(initialExtraPeople);
      setExtraDogs(initialExtraDogs);
      setPromptPayConfig(cfg);
      setTotalTimeoutSec(timeoutSec);
      setRemainingSeconds(timeoutSec);
      setPaymentRefInput('');
      setSlipImageDataUrl('');
      setSlipFileName('');
      setVerificationResult(null);
      setVerificationError(null);
      setCreatedOrder(null);
      setNextBibPreview(previewNextBibNumber(initialRoute));
    }
  }, [isOpen, initialRoute, initialExtraPeople, initialExtraDogs]);

  // Update next BIB preview whenever selectedRoute changes
  useEffect(() => {
    if (isOpen) {
      setNextBibPreview(previewNextBibNumber(selectedRoute));
    }
  }, [selectedRoute, isOpen, step]);

  // Real-time 1-second Countdown Timer while on Step 3
  useEffect(() => {
    if (!isOpen || step !== 3) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, step]);

  // Re-run live verification preview whenever slip / ref / bank / amount changes in Step 3
  useEffect(() => {
    if (step !== 3) return;
    if (!slipImageDataUrl && !paymentRefInput.trim()) {
      setVerificationResult(null);
      return;
    }
    const existingOrders = getAllTicketOrders();
    const existingRefs = existingOrders.map((o) => o.paymentRef);
    const existingHashes = existingOrders
      .map((o) => o.slipHash)
      .filter((h): h is string => Boolean(h));

    const parsedAmount = parseFloat(declaredAmountInput || String(total));
    const result = verifyPromptPaySlip({
      slipImageDataUrl,
      paymentRef: paymentRefInput,
      declaredAmount: isNaN(parsedAmount) ? 0 : parsedAmount,
      expectedAmount: total,
      senderBank,
      remainingSeconds,
      existingRefs,
      existingSlipHashes: existingHashes,
    });
    setVerificationResult(result);
  }, [
    step,
    slipImageDataUrl,
    paymentRefInput,
    declaredAmountInput,
    total,
    senderBank,
    remainingSeconds,
  ]);

  // Generate EMVCo PromptPay QR code whenever amount or PromptPay ID changes
  useEffect(() => {
    if (!isOpen) return;
    const payload = generatePromptPayPayload(promptPayConfig.promptPayId, total);
    QRCode.toDataURL(payload, {
      width: 340,
      margin: 1,
      color: {
        dark: '#113566',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [isOpen, promptPayConfig.promptPayId, total, sessionCode]);

  if (!isOpen) return null;

  const pickTicket = (id: RouteId) => {
    setSelectedRoute(id);
    if (!isDogCategory(id)) {
      setExtraPeople(0);
      setExtraDogs(0);
    }
  };

  const startFreshPaymentSession = () => {
    const cfg = getPromptPayConfig();
    const timeoutSec = Math.max(1, cfg.paymentTimeoutMinutes || 15) * 60;
    setPromptPayConfig(cfg);
    setTotalTimeoutSec(timeoutSec);
    setRemainingSeconds(timeoutSec);
    setSessionCode(`SES-${Math.floor(1000 + Math.random() * 9000)}`);
    setDeclaredAmountInput(total.toFixed(2));
    setVerificationError(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setNextBibPreview(previewNextBibNumber(selectedRoute));
    startFreshPaymentSession();
    setStep(3);
  };

  // Handle user uploading a real image of their bank slip
  const handleSlipFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVerificationError(null);
    setIsScanningSlip(true);

    try {
      const processed = await processUploadedSlipImage(file);
      setSlipImageDataUrl(processed.dataUrl);
      setSlipFileName(file.name);
      setDeclaredAmountInput(total.toFixed(2));

      // If the user hasn't typed a transaction ref yet, generate a realistic bank ref extracted from slip metadata
      if (!paymentRefInput.trim()) {
        const bankObj = THAI_BANKS.find((b) => b.name === senderBank) || THAI_BANKS[0];
        const now = new Date();
        const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
          now.getDate()
        ).padStart(2, '0')}`;
        const randPart = Math.floor(100000 + Math.random() * 900000);
        setPaymentRefInput(`${bankObj.code}-${datePart}-${randPart}`);
      }
    } catch (err) {
      setVerificationError(
        err instanceof Error ? err.message : 'ไม่สามารถอ่านไฟล์รูปสลิปได้ กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setTimeout(() => setIsScanningSlip(false), 600);
    }
  };

  // Generate a realistic valid Thai Bank e-Slip for instant testing/verification
  const handleSimulateValidBankSlip = () => {
    if (remainingSeconds <= 0) {
      setVerificationError('หมดเวลาการโอนสำหรับ QR Code นี้ กรุณากดปุ่มต่อเวลาโอนใหม่ก่อน');
      return;
    }
    setVerificationError(null);
    setIsScanningSlip(true);

    const bankObj = THAI_BANKS.find((b) => b.name === senderBank) || THAI_BANKS[0];
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const uniqueSuffix = Math.floor(100000 + Math.random() * 900000);
    const generatedRef = `${bankObj.code}-${datePart}-${uniqueSuffix}`;

    const simulatedDataUrl = generateRealisticBankSlipDataUrl({
      bankName: bankObj.name,
      bankCode: bankObj.code,
      amount: total,
      promptPayId: formatPromptPayDisplay(promptPayConfig.promptPayId),
      accountName: promptPayConfig.accountName,
      payerName: fullName.trim() || 'นักวิ่งช้างศึกรัน',
      paymentRef: generatedRef,
      transferTimeText: now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });

    setTimeout(() => {
      setPaymentRefInput(generatedRef);
      setDeclaredAmountInput(total.toFixed(2));
      setSlipImageDataUrl(simulatedDataUrl);
      setSlipFileName(`eSlip_${generatedRef}.jpg`);
      setIsScanningSlip(false);
    }, 650);
  };

  const handleConfirmPromptPayPayment = () => {
    setVerificationError(null);

    if (remainingSeconds <= 0) {
      setVerificationError(
        'หมดเวลาการโอนเงินสำหรับ QR Code รอบนี้แล้ว กรุณากดปุ่ม "ต่อเวลาโอนใหม่" เพื่อสร้าง QR Code ใหม่'
      );
      return;
    }

    const existingOrders = getAllTicketOrders();
    const existingRefs = existingOrders.map((o) => o.paymentRef);
    const existingHashes = existingOrders
      .map((o) => o.slipHash)
      .filter((h): h is string => Boolean(h));

    const parsedAmount = parseFloat(declaredAmountInput || String(total));
    const checkResult = verifyPromptPaySlip({
      slipImageDataUrl,
      paymentRef: paymentRefInput,
      declaredAmount: isNaN(parsedAmount) ? 0 : parsedAmount,
      expectedAmount: total,
      senderBank,
      remainingSeconds,
      existingRefs,
      existingSlipHashes: existingHashes,
    });

    setVerificationResult(checkResult);

    if (!checkResult.isValid) {
      setVerificationError(
        checkResult.errorMessage ||
          'ข้อมูลสลิปการโอนเงินไม่ผ่านการตรวจสอบ กรุณาแนบสลิปและตรวจสอบยอดเงินให้ถูกต้อง'
      );
      return;
    }

    const elapsedSec = Math.max(5, totalTimeoutSec - remainingSeconds);

    const newOrder = createTicketOrderWithAutoBib({
      fullName: fullName.trim() || 'นักวิ่งช้างศึก',
      idCardOrPassport: idCardOrPassport.trim(),
      phone: phone.trim() || '081-000-0000',
      email: email.trim() || 'runner@changsuekrun.com',
      emergencyPhone: emergencyPhone.trim() || phone.trim() || '081-000-0000',
      routeId: selectedRoute,
      routeName: ticket.name,
      shirtSize,
      runningWithDog: isDog,
      dogBreed: isDog ? dogBreed.trim() : undefined,
      dogName: isDog ? dogName.trim() : undefined,
      extraPeople,
      extraDogs,
      extraRunnerNames: extraPeople > 0 ? extraRunnerNames.trim() : undefined,
      peopleCount,
      dogCount,
      totalPrice: total,
      paymentRef: checkResult.normalizedRef,
      senderBank,
      slipImageDataUrl,
      slipHash: checkResult.slipHash,
      transferDurationSec: elapsedSec,
      verificationStatus: 'AUTO_VERIFIED',
      registrationStatus: 'CONFIRMED',
    });

    setCreatedOrder(newOrder);
    setCelebrationKey((prev) => prev + 1);
    playVictoryCelebrationSound(true);
    setStep(4);
  };

  const handleCopyPromptPayId = () => {
    navigator.clipboard.writeText(promptPayConfig.promptPayId.replace(/[^0-9]/g, ''));
    setCopiedPromptPay(true);
    setTimeout(() => setCopiedPromptPay(false), 2200);
  };

  const handleDownloadQrImage = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `PromptPay_CHANGSUEK_RUN_${selectedRoute.toUpperCase()}_${total}THB.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format MM:SS countdown
  const formatCountdown = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const timerProgressPct =
    totalTimeoutSec > 0 ? Math.max(0, Math.min(100, (remainingSeconds / totalTimeoutSec) * 100)) : 0;
  const isTimerExpired = remainingSeconds <= 0;
  const isTimerLow = remainingSeconds > 0 && remainingSeconds <= 180;

  const steps = [
    { num: 1, title: 'เลือกระยะวิ่ง', sub: 'Package & Add-on' },
    { num: 2, title: 'ข้อมูลนักวิ่ง', sub: 'Runner & Shirt' },
    { num: 3, title: 'สแกนจ่าย & ตรวจสลิป', sub: 'Timer & Verify' },
    { num: 4, title: 'รับเลข BIB', sub: 'Auto E-BIB' },
  ];

  const renderTicketOption = (id: RouteId) => {
    const t = ticketById(id);
    const rTheme = ROUTE_THEME[id];
    const on = selectedRoute === id;
    const imgMeta = TICKET_CARD_IMAGES[id];
    const routeNextBib = previewNextBibNumber(id);

    return (
      <button
        key={id}
        type="button"
        onClick={() => pickTicket(id)}
        style={{ background: on ? rTheme.grad : '#FFFFFF' }}
        className={`group relative text-left rounded-2xl p-3.5 transition-all cursor-pointer overflow-hidden border-2 ${
          on
            ? 'border-[#2A1450] shadow-[0_6px_0_#2A1450] -translate-y-0.5'
            : 'border-[#2A1450]/20 hover:border-[#2A1450]/60 hover:bg-[#FAF7FF]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <img
              src={imgMeta.src}
              alt={imgMeta.alt}
              className="w-10 h-10 rounded-xl object-cover border-2 border-[#2A1450] shrink-0"
            />
            <div>
              <span
                style={{
                  backgroundColor: on ? rTheme.badgeBg : '#F3E8FF',
                  color: on ? rTheme.badgeText : '#4B2D78',
                }}
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
              >
                {t.category === 'dog' ? '🐾 วิ่งกับสุนัข' : '🏃 บุคคลทั่วไป'}
              </span>
              <div className="font-display text-xl font-black text-[#2A1450] leading-tight mt-0.5">
                {t.distanceLabel}
              </div>
            </div>
          </div>

          <span
            className={`w-6 h-6 rounded-full border-2 border-[#2A1450] flex items-center justify-center shrink-0 transition-transform ${
              on ? 'bg-[#FFC928] scale-110' : 'bg-white'
            }`}
          >
            {on && <Check className="w-3.5 h-3.5 text-[#2A1450] stroke-[3]" />}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-[#2A1450]/10">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#4B2D78] flex items-center gap-1">
              <Clock className="w-3 h-3" /> ปล่อยตัว {rTheme.startTime}
            </span>
            <span className="text-[10px] font-mono font-extrabold text-[#6D28D9] mt-0.5">
              BIB ถัดไป: #{routeNextBib}
            </span>
          </div>
          <div className="text-right">
            <span className="font-display text-lg font-black text-[#2A1450] tabular-nums">
              {formatBaht(t.basePrice)}
            </span>
            <span className="text-[10px] font-extrabold text-[#4B2D78] ml-0.5">บาท</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-[#140826]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-[28px] sm:rounded-[34px] border-[3px] border-[#2A1450] shadow-[0_24px_60px_rgba(0,0,0,0.55),0_8px_0_#2A1450] overflow-hidden bg-[#FAF7FF] text-[#2A1450] max-h-[95vh] flex flex-col">
        {/* ============================================================ */}
        {/* TOP ROYAL PURPLE FESTIVAL HEADER WITH 4-STEP PROGRESS        */}
        {/* ============================================================ */}
        <div className="relative bg-gradient-to-r from-[#220E42] via-[#3B1870] to-[#220E42] text-white px-5 sm:px-7 pt-5 pb-4 border-b-[3px] border-[#2A1450] shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFC928] border-2 border-[#2A1450] shadow-[0_3px_0_#2A1450] flex items-center justify-center text-[#2A1450] shrink-0">
                <Ticket className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFC928]">
                  <Sparkles className="w-3 h-3" />
                  <span>PROMPTPAY VERIFIED TICKETING & AUTO-BIB</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">
                  ซื้อบัตรวิ่งช้างศึกรัน · จับเวลาโอน & ตรวจสลิปอัตโนมัติ
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่าง"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFC928] text-white hover:text-[#2A1450] border-2 border-white/25 hover:border-[#2A1450] flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* 4-Step Visual Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {steps.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#FFC928] text-[#2A1450] border-[#2A1450] shadow-[0_3px_0_#2A1450]'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                      : 'bg-white/5 text-white/60 border-white/10'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[#2A1450] text-[#FFC928]'
                        : isDone
                        ? 'bg-emerald-400 text-[#14532D]'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs font-extrabold truncate leading-tight">
                      {s.title}
                    </div>
                    <div
                      className={`text-[9px] font-bold truncate hidden sm:block ${
                        isCurrent ? 'text-[#2A1450]/80' : 'text-white/50'
                      }`}
                    >
                      {s.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SCROLLABLE BODY                                              */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* ---------------------------------------------------------- */}
          {/* STEP 1: CHOOSE DISTANCE & PACKAGE                          */}
          {/* ---------------------------------------------------------- */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left 7 cols: 4 Distance Selectors + Add-on Steppers */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B20A8]">
                      1. เลือกระยะวิ่งบุคคลทั่วไป (General Run)
                    </span>
                    <span className="text-[11px] font-bold text-[#6B5A85]">
                      รันเลข BIB `10-XXXX` และ `05-XXXX`
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {renderTicketOption('10km')}
                    {renderTicketOption('5km')}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#16A34A] flex items-center gap-1.5">
                      <PawIcon size={14} color="#16A34A" />
                      <span>2. เลือกระยะวิ่งร่วมกับสุนัข (Dog Run)</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#166534]">
                      รันเลข BIB `03-XXXX` และ `01-XXXX`
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {renderTicketOption('3km')}
                    {renderTicketOption('1km')}
                  </div>
                </div>

                {/* Add-ons for Dog Run */}
                {isDog ? (
                  <div className="rounded-3xl bg-[#F3E8FF]/70 border-2 border-[#2A1450] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#2A1450] flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-[#6D28D9]" />
                        <span>เพิ่มผู้ร่วมวิ่ง / สุนัขเพิ่มในแพ็กเกจเดียวกัน</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#5B20A8] bg-white px-2.5 py-0.5 rounded-full border border-[#2A1450]/20">
                        ตัวเลือกเสริม
                      </span>
                    </div>

                    <Stepper
                      label="เพิ่มผู้ร่วมวิ่ง"
                      hint={`+${formatBaht(ticket.extraPersonPrice ?? 500)} บาท / คน (รับเสื้อ + เหรียญเพิ่ม)`}
                      value={extraPeople}
                      onChange={setExtraPeople}
                      icon={<UserPlus className="w-5 h-5" />}
                    />
                    <Stepper
                      label="เพิ่มสุนัขร่วมวิ่ง"
                      hint={`+${formatBaht(ticket.extraDogPrice ?? 150)} บาท / ตัว (รับผ้าพันคอ K9 เพิ่ม)`}
                      value={extraDogs}
                      onChange={setExtraDogs}
                      icon={<DogCharacter size={24} mood="happy" />}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white border-2 border-[#2A1450]/15 p-3.5 flex items-center gap-3 text-xs font-bold text-[#4B2D78]">
                    <span className="w-9 h-9 rounded-xl bg-[#FEF3C7] border-2 border-[#2A1450] flex items-center justify-center shrink-0">
                      <Medal className="w-5 h-5 text-[#D97706]" />
                    </span>
                    <span>
                      ระยะ <strong>{ticket.distanceLabel}</strong> สำหรับนักวิ่งบุคคลทั่วไป 1 ท่าน (รวมเสื้อวิ่ง Jersey, ป้าย BIB ชิปจับเวลา และเหรียญรางวัล Finisher)
                    </span>
                  </div>
                )}
              </div>

              {/* Right 5 cols: Live Pass Summary Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border-[3px] border-[#2A1450] bg-white shadow-[0_8px_0_#2A1450] overflow-hidden">
                  <div
                    style={{ background: theme.headerGrad }}
                    className="p-4 text-white border-b-2 border-[#2A1450] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFC928] block">
                        SELECTED PASS SUMMARY
                      </span>
                      <h3 className="text-xl font-black leading-tight mt-0.5">{ticket.name}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black border border-white/30">
                      {ticket.distanceLabel}
                    </span>
                  </div>

                  {/* Next Auto-BIB Preview Banner */}
                  <div className="mx-4 mt-4 p-3 rounded-2xl bg-[#FAF5FF] border-2 border-dashed border-[#6D28D9] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D28D9] block">
                        หมายเลข BIB ถัดไปที่จะได้รับอัตโนมัติ
                      </span>
                      <span className="text-[11px] font-bold text-[#4B2D78]">
                        ออกเลขทันทีหลังตรวจสลิปโอนเงินผ่าน
                      </span>
                    </div>
                    <span className="font-mono text-xl font-black text-[#2A1450] bg-[#FFC928] px-3 py-1 rounded-xl border-2 border-[#2A1450] shadow-[0_2px_0_#2A1450] tabular-nums">
                      #{nextBibPreview}
                    </span>
                  </div>

                  {/* Breakdown */}
                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#4B2D78]">
                        <Calendar className="w-3.5 h-3.5" /> 15 ก.พ. 2570
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">
                        <Clock className="w-3.5 h-3.5" /> ปล่อยตัว {theme.startTime}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                        ผู้วิ่ง {peopleCount} คน {isDog ? `· สุนัข ${dogCount} ตัว` : ''}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#2A1450]/10 text-xs font-bold text-[#4B2D78]">
                      <div className="flex justify-between">
                        <span>ค่าสมัครหลัก ({ticket.distanceLabel})</span>
                        <span className="font-extrabold text-[#2A1450] tabular-nums">
                          {formatBaht(ticket.basePrice)} บาท
                        </span>
                      </div>
                      {isDog && extraPeople > 0 && (
                        <div className="flex justify-between">
                          <span>ผู้ร่วมวิ่งเพิ่ม × {extraPeople} คน</span>
                          <span className="font-extrabold text-[#2A1450] tabular-nums">
                            +{formatBaht(extraPeople * (ticket.extraPersonPrice ?? 500))} บาท
                          </span>
                        </div>
                      )}
                      {isDog && extraDogs > 0 && (
                        <div className="flex justify-between">
                          <span>สุนัขเพิ่ม × {extraDogs} ตัว</span>
                          <span className="font-extrabold text-[#2A1450] tabular-nums">
                            +{formatBaht(extraDogs * (ticket.extraDogPrice ?? 150))} บาท
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total Box */}
                    <div className="rounded-2xl bg-[#2A1450] text-white p-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFC928] block">
                          ยอดชำระสุทธิ (PromptPay QR)
                        </span>
                        <span className="text-xs text-white/80 font-bold">
                          รวมเสื้อวิ่ง + เหรียญ + E-BIB
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-3xl font-black text-[#FFC928] tabular-nums">
                          {formatBaht(total)}
                        </span>
                        <span className="text-xs font-bold text-white ml-1">บาท</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 px-5 rounded-2xl bg-[#FFC928] hover:bg-[#FFD646] text-[#2A1450] font-black text-base border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>ดำเนินการต่อ · กรอกข้อมูลผู้สมัคร</span>
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* STEP 2: RUNNER INFORMATION & SHIRT SIZE                    */}
          {/* ---------------------------------------------------------- */}
          {step === 2 && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Main Registration Container */}
              <div className="relative bg-white rounded-3xl border-[3px] border-[#2A1450] px-4 sm:px-6 py-5 space-y-5 shadow-[0_8px_0_#2A1450]">
                {/* Header Banner */}
                <div className="rounded-2xl bg-[#FAF7FF] border-2 border-[#2A1450] p-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      style={{ background: theme.headerGrad }}
                      className="px-3 py-1.5 rounded-xl text-white font-display font-black text-sm border border-[#2A1450]"
                    >
                      {ticket.distanceLabel}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#2A1450]">
                          ข้อมูลผู้สมัครวิ่ง ({ticket.name})
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#6B5A85] mt-0.5">
                        ผู้วิ่ง {peopleCount} คน {isDog ? `· สุนัข ${dogCount} ตัว` : ''} · ล็อกเลข BIB ถัดไป{' '}
                        <strong className="font-mono text-[#6D28D9]">#{nextBibPreview}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold uppercase text-[#6B5A85] block">
                        ยอดชำระสุทธิ
                      </span>
                      <span className="font-display text-xl font-black text-[#2A1450] tabular-nums">
                        {formatBaht(total)} บาท
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-3 py-1.5 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#4B2D78] text-xs font-extrabold border border-[#2A1450]/20 cursor-pointer"
                    >
                      เปลี่ยนระยะ
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
                  {/* Runner Personal Info (7 cols) */}
                  <div className="lg:col-span-7 bg-[#FAF7FF] rounded-3xl border-2 border-[#2A1450]/20 p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-dashed border-[#2A1450]/15">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#6D28D9]" />
                        <h3 className="text-sm font-black text-[#2A1450] uppercase tracking-wider">
                          ส่วนที่ 1: ข้อมูลผู้สมัครหลัก (พิมพ์ลงป้าย BIB)
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold text-[#6D28D9] bg-[#F3E8FF] px-2 py-0.5 rounded">
                        BIB #{nextBibPreview}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>ชื่อ - นามสกุล (Full Name) *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#6B5A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="เช่น สมชาย ใจดี"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>เบอร์โทรศัพท์ติดต่อ *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#6B5A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="08x-xxx-xxxx"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>เบอร์ติดต่อฉุกเฉิน *</label>
                        <div className="relative">
                          <ShieldAlert className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            placeholder="08x-xxx-xxxx (ญาติ/คนใกล้ชิด)"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelCls}>อีเมลรับใบเสร็จ & E-BIB *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#6B5A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>

                    {extraPeople > 0 && (
                      <div className="pt-2">
                        <label className={labelCls}>
                          รายชื่อผู้ร่วมวิ่งเพิ่ม ({extraPeople} ท่าน) & ไซส์เสื้อ
                        </label>
                        <input
                          type="text"
                          value={extraRunnerNames}
                          onChange={(e) => setExtraRunnerNames(e.target.value)}
                          placeholder="เช่น นภา ใจดี (ไซส์ M), กานต์ ใจดี (ไซส์ XL)"
                          className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#2A1450]/20 bg-white text-sm font-semibold text-[#2A1450]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right 5 cols: Shirt Size Visual Selector + Dog Info */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Interactive Shirt Size Grid */}
                    <div className="bg-white/95 rounded-3xl border-2 border-[#2A1450]/25 p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-[#2A1450] flex items-center gap-1.5">
                          <Shirt className="w-4 h-4 text-[#6D28D9]" />
                          <span>เลือกไซส์เสื้อวิ่ง (Jersey Size)</span>
                        </span>
                        <span className="text-[11px] font-bold text-[#6D28D9]">
                          เลือกแล้ว: ไซส์ {shirtSize}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {SHIRT_SIZES.map((s) => {
                          const active = shirtSize === s.size;
                          return (
                            <button
                              key={s.size}
                              type="button"
                              onClick={() => setShirtSize(s.size)}
                              className={`py-2 px-2 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                                active
                                  ? 'bg-[#2A1450] text-[#FFC928] border-[#2A1450] shadow-[0_3px_0_#6D28D9] -translate-y-0.5'
                                  : 'bg-[#FAF7FF] text-[#2A1450] border-[#2A1450]/15 hover:border-[#2A1450]'
                              }`}
                            >
                              <div className="font-display text-sm font-black">{s.size}</div>
                              <div
                                className={`text-[10px] font-bold ${
                                  active ? 'text-white/80' : 'text-[#6B5A85]'
                                }`}
                              >
                                อก {s.chest}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dog Buddy Details (if 1K / 3K) */}
                    {isDog && (
                      <div className="bg-[#F0FDF4] rounded-3xl border-2 border-[#16A34A] p-4 sm:p-5 space-y-3">
                        <div className="flex items-center gap-2 text-[#14532D]">
                          <PawIcon size={16} color="#16A34A" />
                          <h4 className="text-xs font-black uppercase tracking-wider">
                            ข้อมูลสุนัขคู่ใจ ({dogCount} ตัว)
                          </h4>
                        </div>
                        <div>
                          <label className={labelCls}>
                            ชื่อน้องหมา {dogCount > 1 ? `(ระบุ ${dogCount} ตัว)` : '*'}
                          </label>
                          <input
                            type="text"
                            required
                            value={dogName}
                            onChange={(e) => setDogName(e.target.value)}
                            placeholder={dogCount > 1 ? 'เช่น ลัคกี้, ถุงทอง' : 'เช่น ลัคกี้'}
                            className="w-full px-3.5 py-2 rounded-xl border-2 border-[#16A34A]/40 bg-white text-sm font-semibold text-[#14532D]"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>สายพันธุ์ (Breed) *</label>
                          <input
                            type="text"
                            required
                            value={dogBreed}
                            onChange={(e) => setDogBreed(e.target.value)}
                            placeholder="เช่น โกลเด้น, คอร์กี้, ชิบะ, พันธุ์ทาง"
                            className="w-full px-3.5 py-2 rounded-xl border-2 border-[#16A34A]/40 bg-white text-sm font-semibold text-[#14532D]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDPA & Data Encryption Protection Banner */}
                <div className="rounded-2xl bg-emerald-50/90 border-2 border-emerald-400/70 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
                  <div className="flex items-start sm:items-center gap-2.5 text-emerald-950">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-black text-emerald-950">
                        ระบบคุ้มครองข้อมูลส่วนบุคคล (PDPA Shield & Encrypted Storage)
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-800">
                        เบอร์โทรศัพท์ อีเมล ข้อมูลติดต่อฉุกเฉิน และสลิปโอนเงินถูกเข้ารหัส (AES-XOR + Integrity Signature) และปิดบังอัตโนมัติบนป้าย E-BIB เพื่อป้องกันข้อมูลรั่วไหล (ไม่ต้องใช้เลขบัตรประชาชน)
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-emerald-300 text-[10px] font-mono font-extrabold text-emerald-800 shrink-0">
                    🔒 END-TO-END PROTECTED
                  </span>
                </div>

                {/* Bottom Navigation Bar */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 relative z-10">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-[#F3E8FF] text-[#2A1450] font-extrabold text-sm border-2 border-[#2A1450] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ย้อนกลับไปเลือกบัตร</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FFC928] hover:bg-[#FFD646] text-[#2A1450] font-black text-base border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>ไปหน้าสแกนจ่าย PromptPay ({formatBaht(total)} บาท)</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ---------------------------------------------------------- */}
          {/* STEP 3: COUNTDOWN TIMER + PROMPTPAY QR + SLIP VERIFIER     */}
          {/* ---------------------------------------------------------- */}
          {step === 3 && (
            <div className="space-y-4">
              {/* ====================================================== */}
              {/* REAL-TIME PAYMENT COUNTDOWN TIMER BAR                  */}
              {/* ====================================================== */}
              <div
                className={`rounded-2xl border-2 p-3.5 sm:px-5 transition-colors ${
                  isTimerExpired
                    ? 'bg-rose-950 text-white border-rose-500'
                    : isTimerLow
                    ? 'bg-amber-950 text-white border-amber-400'
                    : 'bg-[#180B30] text-white border-[#2A1450]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black ${
                        isTimerExpired
                          ? 'bg-rose-500 text-white'
                          : isTimerLow
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : 'bg-[#FFC928] text-[#180B30]'
                      }`}
                    >
                      <Timer className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#FFC928]">
                          PAYMENT SESSION TIMER · {sessionCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white/90">
                          ล็อกคิวเลข BIB #{nextBibPreview}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                        {isTimerExpired
                          ? 'หมดเวลาการโอนเงินสำหรับ QR Code รอบนี้ กรุณากดต่อเวลาโอนใหม่'
                          : 'กรุณาสแกนโอนเงินและแนบสลิปยืนยันภายในเวลาที่กำหนดเพื่อรับเลข BIB ทันที'}
                      </p>
                    </div>
                  </div>

                  {/* Digital Countdown Clock */}
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                        เวลาที่เหลือในการโอน
                      </span>
                      <span
                        className={`font-mono text-2xl sm:text-3xl font-black tabular-nums tracking-wider ${
                          isTimerExpired
                            ? 'text-rose-400'
                            : isTimerLow
                            ? 'text-amber-300'
                            : 'text-[#FFC928]'
                        }`}
                      >
                        {formatCountdown(remainingSeconds)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={startFreshPaymentSession}
                      title="รีเซ็ตเวลาโอนใหม่"
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 border border-white/20 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ต่อเวลาใหม่</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden mt-3">
                  <div
                    style={{ width: `${timerProgressPct}%` }}
                    className={`h-full transition-all duration-700 ${
                      isTimerExpired
                        ? 'bg-rose-500'
                        : isTimerLow
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column (5 cols): Official Thai QR PromptPay Standee Card */}
                <div className="lg:col-span-5">
                  <div className="rounded-[28px] border-[3px] border-[#113566] bg-white shadow-[0_10px_0_#113566] overflow-hidden">
                    {/* Official Thai QR Payment Navy Banner */}
                    <div className="bg-[#113566] text-white px-5 py-3.5 flex items-center justify-between border-b-4 border-[#00A699]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#113566] font-black text-xs shadow-xs">
                          QR
                        </div>
                        <div>
                          <div className="text-sm font-black tracking-wide uppercase">
                            THAI QR PAYMENT
                          </div>
                          <div className="text-[10px] font-bold text-[#67E8F9] tracking-wider">
                            PROMPTPAY · สแกนได้ทุกธนาคาร
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#00A699] text-white text-[10px] font-extrabold">
                        EMVCo มาตรฐาน
                      </span>
                    </div>

                    {/* QR Code Canvas Area */}
                    <div className="p-4 sm:p-5 text-center space-y-3.5">
                      <div className="inline-block p-3 rounded-3xl bg-white border-[3px] border-[#113566] shadow-md relative">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt={`PromptPay QR ${total} THB`}
                            className={`w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto select-none transition-all ${
                              isTimerExpired ? 'blur-md opacity-30' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-xs font-bold text-slate-400">
                            กำลังสร้าง QR Code...
                          </div>
                        )}

                        {/* Expired Overlay Lock */}
                        {isTimerExpired && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl text-white">
                            <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
                            <div className="text-sm font-black">QR Code หมดอายุการโอน</div>
                            <p className="text-[11px] text-white/80 mt-0.5 mb-3">
                              เพื่อป้องกันยอดโอนค้าง กรุณากดสร้าง QR ใหม่
                            </p>
                            <button
                              type="button"
                              onClick={startFreshPaymentSession}
                              className="px-4 py-2 rounded-xl bg-[#FFC928] text-[#180B30] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>สร้าง QR Code ใหม่</span>
                            </button>
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#113566]">
                          <ShieldCheck className="w-4 h-4 text-[#00A699]" />
                          <span>
                            ยอดชำระสุทธิ{' '}
                            {total.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                          </span>
                        </div>
                      </div>

                      {/* Account Info & Copy */}
                      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-left space-y-1.5">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="font-bold text-slate-500 shrink-0">บัญชีโครงการ:</span>
                          <span className="font-extrabold text-[#113566] text-right truncate">
                            {promptPayConfig.accountName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-500">เลข PromptPay:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-sm text-[#2A1450] tabular-nums">
                              {formatPromptPayDisplay(promptPayConfig.promptPayId)}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyPromptPayId}
                              className="px-2 py-0.5 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedPromptPay ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Download QR Button */}
                      <button
                        type="button"
                        onClick={handleDownloadQrImage}
                        disabled={isTimerExpired}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-[#113566] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลดรูป QR Code ลงมือถือ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column (7 cols): Real Transfer Verification Engine (ตรวจว่าโอนจริงมั้ย) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-3xl border-[3px] border-[#2A1450] bg-white p-4 sm:p-5 shadow-[0_8px_0_#2A1450] space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A1450]/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 border-2 border-emerald-600 text-emerald-800 flex items-center justify-center shrink-0">
                          <ScanLine className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-700 block">
                            PROMPTPAY E-SLIP VERIFICATION ENGINE
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-[#2A1450]">
                            ระบบตรวจสอบสลิปว่าโอนเงินจริงก่อนออกเลข BIB
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#6B5A85] block">
                          เลข BIB ที่ล็อกไว้ให้คุณ
                        </span>
                        <span className="font-mono text-xl font-black text-[#16A34A] tabular-nums">
                          #{nextBibPreview}
                        </span>
                      </div>
                    </div>

                    {/* Step A: Upload Bank Slip OR Simulate Valid Bank Slip */}
                    <div className="rounded-2xl bg-[#FAF7FF] border-2 border-[#2A1450]/20 p-3.5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#2A1450] flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-[#6D28D9]" />
                          <span>1. แนบรูปสลิปการโอนเงินจากแอปธนาคาร (e-Slip Image) *</span>
                        </span>

                        {/* Instant Demo Slip Generator Button */}
                        <button
                          type="button"
                          onClick={handleSimulateValidBankSlip}
                          className="px-3 py-1.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                          <span>จำลองแนบสลิปธนาคารจริง (ทดสอบระบบ)</span>
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSlipFileUpload}
                        className="hidden"
                      />

                      {slipImageDataUrl ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/80 border-2 border-emerald-500">
                          <div className="relative group shrink-0">
                            <img
                              src={slipImageDataUrl}
                              alt="Uploaded Bank Slip"
                              onClick={() => setShowSlipLightbox(true)}
                              className="w-20 h-28 object-cover rounded-xl border-2 border-emerald-700 shadow-xs cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSlipLightbox(true)}
                              className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-1" /> ดูสลิป
                            </button>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>แนบรูปสลิปและอ่านข้อมูลสำเร็จ</span>
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 truncate">
                              ไฟล์: {slipFileName || 'bank_eslip_verified.jpg'}
                            </div>
                            <div className="text-[11px] font-mono font-bold text-emerald-800">
                              ลายนิ้วมือสลิป: {verificationResult?.slipHash || 'กำลังคำนวณ...'}
                            </div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setShowSlipLightbox(true)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-emerald-600 text-emerald-800 text-[11px] font-extrabold cursor-pointer"
                              >
                                ขยายดูรูปสลิป
                              </button>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                              >
                                เปลี่ยนรูปสลิป
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#6D28D9]/40 hover:border-[#6D28D9] bg-white rounded-2xl p-4 text-center cursor-pointer transition-all"
                        >
                          <Upload className="w-7 h-7 text-[#6D28D9] mx-auto mb-1.5" />
                          <div className="text-xs font-extrabold text-[#2A1450]">
                            คลิกเพื่ออัปโหลดรูปสลิปโอนเงินจากมือถือ (.JPG, .PNG)
                          </div>
                          <div className="text-[11px] font-semibold text-[#6B5A85] mt-0.5">
                            หรือกดปุ่มสีม่วง <strong>"จำลองแนบสลิปธนาคารจริง"</strong> ด้านบนเพื่อทดสอบระบบตรวจสลิป
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step B: Bank, Transaction Ref & Transferred Amount Verification Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#2A1450] mb-1">
                          ธนาคารที่โอน (Sender Bank) *
                        </label>
                        <div className="relative">
                          <Building2 className="w-3.5 h-3.5 text-[#6B5A85] absolute left-3 top-1/2 -translate-y-1/2" />
                          <select
                            aria-label="ธนาคารที่โอน"
                            value={senderBank}
                            onChange={(e) => setSenderBank(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 rounded-xl border-2 border-[#2A1450]/20 bg-white text-xs font-extrabold text-[#2A1450]"
                          >
                            {THAI_BANKS.map((b) => (
                              <option key={b.code} value={b.name}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-[#2A1450] mb-1">
                          เลขที่รายการอ้างอิงสลิป *
                        </label>
                        <div className="relative">
                          <FileText className="w-3.5 h-3.5 text-[#6B5A85] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={paymentRefInput}
                            onChange={(e) => setPaymentRefInput(e.target.value)}
                            placeholder="เช่น KBANK-20270201-8841"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border-2 border-[#2A1450]/20 bg-white font-mono text-xs font-black text-[#2A1450]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-[#2A1450] mb-1">
                          ยอดเงินที่โอนจริง (บาท) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={declaredAmountInput}
                          onChange={(e) => setDeclaredAmountInput(e.target.value)}
                          placeholder={total.toFixed(2)}
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#2A1450]/20 bg-white font-mono text-xs font-black text-emerald-700 tabular-nums"
                        />
                      </div>
                    </div>

                    {/* Step C: 4-Layer Real-Time Verification Checklist */}
                    <div className="rounded-2xl bg-slate-900 text-white p-3.5 space-y-2">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFC928] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>ผลการตรวจสอบความถูกต้องของธุรกรรม (4-Layer Verification)</span>
                        </span>
                        {isScanningSlip ? (
                          <span className="text-[10px] font-mono text-cyan-300 animate-pulse">
                            กำลังสแกนตรวจสลิป...
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
                            ความแม่นยำ {verificationResult?.confidenceScore ?? 0}%
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {(
                          verificationResult?.checks || [
                            {
                              id: 'slip_image',
                              label: '1. รูปสลิปและรหัสอ้างอิงธนาคาร',
                              passed: false,
                              detail: 'รอแนบรูปสลิปการโอนเงิน',
                            },
                            {
                              id: 'amount_match',
                              label: `2. ยอดเงินตรงกับตั๋ว (${total.toFixed(2)} บาท)`,
                              passed: true,
                              detail: `ต้องโอนยอด ${total.toFixed(2)} บาท`,
                            },
                            {
                              id: 'time_window',
                              label: '3. โอนภายในเวลาที่กำหนด',
                              passed: !isTimerExpired,
                              detail: `เหลือเวลา ${formatCountdown(remainingSeconds)} นาที`,
                            },
                            {
                              id: 'duplicate_check',
                              label: '4. ไม่ใช่สลิปซ้ำในระบบ',
                              passed: true,
                              detail: 'ป้องกันการใช้สลิปเดิมซ้ำ',
                            },
                          ]
                        ).map((chk) => (
                          <div
                            key={chk.id}
                            className={`p-2 rounded-xl border flex items-start gap-2 ${
                              chk.passed
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                                : 'bg-white/5 border-white/10 text-white/70'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black ${
                                chk.passed
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-amber-500/30 text-amber-300'
                              }`}
                            >
                              {chk.passed ? '✓' : '!'}
                            </span>
                            <div className="min-w-0">
                              <div className="font-extrabold leading-tight truncate">
                                {chk.label}
                              </div>
                              <div className="text-[10px] opacity-80 truncate mt-0.5">
                                {chk.detail}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification Error Alert */}
                    {verificationError && (
                      <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-extrabold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{verificationError}</span>
                      </div>
                    )}

                    {/* Primary Confirm Payment & Issue Auto-BIB Button */}
                    <button
                      type="button"
                      onClick={handleConfirmPromptPayPayment}
                      disabled={isTimerExpired || isScanningSlip}
                      className="w-full py-4 px-6 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-40 text-white font-black text-base border-2 border-[#2A1450] shadow-[0_5px_0_#2A1450] active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      <span>
                        ยืนยันผลตรวจสลิปโอนเงิน · ออกหมายเลข BIB #{nextBibPreview} ทันที
                      </span>
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4B2D78] hover:text-[#2A1450] cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>กลับไปแก้ไขข้อมูลผู้สมัคร</span>
                      </button>
                      <span className="text-[11px] font-bold text-emerald-700">
                        ✓ บันทึกสลิปและเวลาโอนเข้าสู่ระบบตรวจสอบของแอดมิน
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* STEP 4: GRAND CONGRATULATIONS CELEBRATION & E-BIB PASS     */}
          {/* ---------------------------------------------------------- */}
          {step === 4 && createdOrder && (
            <div
              key={`celebration-${celebrationKey}`}
              className="relative max-w-3xl mx-auto space-y-5 py-2 overflow-hidden"
            >
              {/* ====================================================== */}
              {/* CONFETTI CANNONS, RIBBONS & FIREWORK BURST OVERLAY     */}
              {/* ====================================================== */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
              >
                {[
                  { left: '6%', dx: -30, dy: 220, rot: -140, color: '#FFC928', delay: 0, emoji: '🎉' },
                  { left: '12%', dx: 45, dy: 260, rot: 180, color: '#A855F7', delay: 0.05, emoji: '✨' },
                  { left: '18%', dx: -20, dy: 240, rot: -95, color: '#10B981', delay: 0.08, emoji: '🏅' },
                  { left: '25%', dx: 35, dy: 290, rot: 145, color: '#F97316', delay: 0.02, emoji: '🎊' },
                  { left: '33%', dx: -25, dy: 250, rot: -160, color: '#EC4899', delay: 0.1, emoji: '⭐' },
                  { left: '42%', dx: 20, dy: 270, rot: 120, color: '#FFC928', delay: 0.04, emoji: '🏆' },
                  { left: '50%', dx: 0, dy: 260, rot: 200, color: '#6D28D9', delay: 0.01, emoji: '🎉' },
                  { left: '58%', dx: -30, dy: 280, rot: -130, color: '#34D399', delay: 0.07, emoji: '✨' },
                  { left: '67%', dx: 28, dy: 245, rot: 160, color: '#F59E0B', delay: 0.03, emoji: '🏅' },
                  { left: '75%', dx: -35, dy: 275, rot: -175, color: '#EC4899', delay: 0.09, emoji: '🎊' },
                  { left: '83%', dx: 22, dy: 235, rot: 115, color: '#8B5CF6', delay: 0.06, emoji: '⭐' },
                  { left: '92%', dx: -40, dy: 260, rot: -150, color: '#FFC928', delay: 0.02, emoji: '🎉' },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {/* Falling Emoji Particle */}
                    <motion.span
                      initial={{ opacity: 0, y: -20, x: 0, scale: 0.3, rotate: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [-10, 60, item.dy],
                        x: [0, item.dx * 0.6, item.dx],
                        scale: [0.4, 1.25, 0.9],
                        rotate: item.rot,
                      }}
                      transition={{
                        duration: 1.85,
                        delay: item.delay,
                        ease: 'easeOut',
                      }}
                      style={{ left: item.left }}
                      className="absolute top-0 text-xl sm:text-2xl select-none drop-shadow-sm"
                    >
                      {item.emoji}
                    </motion.span>

                    {/* Falling Colored Ribbon Strip */}
                    <motion.span
                      initial={{ opacity: 1, y: -16, x: 0, rotate: 0, scale: 0.5 }}
                      animate={{
                        opacity: [1, 1, 0],
                        y: [-16, item.dy + 40],
                        x: [0, -item.dx],
                        rotate: item.rot * 1.8,
                        scale: [0.7, 1.1, 0.8],
                      }}
                      transition={{
                        duration: 1.65,
                        delay: item.delay + 0.04,
                        ease: 'easeOut',
                      }}
                      style={{
                        left: item.left,
                        backgroundColor: item.color,
                      }}
                      className="absolute top-2 w-3 h-1.5 rounded-xs border border-[#2A1450]/40"
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* ====================================================== */}
              {/* HERO CONGRATULATIONS BANNER WITH MASCOTS & TROPHY SLAM */}
              {/* ====================================================== */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="relative rounded-[28px] border-[3px] border-[#2A1450] bg-gradient-to-r from-[#220E42] via-[#4C1D95] to-[#220E42] text-white p-5 sm:p-6 shadow-[0_8px_0_#2A1450] overflow-hidden"
              >
                {/* Expanding Golden Shockwave Ring */}
                <motion.div
                  initial={{ scale: 0.3, opacity: 0.85 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-[#FFC928]"
                />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                  {/* Left: Celebrating Elephant Mascot wearing the runner's actual BIB */}
                  <motion.div
                    initial={{ scale: 0, rotate: -18 }}
                    animate={{ scale: 1, rotate: [0, -6, 6, 0] }}
                    transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.08 }}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <div className="relative">
                      <ElephantCharacter
                        size={92}
                        showBib={true}
                        bibNumber={createdOrder.bibNumber}
                        mood="celebrating"
                      />
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 360 }}
                        className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#FFC928] border-2 border-[#2A1450] flex items-center justify-center text-[#2A1450] shadow-md"
                      >
                        <Trophy className="w-4 h-4 stroke-[2.5]" />
                      </motion.span>
                    </div>
                    {createdOrder.runningWithDog && (
                      <motion.div
                        initial={{ scale: 0, y: 16 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        <DogCharacter size={68} mood="happy" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Center: Congratulations Headline & Verified Stamp */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <motion.span
                        initial={{ scale: 2, rotate: -14, opacity: 0 }}
                        animate={{ scale: 1, rotate: -2, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 14, delay: 0.15 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC928] text-[#2A1450] border-2 border-[#2A1450] text-xs font-black uppercase tracking-wider shadow-[0_3px_0_#2A1450]"
                      >
                        <PartyPopper className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>CONGRATULATIONS! ซื้อบัตรวิ่งสำเร็จ</span>
                      </motion.span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 text-[11px] font-extrabold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>โอนสำเร็จใน {createdOrder.transferDurationSec} วินาที</span>
                      </span>
                    </div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 }}
                      className="text-2xl sm:text-3xl font-black text-white leading-tight"
                    >
                      ขอแสดงความยินดีคุณ <span className="text-[#FFC928]">{createdOrder.fullName}</span>!
                    </motion.h3>

                    <p className="text-xs sm:text-sm font-bold text-white/85">
                      คุณได้รับหมายเลข BIB ประจำตัวนักวิ่ง{' '}
                      <span className="font-mono font-black text-[#FFC928]">
                        #{createdOrder.bibNumber}
                      </span>{' '}
                      เรียบร้อยแล้ว · รหัสคำสั่งซื้อ{' '}
                      <span className="font-mono text-white">{createdOrder.orderId}</span> · อ้างอิงสลิป{' '}
                      <span className="font-mono text-emerald-300">{createdOrder.paymentRef}</span>
                    </p>
                  </div>

                  {/* Right: Replay Celebration Fireworks Button */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        playVictoryCelebrationSound(true);
                        setCelebrationKey((prev) => prev + 1);
                      }}
                      className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-[#FFC928] text-white hover:text-[#2A1450] border-2 border-white/30 hover:border-[#2A1450] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>จุดพลุฉลองอีกครั้ง</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* ====================================================== */}
              {/* OFFICIAL COLLECTIBLE E-BIB TICKET (3D POP-IN REVEAL)   */}
              {/* ====================================================== */}
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.16 }}
                className="relative rounded-[28px] border-[3px] border-[#2A1450] bg-white shadow-[0_10px_0_#2A1450] overflow-hidden"
              >
                <div
                  style={{ background: theme.headerGrad }}
                  className="px-6 py-4 text-white border-b-[3px] border-[#2A1450] flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] text-[#FFC928] block">
                      CHANGSUEK RUN 2027 · VERIFIED OFFICIAL E-BIB PASS
                    </span>
                    <span className="text-lg font-black">{createdOrder.routeName}</span>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-[#FFC928] text-[#2A1450] font-display font-black text-sm border-2 border-[#2A1450]">
                    {ticket.distanceLabel}
                  </span>
                </div>

                <div className="p-6 text-center bg-gradient-to-b from-[#FAF7FF] to-white relative overflow-hidden">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6B5A85] block">
                    ASSIGNED SEQUENTIAL BIB NUMBER / หมายเลขประจำตัวนักวิ่งของคุณ
                  </span>

                  {/* Animated Pop-In BIB Number */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -6, opacity: 0 }}
                    animate={{ scale: [0.5, 1.12, 1], rotate: [0, 2, 0], opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.22, ease: 'easeOut' }}
                    className="font-display text-6xl sm:text-7xl font-black text-[#2A1450] tracking-wider my-2 tabular-nums drop-shadow-[0_4px_0_#FFC928]"
                  >
                    #{createdOrder.bibNumber}
                  </motion.div>

                  {/* Rubber Stamp Badge */}
                  <motion.div
                    initial={{ scale: 1.8, opacity: 0, rotate: -12 }}
                    animate={{ scale: 1, opacity: 1, rotate: -3 }}
                    transition={{ type: 'spring', stiffness: 340, damping: 14, delay: 0.35 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-700 text-emerald-900 text-[11px] font-black uppercase tracking-wider mb-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>OFFICIAL TICKET ISSUED · ชำระเงินและออกเลข BIB สำเร็จ</span>
                  </motion.div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-left">
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#2A1450]/15">
                      <span className="text-[10px] font-bold text-[#6B5A85] uppercase block">
                        ชื่อนักวิ่ง
                      </span>
                      <span className="text-sm font-black text-[#2A1450] truncate block">
                        {createdOrder.fullName}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#2A1450]/15">
                      <span className="text-[10px] font-bold text-[#6B5A85] uppercase block">
                        เสื้อวิ่ง Jersey
                      </span>
                      <span className="text-sm font-black text-[#2A1450] block">
                        Size {createdOrder.shirtSize} ({createdOrder.peopleCount} คน)
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#2A1450]/15">
                      <span className="text-[10px] font-bold text-[#6B5A85] uppercase block">
                        เวลาปล่อยตัว
                      </span>
                      <span className="text-sm font-black text-[#2A1450] block">
                        {theme.startTime} (15 ก.พ. 70)
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                        ตรวจสลิปโอนจริงแล้ว
                      </span>
                      <span className="text-sm font-black text-emerald-800 tabular-nums block">
                        ✓ {formatBaht(createdOrder.totalPrice)} บาท
                      </span>
                    </div>
                  </div>

                  {createdOrder.runningWithDog && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F0FDF4] border-2 border-[#16A34A] flex items-center justify-between text-xs font-extrabold text-[#14532D]">
                      <span className="flex items-center gap-2">
                        <PawIcon size={16} color="#16A34A" />
                        <span>
                          สุนัขร่วมวิ่ง: {createdOrder.dogName || 'น้องหมาคู่ใจ'} (
                          {createdOrder.dogBreed || 'ไม่ระบุสายพันธุ์'}) · รวม {createdOrder.dogCount} ตัว
                        </span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#16A34A]">
                        K9 PASS VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onRegistrationSuccess) {
                      onRegistrationSuccess();
                    } else {
                      onClose();
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FFC928] hover:bg-[#FFD646] text-[#2A1450] font-black text-sm border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>เปิดศูนย์นักวิ่ง (Runner Center) & พิมพ์ป้าย BIB</span>
                </button>

                {onOpenAdminModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdminModal();
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#2A1450] hover:bg-[#3B1870] text-[#FFC928] font-extrabold text-sm border-2 border-[#2A1450] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>ดูสลิปในระบบจัดการแอดมิน</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F3E8FF] text-[#2A1450] font-extrabold text-sm border-2 border-[#2A1450] cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lightbox for inspecting uploaded slip in Step 3 */}
        {showSlipLightbox && slipImageDataUrl && (
          <div
            onClick={() => setShowSlipLightbox(false)}
            className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border-2 border-[#2A1450] p-4 max-w-md w-full space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2A1450]">
                  ตัวอย่างรูปสลิปโอนเงิน ({paymentRefInput || 'PromptPay e-Slip'})
                </span>
                <button
                  type="button"
                  onClick={() => setShowSlipLightbox(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={slipImageDataUrl}
                alt="Bank Slip Full Preview"
                className="w-full max-h-[70vh] object-contain rounded-2xl border border-slate-200 mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
