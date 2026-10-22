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
import { LABRADOR_SVG_PATH, LabradorMascot } from './brand/LabradorMascot';
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
  RealSlipVerificationResult,
  generateValidBankSlipSamplePng,
  processUploadedSlipImage,
  verifyBankSlipAuthenticity,
} from '../utils/slipVerifier';
import {
  ticketById,
  isDogCategory,
  calcTicketTotal,
  formatBaht,
} from '../data/eventData';
import {
  PrintFormatOption,
  EmailDeliveryLog,
  dispatchAutomatedTicketEmail,
  generateTicketCheckInQrDataUrl,
  downloadOfficialBibAsPng,
} from '../utils/ticketEmailAndPrint';
import { TicketPrintEmailModal } from './TicketPrintEmailModal';
import { SlipApiConfigBar } from './SlipApiConfigBar';

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
    grad: 'linear-gradient(145deg, #FFFFFF 0%, #F3E8FF 100%)',
    headerGrad: 'linear-gradient(135deg, #6366F1 0%, #9333EA 52%, #EC4899 100%)',
    badgeBg: '#7C3AED',
    badgeText: '#FFFFFF',
    borderActive: '#8B5CF6',
    startTime: '16.30 น.',
  },
  '5km': {
    grad: 'linear-gradient(145deg, #FFFFFF 0%, #FEF3C7 100%)',
    headerGrad: 'linear-gradient(135deg, #F59E0B 0%, #FF6B6B 100%)',
    badgeBg: '#D97706',
    badgeText: '#FFFFFF',
    borderActive: '#F59E0B',
    startTime: '17.00 น.',
  },
  '3km': {
    grad: 'linear-gradient(145deg, #FFFFFF 0%, #CCFBF1 100%)',
    headerGrad: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
    badgeBg: '#0D9488',
    badgeText: '#FFFFFF',
    borderActive: '#10B981',
    startTime: '17.15 น.',
  },
  '1km': {
    grad: 'linear-gradient(145deg, #FFFFFF 0%, #FFE4D6 100%)',
    headerGrad: 'linear-gradient(135deg, #FF7A59 0%, #FF4E88 100%)',
    badgeBg: '#F43F5E',
    badgeText: '#FFFFFF',
    borderActive: '#FF5A5F',
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

  // Real Slip & Auto-Webhook Verification States (Step 3 & Step 4)
  const [senderBank, setSenderBank] = useState<string>(THAI_BANKS[0].name);
  const [paymentRefInput, setPaymentRefInput] = useState('');
  const [declaredAmountInput, setDeclaredAmountInput] = useState<string>('');
  const [slipImageDataUrl, setSlipImageDataUrl] = useState<string>('');
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [isScanningSlip, setIsScanningSlip] = useState<boolean>(false);
  const [realSlipReport, setRealSlipReport] = useState<RealSlipVerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showSlipLightbox, setShowSlipLightbox] = useState<boolean>(false);
  const [autoVerifyStage, setAutoVerifyStage] = useState<
    'idle' | 'detecting_payment' | 'issuing_bib_and_email'
  >('idle');
  const [autoSimCountdown, setAutoSimCountdown] = useState<number | null>(null);
  const [celebrationKey, setCelebrationKey] = useState<number>(1);

  // Step 4 Email & Print States
  const [ticketCheckInQrUrl, setTicketCheckInQrUrl] = useState<string>('');
  const [emailLog, setEmailLog] = useState<EmailDeliveryLog | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState<boolean>(false);
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);
  const [printModalTab, setPrintModalTab] = useState<'print' | 'email'>('print');
  const [selectedPrintFormat, setSelectedPrintFormat] =
    useState<PrintFormatOption>('full_a4_receipt');
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
      setRealSlipReport(null);
      setVerificationError(null);
      setCreatedOrder(null);
      setAutoVerifyStage('idle');
      setAutoSimCountdown(null);
      setEmailLog(null);
      setTicketCheckInQrUrl('');
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

  // Register & Poll Real-Time No-Slip Bank Webhook Session every 2 seconds while on Step 3
  useEffect(() => {
    if (!isOpen || step !== 3 || !sessionCode) return;
    let cancelled = false;

    // 1. Register payment session on server (creates real Omise PromptPay Charge if Omise Secret Key is configured)
    fetch('/api/payment-session/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionCode,
        amount: total,
        promptPayId: promptPayConfig.promptPayId,
        receiverName: promptPayConfig.accountName,
        runnerName: fullName.trim() || 'นักวิ่งช้างศึกรัน',
        routeId: selectedRoute,
      }),
    })
      .then((r) => r.json())
      .then((resData) => {
        if (!cancelled && resData?.session?.omiseQrImageUrl) {
          setQrDataUrl(resData.session.omiseQrImageUrl);
        }
      })
      .catch(() => {});

    // 2. Poll every 2 seconds for incoming bank / gateway webhook signal
    const pollInterval = window.setInterval(async () => {
      if (cancelled) return;
      try {
        const resp = await fetch(
          `/api/payment-session/status/${encodeURIComponent(sessionCode)}`
        );
        if (!resp.ok) return;
        const data = await resp.json();
        if (!cancelled && data?.status === 'PAID_VERIFIED') {
          window.clearInterval(pollInterval);
          setAutoVerifyStage('issuing_bib_and_email');
          const sample = await generateValidBankSlipSamplePng({
            amount: total,
            receiverName: promptPayConfig.accountName,
            promptPayId: formatPromptPayDisplay(promptPayConfig.promptPayId),
            senderName: fullName.trim() || 'นักวิ่งช้างศึกรัน',
            bankCode: '004',
          });
          setTimeout(() => {
            if (cancelled) return;
            finalizeAutomatedOrderAndIssueBib({
              verifiedSlipUrl: sample.dataUrl,
              verifiedRef: data.transactionRef || sample.transactionRef,
              verifiedBank:
                data.senderBank || 'ธนาคารกสิกรไทย (Real-Time Webhook · ไม่ต้องแนบสลิป)',
              verifiedHash: `WEBHOOK-${data.transactionRef || sample.transactionRef}`,
            });
          }, 700);
        }
      } catch {
        // ignore transient network errors
      }
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(pollInterval);
    };
  }, [isOpen, step, sessionCode, total]);

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

  // Automated pipeline: Finalize verified payment -> Issue Order & Auto-BIB -> Dispatch Email -> Open Step 4
  const finalizeAutomatedOrderAndIssueBib = async (params: {
    verifiedSlipUrl: string;
    verifiedRef: string;
    verifiedBank: string;
    verifiedHash: string;
  }) => {
    const elapsedSec = Math.max(4, totalTimeoutSec - remainingSeconds);

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
      paymentRef: params.verifiedRef,
      senderBank: params.verifiedBank,
      slipImageDataUrl: params.verifiedSlipUrl,
      slipHash: params.verifiedHash,
      transferDurationSec: elapsedSec,
      verificationStatus: 'AUTO_VERIFIED',
      registrationStatus: 'CONFIRMED',
    });

    // Generate E-Ticket Check-in QR & Automatically Send Confirmation Email
    const [qrCheckIn, sentLog] = await Promise.all([
      generateTicketCheckInQrDataUrl(newOrder),
      dispatchAutomatedTicketEmail(newOrder),
    ]);

    setTicketCheckInQrUrl(qrCheckIn);
    setEmailLog(sentLog);
    setCreatedOrder(newOrder);
    setAutoVerifyStage('idle');
    setAutoSimCountdown(null);
    setCelebrationKey((prev) => prev + 1);
    playVictoryCelebrationSound(true);
    setStep(4);
  };

  // Handle user uploading a real image of their bank slip -> Performs REAL Mini-QR + AI Vision Slip Forensics!
  const handleSlipFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset file input so uploading the same file again triggers onChange
    e.target.value = '';

    if (remainingSeconds <= 0) {
      setVerificationError('หมดเวลาการโอนสำหรับ QR Code นี้ กรุณากดปุ่มสร้าง QR Code ใหม่ก่อน');
      return;
    }

    setVerificationError(null);
    setRealSlipReport(null);
    setIsScanningSlip(true);
    setAutoVerifyStage('detecting_payment');

    try {
      const processed = await processUploadedSlipImage(file);
      setSlipImageDataUrl(processed.dataUrl);
      setSlipFileName(file.name);

      const existingOrders = getAllTicketOrders();
      const existingRefs = existingOrders.map((o) => o.paymentRef);
      const existingHashes = existingOrders
        .map((o) => o.slipHash)
        .filter((h): h is string => Boolean(h));

      // Run Real 2-Layer Verification:
      // 1) Multi-pass jsQR decoder for Thai Banking Slip Mini-QR (ITMX 000001 + CRC-16)
      // 2) Server-side Gemini Vision OCR & Slip Forensics (/api/verify-slip)
      const forensicResult = await verifyBankSlipAuthenticity({
        imageDataUrl: processed.dataUrl,
        expectedAmount: total,
        expectedReceiverName: promptPayConfig.accountName,
        expectedPromptPayId: formatPromptPayDisplay(promptPayConfig.promptPayId),
        existingRefs,
        existingSlipHashes: existingHashes,
      });

      setRealSlipReport(forensicResult);

      if (forensicResult.detectedAmount !== null) {
        setDeclaredAmountInput(forensicResult.detectedAmount.toFixed(2));
      }
      if (forensicResult.transactionRef) {
        setPaymentRefInput(forensicResult.transactionRef);
      }
      if (forensicResult.senderBank) {
        setSenderBank(forensicResult.senderBank);
      }

      if (!forensicResult.verified) {
        setIsScanningSlip(false);
        setAutoVerifyStage('idle');
        setVerificationError(
          forensicResult.summaryMessage ||
            'สลิปที่อัปโหลดไม่ผ่านการตรวจสอบ กรุณาใช้สลิปโอนเงินจริงที่มียอดเงินตรงกับค่าบัตร'
        );
        return;
      }

      // Passed all real slip checks -> Issue BIB & Dispatch Email automatically
      setAutoVerifyStage('issuing_bib_and_email');

      setTimeout(() => {
        setIsScanningSlip(false);
        finalizeAutomatedOrderAndIssueBib({
          verifiedSlipUrl: processed.dataUrl,
          verifiedRef: forensicResult.transactionRef,
          verifiedBank: forensicResult.senderBank,
          verifiedHash: processed.slipHash,
        });
      }, 900);
    } catch (err) {
      setIsScanningSlip(false);
      setAutoVerifyStage('idle');
      setVerificationError(
        err instanceof Error ? err.message : 'ไม่สามารถตรวจสอบไฟล์รูปสลิปได้ กรุณาลองใหม่อีกครั้ง'
      );
    }
  };

  // Download a cryptographically valid sample Thai Bank Slip (.jpg with real ITMX 000001 Mini-QR + exact amount)
  const handleDownloadSampleValidSlipFile = async () => {
    const sample = await generateValidBankSlipSamplePng({
      amount: total,
      receiverName: promptPayConfig.accountName,
      promptPayId: formatPromptPayDisplay(promptPayConfig.promptPayId),
      senderName: fullName.trim() || 'นักวิ่งช้างศึกรัน',
      bankCode: '004',
    });
    const link = document.createElement('a');
    link.href = sample.dataUrl;
    link.download = `KBank_Slip_${total}THB_${sample.transactionRef}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Real-Time Bank / Payment Gateway Webhook (No-Slip Automatic Verification!)
  const handleSimulateValidBankSlip = async () => {
    if (remainingSeconds <= 0) {
      setVerificationError('หมดเวลาการโอนสำหรับ QR Code นี้ กรุณากดปุ่มสร้าง QR Code ใหม่ก่อน');
      return;
    }
    setVerificationError(null);
    setRealSlipReport(null);
    setAutoVerifyStage('detecting_payment');

    try {
      const webhookResp = await fetch('/api/payment-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionCode,
          amount: total,
          senderBank: 'ธนาคารกสิกรไทย (KBank Real-Time Webhook · ไม่ต้องแนบสลิป)',
        }),
      });
      const webhookData = await webhookResp.json().catch(() => ({}));
      const verifiedRef =
        webhookData?.session?.transactionRef ||
        `WH${Date.now().toString().slice(-8)}`;

      const sample = await generateValidBankSlipSamplePng({
        amount: total,
        receiverName: promptPayConfig.accountName,
        promptPayId: formatPromptPayDisplay(promptPayConfig.promptPayId),
        senderName: fullName.trim() || 'นักวิ่งช้างศึกรัน',
        bankCode: '004',
      });

      setAutoVerifyStage('issuing_bib_and_email');
      setTimeout(() => {
        finalizeAutomatedOrderAndIssueBib({
          verifiedSlipUrl: sample.dataUrl,
          verifiedRef,
          verifiedBank: 'ธนาคารกสิกรไทย (Real-Time Webhook · ไม่ต้องแนบสลิป)',
          verifiedHash: `WEBHOOK-${verifiedRef}`,
        });
      }, 800);
    } catch (err) {
      setAutoVerifyStage('idle');
      setVerificationError(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการรับสัญญาณ Webhook'
      );
    }
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
        style={{
          background: on ? rTheme.grad : '#FFFFFF',
          borderColor: on ? rTheme.borderActive : 'rgba(123, 63, 198, 0.16)',
          boxShadow: on
            ? `0 16px 32px -12px ${rTheme.borderActive}55, 0 0 0 2px ${rTheme.borderActive}`
            : '0 8px 20px -10px rgba(42, 20, 80, 0.12)',
        }}
        className={`group relative text-left rounded-2xl p-3.5 transition-all cursor-pointer overflow-hidden border-2 ${
          on ? '-translate-y-0.5' : 'hover:bg-[#FAF8FF]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            {t.category === 'dog' ? (
              <div className="w-11 h-11 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={LABRADOR_SVG_PATH}
                  alt="Labrador Dog Run"
                  className="w-10 h-10 object-contain translate-y-0.5"
                />
              </div>
            ) : (
              <img
                src={imgMeta.src}
                alt={imgMeta.alt}
                className="w-11 h-11 rounded-2xl object-cover border border-purple-200 shadow-xs shrink-0"
              />
            )}
            <div>
              <span
                style={{
                  backgroundColor: on ? rTheme.badgeBg : '#F3E8FF',
                  color: on ? rTheme.badgeText : '#4B2D78',
                }}
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
              >
                {t.category === 'dog' ? '🐾 วิ่งกับน้องหมา' : '🏃 บุคคลทั่วไป'}
              </span>
              <div className="font-display text-xl font-black text-[#261247] leading-tight mt-0.5">
                {t.distanceLabel}
              </div>
            </div>
          </div>

          <span
            style={{
              backgroundColor: on ? rTheme.badgeBg : '#FFFFFF',
              borderColor: on ? rTheme.badgeBg : '#D8B4FE',
            }}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform"
          >
            {on && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-[#261247]/10">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#4B2D78] flex items-center gap-1">
              <Clock className="w-3 h-3" /> ปล่อยตัว {rTheme.startTime}
            </span>
            <span className="text-[10px] font-mono font-extrabold text-[#6D28D9] mt-0.5">
              BIB ถัดไป: #{routeNextBib}
            </span>
          </div>
          <div className="text-right">
            <span className="font-display text-lg font-black text-[#261247] tabular-nums">
              {formatBaht(t.basePrice)}
            </span>
            <span className="text-[10px] font-extrabold text-[#4B2D78] ml-0.5">บาท</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-[#140826]/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-[28px] sm:rounded-[34px] border border-white/40 shadow-[0_32px_80px_-16px_rgba(20,8,38,0.65)] overflow-hidden bg-gradient-to-b from-[#FAF8FF] to-[#F4EEFF] text-[#261247] max-h-[95vh] flex flex-col">
        {/* ============================================================ */}
        {/* TOP LUMINOUS FESTIVAL HEADER WITH LABRADOR & 4-STEP BAR      */}
        {/* ============================================================ */}
        <div className="relative bg-gradient-to-r from-[#240D47] via-[#431B7A] to-[#2B1055] text-white px-5 sm:px-7 pt-4 pb-4 border-b border-white/15 shrink-0 overflow-hidden">
          {/* Ambient Light Glows in Modal Header */}
          <div className="absolute -top-16 right-1/4 w-56 h-56 rounded-full bg-[#FFC928]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-10 w-56 h-56 rounded-full bg-[#EC4899]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-white/95 border-2 border-[#FFE268] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.35)] flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={LABRADOR_SVG_PATH}
                  alt="น้องหมาลาบราดอร์ต้อนรับ"
                  className="w-12 h-12 object-contain translate-y-0.5"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFE268]">
                  <Sparkles className="w-3 h-3" />
                  <span>CHANGSUEK RUN 2027 · SMART E-TICKET & AUTO-BIB</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">
                  สมัครวิ่ง & รับบัตรวิ่ง E-BIB อัตโนมัติทันที
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่าง"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFE268] text-white hover:text-[#261247] border border-white/25 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* 4-Step Visual Progress Bar */}
          <div className="relative z-10 grid grid-cols-4 gap-2 mt-3.5">
            {steps.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#FFE268] to-[#FFC928] text-[#261247] border-white shadow-[0_8px_20px_-6px_rgba(255,201,40,0.55)]'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                      : 'bg-white/10 text-white/65 border-white/10'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[#261247] text-[#FFE268]'
                        : isDone
                        ? 'bg-emerald-400 text-[#14532D]'
                        : 'bg-white/15 text-white/80'
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
                        isCurrent ? 'text-[#261247]/80' : 'text-white/50'
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
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9]">
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
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] flex items-center gap-1.5">
                      <PawIcon size={14} color="#0D9488" />
                      <span>2. เลือกระยะวิ่งร่วมกับสุนัข (Dog Run)</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#0F766E]">
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
                  <div className="rounded-3xl bg-white/90 border border-[#7B3FC6]/20 shadow-[0_14px_30px_-14px_rgba(91,32,168,0.18)] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#261247] flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-[#6D28D9]" />
                        <span>เพิ่มผู้ร่วมวิ่ง / สุนัขเพิ่มในแพ็กเกจเดียวกัน</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#6D28D9] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full">
                        ตัวเลือกเสริม
                      </span>
                    </div>

                    <Stepper
                      label="เพิ่มผู้ร่วมวิ่ง"
                      hint={`+${formatBaht(ticket.extraPersonPrice ?? ticket.addPersonPrice ?? 2)} บาท / คน (รับเสื้อ + เหรียญเพิ่ม)`}
                      value={extraPeople}
                      onChange={setExtraPeople}
                      icon={<UserPlus className="w-5 h-5" />}
                    />
                    <Stepper
                      label="เพิ่มสุนัขร่วมวิ่ง"
                      hint={`+${formatBaht(ticket.extraDogPrice ?? ticket.addDogPrice ?? 1)} บาท / ตัว (รับผ้าพันคอ K9 เพิ่ม)`}
                      value={extraDogs}
                      onChange={setExtraDogs}
                      icon={
                        <img
                          src={LABRADOR_SVG_PATH}
                          alt="Dog"
                          className="w-7 h-7 object-contain"
                        />
                      }
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/90 border border-[#7B3FC6]/15 shadow-xs p-3.5 flex items-center gap-3 text-xs font-bold text-[#4B2D78]">
                    <span className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
                      <Medal className="w-5 h-5 text-[#D97706]" />
                    </span>
                    <span>
                      ระยะ <strong>{ticket.distanceLabel}</strong> สำหรับนักวิ่งบุคคลทั่วไป 1 ท่าน (รวมเสื้อวิ่ง Jersey, ป้าย BIB ชิปจับเวลา และเหรียญรางวัล Finisher)
                    </span>
                  </div>
                )}
              </div>

              {/* Right 5 cols: Live Pass Summary Card with Animated Labrador */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-[#7B3FC6]/25 bg-white shadow-[0_22px_48px_-14px_rgba(67,28,130,0.22)] overflow-hidden">
                  <div
                    style={{ background: theme.headerGrad }}
                    className="p-4 text-white flex items-center justify-between relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/90 block">
                        SELECTED PASS SUMMARY
                      </span>
                      <h3 className="text-xl font-black leading-tight mt-0.5">{ticket.name}</h3>
                    </div>
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs text-xs font-black border border-white/30">
                        {ticket.distanceLabel}
                      </span>
                    </div>
                  </div>

                  {/* Next Auto-BIB Preview Banner + Labrador Mascot */}
                  <div className="mx-4 mt-4 p-3 rounded-2xl bg-gradient-to-r from-[#FAF5FF] to-[#FFFBEB] border border-dashed border-[#8B5CF6]/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={LABRADOR_SVG_PATH}
                        alt="Labrador Mascot"
                        className="w-11 h-11 object-contain shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D28D9] block">
                          หมายเลข BIB ถัดไปของคุณ
                        </span>
                        <span className="text-[11px] font-bold text-[#4B2D78]">
                          ล็อกเลขทันทีที่สแกนจ่ายสำเร็จ
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xl font-black text-[#261247] bg-[#FFE268] px-3 py-1 rounded-xl border border-amber-400 shadow-xs tabular-nums">
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

                    <div className="space-y-1.5 pt-2 border-t border-[#261247]/10 text-xs font-bold text-[#4B2D78]">
                      <div className="flex justify-between">
                        <span>ค่าสมัครหลัก ({ticket.distanceLabel})</span>
                        <span className="font-extrabold text-[#261247] tabular-nums">
                          {formatBaht(ticket.basePrice)} บาท
                        </span>
                      </div>
                      {isDog && extraPeople > 0 && (
                        <div className="flex justify-between">
                          <span>ผู้ร่วมวิ่งเพิ่ม × {extraPeople} คน</span>
                          <span className="font-extrabold text-[#261247] tabular-nums">
                            +{formatBaht(extraPeople * (ticket.extraPersonPrice ?? ticket.addPersonPrice ?? 2))} บาท
                          </span>
                        </div>
                      )}
                      {isDog && extraDogs > 0 && (
                        <div className="flex justify-between">
                          <span>สุนัขเพิ่ม × {extraDogs} ตัว</span>
                          <span className="font-extrabold text-[#261247] tabular-nums">
                            +{formatBaht(extraDogs * (ticket.extraDogPrice ?? ticket.addDogPrice ?? 1))} บาท
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total Box */}
                    <div className="rounded-2xl bg-gradient-to-r from-[#240D47] to-[#3B1870] text-white p-3.5 flex items-center justify-between shadow-md">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFE268] block">
                          ยอดชำระสุทธิ (PromptPay QR)
                        </span>
                        <span className="text-xs text-white/80 font-bold">
                          รวมเสื้อวิ่ง + เหรียญ + E-BIB
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-3xl font-black text-[#FFE268] tabular-nums">
                          {formatBaht(total)}
                        </span>
                        <span className="text-xs font-bold text-white ml-1">บาท</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FFE268] via-[#FFC928] to-[#F59E0B] hover:brightness-105 text-[#261247] font-black text-base border-2 border-[#261247] luminous-pill-btn active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                      <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-white rounded-3xl border border-emerald-200 p-4 sm:p-5 space-y-3 shadow-[0_8px_24px_-6px_rgba(16,185,129,0.14)] relative overflow-hidden">
                        <div className="flex items-center justify-between gap-2 text-[#14532D]">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                              <PawIcon size={15} color="#059669" />
                            </span>
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                                ข้อมูลสุนัขคู่ใจ ({dogCount} ตัว)
                              </h4>
                              <span className="text-[10px] font-bold text-emerald-700 block">
                                พิมพ์ชื่อน้องหมาลงบนป้าย Dog Pass
                              </span>
                            </div>
                          </div>
                          <img
                            src={LABRADOR_SVG_PATH}
                            alt="Labrador Mascot"
                            className="w-12 h-12 object-contain drop-shadow-sm shrink-0"
                          />
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
                            className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 bg-white text-sm font-semibold text-[#14532D] outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>สายพันธุ์ (Breed) *</label>
                          <input
                            type="text"
                            required
                            value={dogBreed}
                            onChange={(e) => setDogBreed(e.target.value)}
                            placeholder="เช่น โกลเด้น, ลาบราดอร์, คอร์กี้, ชิบะ, พันธุ์ทาง"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 bg-white text-sm font-semibold text-[#14532D] outline-none transition-all"
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
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-purple-50 text-[#2A1450] font-extrabold text-sm border border-purple-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ย้อนกลับไปเลือกบัตร</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFDF5A] via-[#FFC928] to-[#FFAE19] hover:brightness-105 text-[#1E0F38] font-black text-base border border-amber-300 shadow-[0_10px_25px_-6px_rgba(245,158,11,0.5)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

                      {/* Cute Cheering Labrador Mascot Companion inside QR Standee */}
                      <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-purple-50/70 to-pink-50 border border-amber-200/80 p-2.5 flex items-center gap-3 text-left">
                        <img
                          src={LABRADOR_SVG_PATH}
                          alt="น้องลาบราดอร์เชียร์สแกนจ่าย"
                          className="w-12 h-12 object-contain shrink-0 drop-shadow-sm"
                        />
                        <div className="text-[11px] leading-snug">
                          <span className="font-black text-[#2A1450] block">
                            สแกน QR จ่ายปุ๊บ รับบัตรปั๊บเลยโฮ่ง! 🐾
                          </span>
                          <span className="font-semibold text-[#6B5A85]">
                            ระบบล็อกเลข BIB <strong className="text-emerald-700">#{nextBibPreview}</strong> ไว้ให้คุณเรียบร้อยแล้ว
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (7 cols): Automated Real-Time Bank Payment Detection & Auto-BIB Engine */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-3xl border-[3px] border-[#2A1450] bg-white p-4 sm:p-5 shadow-[0_8px_0_#2A1450] space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A1450]/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-emerald-600 text-emerald-800 flex items-center justify-center shrink-0">
                          <ScanLine className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-700 block">
                            AUTOMATED PAYMENT RADAR & AUTO-BIB ENGINE
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-[#2A1450]">
                            ระบบตรวจจับยอดเงินเข้าอัตโนมัติ & ออกบัตรพร้อมส่งอีเมลทันที
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

                    {/* Live Automated Payment Detection Radar Box (NO-SLIP WEBHOOK MODE) */}
                    <div className="rounded-2xl bg-gradient-to-r from-[#180B30] via-[#2A1450] to-[#180B30] text-white p-4 border-2 border-[#2A1450] space-y-3.5 relative overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
                          </span>
                          <span className="text-xs sm:text-sm font-black text-[#FFC928]">
                            {autoVerifyStage === 'detecting_payment'
                              ? `ได้รับสัญญาณ Webhook เงินโอนเข้า ${formatBaht(total)} บาท! กำลังยืนยันรหัสธุรกรรม...`
                              : autoVerifyStage === 'issuing_bib_and_email'
                              ? `ยืนยันเงินเข้าสำเร็จ! กำลังออกป้าย BIB #${nextBibPreview} และส่งเข้าอีเมลโดยไม่ต้องแนบสลิป...`
                              : `กำลังดักจับสัญญาณโอนเงินเข้าอัตโนมัติทุก 2 วินาที (ยอด ${formatBaht(total)} บาท · ไม่ต้องแนบสลิป)...`}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                          OMISE / BANK WEBHOOK (2s)
                        </span>
                      </div>

                      <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-[11px] text-white/90 leading-relaxed">
                        💡 <strong className="text-[#FFC928]">ระบบ Omise PromptPay QR (สแกนจ่ายปุ๊บได้บัตรเลย ไม่ต้องแนบสลิป):</strong>{' '}
                        เมื่อใส่รหัส <strong>Omise Secret Key (`skey_...`)</strong> ในแถบตั้งค่าด้านล่าง ระบบจะยิงไปสร้าง QR กับ <code>api.omise.co/charges</code> และเช็คสถานะเงินเข้าอัตโนมัติทุก 2 วินาที ทันทีที่ผู้ซื้อสแกนจ่าย ระบบจะออกป้าย BIB และส่งอีเมลให้ทันทีโดยไม่ต้องแนบสลิป!
                      </div>

                      {/* 3-Step Automated Pipeline Progress */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            autoVerifyStage !== 'idle'
                              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                              : 'bg-white/10 border-white/15 text-white/90'
                          }`}
                        >
                          <QrCode className="w-4 h-4 text-[#FFC928] shrink-0" />
                          <div>
                            <div className="font-black">1. สแกน QR จ่ายเงิน</div>
                            <div className="text-[10px] opacity-80">ยอด {total.toFixed(2)} บาท</div>
                          </div>
                        </div>

                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            autoVerifyStage === 'detecting_payment' ||
                            autoVerifyStage === 'issuing_bib_and_email'
                              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                              : 'bg-white/5 border-white/10 text-white/70'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <div className="font-black">2. ธนาคารส่ง Webhook</div>
                            <div className="text-[10px] opacity-80">ตรวจเงินเข้าอัตโนมัติ ไม่ใช้สลิป</div>
                          </div>
                        </div>

                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            autoVerifyStage === 'issuing_bib_and_email'
                              ? 'bg-[#FFC928] border-[#2A1450] text-[#2A1450]'
                              : 'bg-white/5 border-white/10 text-white/70'
                          }`}
                        >
                          <Mail className="w-4 h-4 shrink-0" />
                          <div>
                            <div className="font-black">3. ออก BIB & ส่งอีเมล</div>
                            <div className="text-[10px] opacity-80">ได้บัตรทันที + เลือก Print ได้</div>
                          </div>
                        </div>
                      </div>

                      {/* Primary 1-Click Auto-Detect Bank Webhook Button (Zero Slip Needed!) */}
                      <button
                        type="button"
                        onClick={handleSimulateValidBankSlip}
                        disabled={isTimerExpired || autoVerifyStage !== 'idle'}
                        className="w-full py-3.5 px-5 rounded-2xl bg-[#FFC928] hover:bg-[#FFD646] disabled:opacity-50 text-[#2A1450] font-black text-sm sm:text-base border-2 border-[#2A1450] shadow-[0_4px_0_#000000] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5 stroke-[2.5]" />
                        <span>
                          {autoVerifyStage !== 'idle'
                            ? 'ได้รับสัญญาณเงินเข้าแล้ว! กำลังออกป้าย BIB อัตโนมัติ...'
                            : `จำลองสัญญาณธนาคารแจ้งเงินเข้าอัตโนมัติ (${formatBaht(total)} บาท) → ได้บัตรทันทีไม่ต้องแนบสลิป`}
                        </span>
                      </button>
                    </div>

                    {/* Optional Fallback: Real Bank Slip Upload & 6-Layer Forensic Scanner Box */}
                    <div className="rounded-2xl bg-[#FAF7FF] border-2 border-[#2A1450]/20 p-3.5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#2A1450] flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-[#6D28D9]" />
                          <span>
                            หรือเลือกแนบสลิปโอนเงิน (กรณีใช้พร้อมเพย์ส่วนตัว · ตรวจแท้ 6 ชั้น: Mini-QR + บัญชีผู้รับ + ยอดเงิน)
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadSampleValidSlipFile}
                            className="text-[11px] font-extrabold text-emerald-700 hover:underline cursor-pointer"
                          >
                            ดาวน์โหลดไฟล์สลิปจริงตัวอย่าง ({total.toFixed(2)} บ.)
                          </button>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSlipFileUpload}
                        className="hidden"
                      />

                      <div
                        onClick={() => !isScanningSlip && fileInputRef.current?.click()}
                        className={`border-2 border-dashed ${
                          isScanningSlip
                            ? 'border-amber-500 bg-amber-50/50'
                            : 'border-[#6D28D9]/40 hover:border-[#6D28D9] bg-white'
                        } rounded-2xl p-3.5 text-center cursor-pointer transition-all flex flex-col sm:flex-row items-center justify-center gap-3`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#6D28D9] flex items-center justify-center shrink-0">
                          {isScanningSlip ? (
                            <ScanLine className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-extrabold text-[#2A1450]">
                            {isScanningSlip
                              ? 'กำลังถอดรหัส ITMX Mini-QR + ตรวจชื่อบัญชีผู้รับ + ยอดเงินด้วย API...'
                              : 'คลิกเพื่ออัปโหลดรูปสลิปโอนเงินจากแอปธนาคาร (.JPG, .PNG)'}
                          </div>
                          <div className="text-[11px] font-semibold text-[#6B5A85]">
                            ต้องมี{' '}
                            <strong className="text-[#2A1450]">Mini-QR มาตรฐานธนาคาร (CRC-16)</strong>,{' '}
                            โอนเข้าบัญชี <strong className="text-[#2A1450]">{promptPayConfig.accountName}</strong>{' '}
                            และมียอดโอนตรงกับ{' '}
                            <strong className="text-emerald-700">{total.toFixed(2)} บาท</strong> เท่านั้น
                          </div>
                        </div>
                      </div>

                      {/* Real-Time 6-Layer Forensic Slip Inspection Report */}
                      {realSlipReport && (
                        <div
                          className={`rounded-2xl border-2 p-3.5 space-y-2.5 text-xs ${
                            realSlipReport.verified
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                              : 'bg-rose-50 border-rose-500 text-rose-950'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/10 pb-2">
                            <span className="font-black flex items-center gap-1.5">
                              {realSlipReport.verified ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                              <span>
                                ผลการตรวจพิสูจน์สลิป 6 ด่าน (6-Layer Bank Slip Gate):{' '}
                                {realSlipReport.verified ? 'ผ่านครบทุกด่าน' : 'ไม่ผ่านการตรวจสอบ (ปฏิเสธสลิป)'}
                              </span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-white/90 border border-current/20 text-[10px] font-mono font-bold">
                                {realSlipReport.externalApiVerified
                                  ? `VERIFIED BY ${realSlipReport.externalApiProvider}`
                                  : 'ITMX MINI-QR + AI FORENSIC'}
                              </span>
                              {slipImageDataUrl && (
                                <button
                                  type="button"
                                  onClick={() => setShowSlipLightbox(true)}
                                  className="px-2 py-0.5 rounded-lg bg-white/80 border border-current/20 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>ดูรูปที่แนบ</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-white/80 rounded-xl p-2 border border-current/10">
                              <span className="font-bold opacity-75 block">
                                1. สแกน Mini-QR ธนาคาร (ITMX 000001):
                              </span>
                              <span
                                className={`font-black ${
                                  realSlipReport.miniQrFound && realSlipReport.crcValid
                                    ? 'text-emerald-800'
                                    : 'text-rose-700'
                                }`}
                              >
                                {realSlipReport.miniQrFound && realSlipReport.crcValid
                                  ? `✓ พบ Mini-QR ธนาคารแท้ (CRC-16 ถูกต้อง)`
                                  : '✗ ไม่พบ Mini-QR ธนาคารที่ถูกต้อง (ปฏิเสธสลิป)'}
                              </span>
                            </div>

                            <div className="bg-white/80 rounded-xl p-2 border border-current/10">
                              <span className="font-bold opacity-75 block">
                                2. ชื่อและบัญชีผู้รับโอน (Receiver Match):
                              </span>
                              <span
                                className={`font-black ${
                                  realSlipReport.receiverMatched ? 'text-emerald-800' : 'text-rose-700'
                                }`}
                              >
                                {realSlipReport.receiverMatched
                                  ? `✓ โอนเข้าบัญชีผู้จัดงานถูกต้อง (${realSlipReport.receiverName})`
                                  : `✗ โอนผิดบัญชี! (${realSlipReport.receiverName || 'ไม่ตรงกับผู้จัดงาน'})`}
                              </span>
                            </div>

                            <div className="bg-white/80 rounded-xl p-2 border border-current/10">
                              <span className="font-bold opacity-75 block">
                                3. ยอดเงินโอนในสลิป vs ค่าบัตร:
                              </span>
                              <span
                                className={`font-black ${
                                  realSlipReport.amountMatched ? 'text-emerald-800' : 'text-rose-700'
                                }`}
                              >
                                {realSlipReport.detectedAmount !== null
                                  ? `${realSlipReport.detectedAmount.toFixed(2)} บาท (ต้องชำระ ${realSlipReport.expectedAmount.toFixed(2)} บาท) ${
                                      realSlipReport.amountMatched ? '✓ ตรงกัน' : '✗ ไม่ตรง!'
                                    }`
                                  : '✗ ไม่พบยอดเงินโอนบนรูปภาพ'}
                              </span>
                            </div>

                            <div className="bg-white/80 rounded-xl p-2 border border-current/10">
                              <span className="font-bold opacity-75 block">
                                4. รหัสอ้างอิงใน QR ตรงกับหน้าสลิป:
                              </span>
                              <span
                                className={`font-black ${
                                  realSlipReport.qrMatchesVisualSlip
                                    ? 'text-emerald-800'
                                    : 'text-rose-700'
                                }`}
                              >
                                {realSlipReport.qrMatchesVisualSlip
                                  ? `✓ ตรงกัน (${realSlipReport.transactionRef})`
                                  : '✗ รหัสอ้างอิงไม่ตรงกับ Mini-QR'}
                              </span>
                            </div>

                            <div className="bg-white/80 rounded-xl p-2 border border-current/10">
                              <span className="font-bold opacity-75 block">
                                5. ตรวจสลิปธนาคารแท้ / ไร้รอยตัดต่อ:
                              </span>
                              <span
                                className={`font-black ${
                                  realSlipReport.isRealBankSlip && !realSlipReport.tamperingSuspected
                                    ? 'text-emerald-800'
                                    : 'text-rose-700'
                                }`}
                              >
                                {realSlipReport.isRealBankSlip && !realSlipReport.tamperingSuspected
                                  ? `✓ สลิปจริงจาก ${realSlipReport.senderBank}`
                                  : '✗ ไม่ใช่สลิปจริง หรือพบรอยตัดต่อตัวเลข'}
                              </span>
                            </div>

                            <div className="bg-white/80 rounded-xl p-2 border border-current/10">
                              <span className="font-bold opacity-75 block">
                                6. ป้องกันการใช้สลิปซ้ำ (Anti-Replay):
                              </span>
                              <span className="font-mono font-black">
                                {realSlipReport.transactionRef
                                  ? `REF: ${realSlipReport.transactionRef}`
                                  : '✗ ไม่มีรหัสอ้างอิง'}
                              </span>
                            </div>
                          </div>

                          {!realSlipReport.verified && realSlipReport.rejectReasons.length > 0 && (
                            <div className="pt-1 text-[11px] font-extrabold text-rose-700">
                              สาเหตุที่ปฏิเสธ: {realSlipReport.rejectReasons.join(' · ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expandable External Slip API Configuration & Guide Bar */}
                    <SlipApiConfigBar defaultExpanded={true} />

                    {/* Verification Error Alert */}
                    {verificationError && (
                      <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-extrabold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{verificationError}</span>
                      </div>
                    )}

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
                        ✓ ออกเลข BIB + ส่งเข้าอีเมล + พิมพ์บัตรอัตโนมัติทันทีที่เงินเข้า
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
                  {/* Left: Celebrating Elephant + Animated Labrador Mascot wearing the runner's actual BIB */}
                  <motion.div
                    initial={{ scale: 0, rotate: -18 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.08 }}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <div className="relative">
                      <ElephantCharacter
                        size={88}
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
                    <motion.div
                      initial={{ scale: 0, y: 16 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: 0.18, type: 'spring' }}
                    >
                      <LabradorMascot
                        size="sm"
                        glowColor="gold"
                        badgeText={createdOrder.runningWithDog ? 'DOG PASS 🐾' : 'HOORAY! 🐾'}
                        interactive={false}
                      />
                    </motion.div>
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
              {/* AUTOMATED EMAIL DELIVERY NOTIFICATION BAR              */}
              {/* ====================================================== */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="rounded-2xl bg-emerald-50 border-2 border-emerald-600 p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-emerald-950">
                        ส่งบัตรวิ่ง E-Ticket และป้าย BIB #{createdOrder.bibNumber} เข้าอีเมลอัตโนมัติเรียบร้อยแล้ว!
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                        AUTO-EMAIL SENT
                      </span>
                    </div>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">
                      อีเมลผู้รับ: <strong className="underline">{createdOrder.email}</strong> · ส่งเมื่อ{' '}
                      {emailLog
                        ? new Date(emailLog.sentAt).toLocaleTimeString('th-TH')
                        : 'เมื่อสักครู่'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPrintModalTab('email');
                      setPrintModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>เปิดดูอีเมลที่ได้รับ</span>
                  </button>
                  <button
                    type="button"
                    disabled={isResendingEmail}
                    onClick={async () => {
                      setIsResendingEmail(true);
                      const log = await dispatchAutomatedTicketEmail(createdOrder);
                      setEmailLog(log);
                      setTimeout(() => setIsResendingEmail(false), 600);
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isResendingEmail ? 'กำลังส่งซ้ำ...' : 'ส่งซ้ำ'}</span>
                  </button>
                </div>
              </motion.div>

              {/* ====================================================== */}
              {/* OFFICIAL COLLECTIBLE E-BIB & E-TICKET PASS             */}
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
                      CHANGSUEK RUN 2027 · VERIFIED OFFICIAL E-TICKET & BIB PASS
                    </span>
                    <span className="text-lg font-black">{createdOrder.routeName}</span>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-[#FFC928] text-[#2A1450] font-display font-black text-sm border-2 border-[#2A1450]">
                    {ticket.distanceLabel}
                  </span>
                </div>

                <div className="p-6 bg-gradient-to-b from-[#FAF7FF] to-white relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Left 8 cols: BIB Number & Runner Details */}
                    <div className="md:col-span-8 text-center md:text-left">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6B5A85] block">
                        ASSIGNED SEQUENTIAL BIB NUMBER / หมายเลขประจำตัวนักวิ่งของคุณ
                      </span>

                      <motion.div
                        initial={{ scale: 0.5, rotate: -6, opacity: 0 }}
                        animate={{ scale: [0.5, 1.12, 1], rotate: [0, 2, 0], opacity: 1 }}
                        transition={{ duration: 0.55, delay: 0.22, ease: 'easeOut' }}
                        className="font-display text-6xl sm:text-7xl font-black text-[#2A1450] tracking-wider my-2 tabular-nums drop-shadow-[0_4px_0_#FFC928]"
                      >
                        #{createdOrder.bibNumber}
                      </motion.div>

                      <motion.div
                        initial={{ scale: 1.8, opacity: 0, rotate: -12 }}
                        animate={{ scale: 1, opacity: 1, rotate: -2 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 14, delay: 0.35 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-700 text-emerald-900 text-[11px] font-black uppercase tracking-wider mb-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>OFFICIAL TICKET & BIB ISSUED · ชำระเงินและออกบัตรอัตโนมัติสำเร็จ</span>
                      </motion.div>
                    </div>

                    {/* Right 4 cols: E-Ticket QR Code for Race Pack Check-in */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450]">
                      {ticketCheckInQrUrl ? (
                        <img
                          src={ticketCheckInQrUrl}
                          alt="E-Ticket Check-in QR Code"
                          className="w-28 h-28 object-contain"
                        />
                      ) : (
                        <div className="w-28 h-28 flex items-center justify-center text-xs text-slate-400">
                          QR E-Ticket
                        </div>
                      )}
                      <span className="text-[11px] font-black text-[#2A1450] mt-1">
                        QR สแกนรับเสื้อวันงาน
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#6D28D9]">
                        {createdOrder.orderId}
                      </span>
                    </div>
                  </div>

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
                        ตรวจสอบเงินเข้าอัตโนมัติ
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

              {/* ====================================================== */}
              {/* SELECTABLE PRINT FORMATS PANEL (มีให้เลือกแบบ Print)    */}
              {/* ====================================================== */}
              <div className="rounded-3xl border-[3px] border-[#2A1450] bg-white p-4 sm:p-5 shadow-[0_8px_0_#2A1450] space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#6D28D9]" />
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-[#2A1450]">
                        เลือกรูปแบบการพิมพ์บัตร (Print / บันทึก PDF) หรือดาวน์โหลดรูปภาพ
                      </h4>
                      <p className="text-xs font-bold text-[#6B5A85]">
                        คลิกเลือกรูปแบบที่ต้องการเพื่อเปิดหน้าตัวอย่างก่อนสั่งพิมพ์ออกเครื่องปริ้นท์ขนาด A4
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadOfficialBibAsPng(createdOrder)}
                    className="px-3.5 py-2 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#4B2D78] border-2 border-[#2A1450] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลดรูปป้าย BIB (.PNG)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'bib_only' as PrintFormatOption,
                      title: '1. พิมพ์เฉพาะป้ายหมายเลข BIB',
                      sub: 'สำหรับติดเสื้อวิ่ง / เก็บสะสม',
                      badge: 'Official BIB',
                    },
                    {
                      id: 'eticket_pass' as PrintFormatOption,
                      title: '2. พิมพ์บัตร E-Ticket & QR รับเสื้อ',
                      sub: 'แสดง QR สแกนรับเสื้อและเหรียญ',
                      badge: 'E-Ticket Pass',
                    },
                    {
                      id: 'full_a4_receipt' as PrintFormatOption,
                      title: '3. พิมพ์ใบเสร็จ + บัตร + ป้าย BIB (A4)',
                      sub: 'ครบชุดในแผ่นเดียว พร้อมเส้นประตัดใช้งาน',
                      badge: 'แนะนำ · ครบชุด A4',
                    },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setSelectedPrintFormat(fmt.id);
                        setPrintModalTab('print');
                        setPrintModalOpen(true);
                      }}
                      className="group text-left p-3.5 rounded-2xl border-2 border-[#2A1450] bg-[#FAF7FF] hover:bg-[#FFC928] transition-all shadow-[0_4px_0_#2A1450] active:translate-y-0.5 cursor-pointer flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#2A1450] text-[#FFC928] text-[10px] font-extrabold">
                          {fmt.badge}
                        </span>
                        <Printer className="w-4 h-4 text-[#2A1450]" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-[#2A1450]">
                          {fmt.title}
                        </div>
                        <div className="text-[11px] font-bold text-[#4B2D78] group-hover:text-[#2A1450] mt-0.5">
                          {fmt.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPrintFormat('full_a4_receipt');
                    setPrintModalTab('print');
                    setPrintModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FFC928] hover:bg-[#FFD646] text-[#2A1450] font-black text-sm border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 stroke-[2.5]" />
                  <span>เปิดหน้าสั่งพิมพ์ (Print / PDF) ทันที</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onRegistrationSuccess) {
                      onRegistrationSuccess();
                    } else {
                      onClose();
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-extrabold text-sm border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>ไปยังศูนย์นักวิ่ง (Runner Center)</span>
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
                    <span>ดูรายการในระบบแอดมิน</span>
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

              {/* Dedicated Print & Email Preview Modal */}
              <TicketPrintEmailModal
                isOpen={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                profile={createdOrder}
                initialMode={printModalTab}
                initialPrintFormat={selectedPrintFormat}
              />
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
