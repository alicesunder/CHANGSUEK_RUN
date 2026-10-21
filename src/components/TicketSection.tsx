import React, { useMemo, useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Droplets,
  Flame,
  Headphones,
  HeartHandshake,
  MapPin,
  Medal,
  Minus,
  Plus,
  QrCode,
  RotateCw,
  ShieldCheck,
  ShoppingCart,
  Shirt,
  Sparkles,
  Ticket,
  Trophy,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';
import { RouteId } from '../types';
import {
  ticketCategories,
  TicketCategory,
  ticketById,
  routesData,
} from '../data/eventData';
import { PawIcon } from './brand/DogDecor';

interface TicketSectionProps {
  selectedRoute: RouteId;
  onSelectRoute: (id: RouteId) => void;
  onOpenRegister: (id?: RouteId, extras?: { people: number; dogs: number }) => void;
  onOpenComparisonModal?: () => void;
}

const BEACH = '/images/hero/beach-run.jpg';

interface CardTheme {
  grad: string;
  headerGrad: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  ringGlow: string;
  badgeBg: string;
  badgeText: string;
  btnGrad: string;
  btnText: string;
  iconColor: string;
  serialCode: string;
  bibPrefix: string;
  waveLabel: string;
  startTime: string;
  cutoff: string;
  elevationText: string;
  waterCount: number;
  art: { size: string; pos: string };
  sub: string;
  burstEmojis: string[];
}

const look: Record<RouteId, CardTheme> = {
  '5km': {
    grad: 'linear-gradient(165deg, #FFFDF5 0%, #FEF3C7 48%, #FDE68A 100%)',
    headerGrad: 'linear-gradient(135deg, #B45309 0%, #F59E0B 48%, #7C3AED 100%)',
    accent: '#F59E0B',
    accentDark: '#92400E',
    accentSoft: '#FEF3C7',
    ringGlow: 'rgba(245, 158, 11, 0.55)',
    badgeBg: '#2A1450',
    badgeText: '#FFD84D',
    btnGrad: 'linear-gradient(135deg, #FFE066 0%, #F59E0B 52%, #D97706 100%)',
    btnText: '#2A1450',
    iconColor: '#D97706',
    serialCode: 'CSR27-IND-05K',
    bibPrefix: '0588',
    waveLabel: 'WAVE B · FUN & MASS RUN',
    startTime: '17.00 น.',
    cutoff: '75 นาที',
    elevationText: 'ทางเรียบ + ชายหาด',
    waterCount: 3,
    art: { size: '280%', pos: '66% 52%' },
    sub: 'สำหรับผู้เริ่มต้น และนักวิ่งทั่วไป',
    burstEmojis: ['👟', '✨', '🏅', '⚡', '🌟', '🎉'],
  },
  '10km': {
    grad: 'linear-gradient(165deg, #FCF8FF 0%, #F3E8FF 48%, #DDD6FE 100%)',
    headerGrad: 'linear-gradient(135deg, #2E1065 0%, #6D28D9 48%, #DB2777 100%)',
    accent: '#7C3AED',
    accentDark: '#4C1D95',
    accentSoft: '#EDE9FE',
    ringGlow: 'rgba(124, 58, 237, 0.55)',
    badgeBg: '#FFC928',
    badgeText: '#2A1450',
    btnGrad: 'linear-gradient(135deg, #9333EA 0%, #6D28D9 52%, #4C1D95 100%)',
    btnText: '#FFFFFF',
    iconColor: '#6D28D9',
    serialCode: 'CSR27-PRO-10K',
    bibPrefix: '1088',
    waveLabel: 'WAVE A · MINI MARATHON',
    startTime: '16.30 น.',
    cutoff: '120 นาที',
    elevationText: 'รอบค่ายนเรศวรครบวง',
    waterCount: 5,
    art: { size: '270%', pos: '28% 50%' },
    sub: 'สำหรับนักวิ่งที่ท้าทายตนเอง',
    burstEmojis: ['🏃', '🔥', '🏆', '⚡', '✨', '💜'],
  },
  '1km': {
    grad: 'linear-gradient(165deg, #FFFBF7 0%, #FFEDD5 48%, #FED7AA 100%)',
    headerGrad: 'linear-gradient(135deg, #C2410C 0%, #F97316 48%, #E11D48 100%)',
    accent: '#F97316',
    accentDark: '#9A3412',
    accentSoft: '#FFEDD5',
    ringGlow: 'rgba(249, 115, 22, 0.55)',
    badgeBg: '#FFFFFF',
    badgeText: '#C2410C',
    btnGrad: 'linear-gradient(135deg, #FB923C 0%, #EA580C 52%, #C2410C 100%)',
    btnText: '#FFFFFF',
    iconColor: '#EA580C',
    serialCode: 'CSR27-DOG-01K',
    bibPrefix: '0188',
    waveLabel: 'WAVE D · DOG MINI BEACH',
    startTime: '17.30 น.',
    cutoff: '45 นาที',
    elevationText: 'เลียบหาดทราย 100%',
    waterCount: 2,
    art: { size: '250%', pos: '92% 62%' },
    sub: 'วิ่งเล่นสนุก ๆ ระยะทางสั้น ๆ กับน้องหมา',
    burstEmojis: ['🐶', '🐾', '🧡', '🦴', '✨', '🎉'],
  },
  '3km': {
    grad: 'linear-gradient(165deg, #F4FFFA 0%, #D1FAE5 48%, #A7F3D0 100%)',
    headerGrad: 'linear-gradient(135deg, #065F46 0%, #10B981 48%, #0284C7 100%)',
    accent: '#10B981',
    accentDark: '#065F46',
    accentSoft: '#D1FAE5',
    ringGlow: 'rgba(16, 185, 129, 0.55)',
    badgeBg: '#FFC928',
    badgeText: '#064E3B',
    btnGrad: 'linear-gradient(135deg, #34D399 0%, #10B981 52%, #047857 100%)',
    btnText: '#FFFFFF',
    iconColor: '#059669',
    serialCode: 'CSR27-DOG-03K',
    bibPrefix: '0388',
    waveLabel: 'WAVE C · DOG BUDDY RUN',
    startTime: '17.15 น.',
    cutoff: '60 นาที',
    elevationText: 'เลียบหาด + ทิวสนร่มรื่น',
    waterCount: 3,
    art: { size: '270%', pos: '96% 60%' },
    sub: 'สนุกได้ไกลกว่า ไปด้วยกันทั้งคนและสุนัข',
    burstEmojis: ['🐕', '🐾', '💚', '🏅', '✨', '🌊'],
  },
};

const BURST_VECTORS = [
  { dx: -68, dy: -62, rot: -28 },
  { dx: 0, dy: -82, rot: 12 },
  { dx: 68, dy: -60, rot: 30 },
  { dx: -82, dy: 4, rot: -35 },
  { dx: 82, dy: 8, rot: 35 },
  { dx: -52, dy: 64, rot: -20 },
  { dx: 54, dy: 64, rot: 22 },
];

const perkList = (isDog: boolean) => [
  {
    Icon: Shirt,
    text: isDog ? 'เสื้อวิ่ง Micro-Dry คน + ผ้าพันคอน้องหมา' : 'เสื้อวิ่งที่ระลึก Micro-Dry Sublimation',
    tag: 'Premium Kit',
  },
  {
    Icon: Medal,
    text: 'เหรียญรางวัล Finisher หล่อนูน 3 มิติ',
    tag: 'Zinc Alloy',
  },
  {
    Icon: Ticket,
    text: isDog ? 'เบอร์วิ่ง BIB คู่ (Runner + Dog Pass)' : 'เบอร์วิ่ง (BIB) พร้อมชิปจับเวลา RFID',
    tag: 'Official BIB',
  },
  {
    Icon: Droplets,
    text: isDog ? 'จุดบริการน้ำดื่ม & ซุ้มของว่างน้องหมา' : 'เครื่องดื่มเกลือแร่ ผลไม้ และอาหารหลังเส้นชัย',
    tag: 'Full Service',
  },
];

const TicketCard: React.FC<{
  t: TicketCategory;
  selected: boolean;
  index: number;
  onSelect: () => void;
  onRegister: () => void;
}> = ({ t, selected, index, onSelect, onRegister }) => {
  const l = look[t.id];
  const isDog = t.group === 'dog';
  const routeInfo = routesData[t.id];
  const [isFlipped, setIsFlipped] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [isPopping, setIsPopping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Interactive 3D tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 22 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCardClick = () => {
    setBurstKey((prev) => prev + 1);
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 160);
    onSelect();
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegister();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        type: 'spring',
        stiffness: 210,
        damping: 20,
        delay: index * 0.08,
      }}
      className="perspective-1200 h-full relative"
    >
      {/* ============================================================ */}
      {/* PLAYFUL CLICK PARTICLE BURST (PAWS, SPARKLES & TROPHIES)     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {burstKey > 0 && (
          <div
            key={burstKey}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-visible"
          >
            {BURST_VECTORS.map((vec, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: vec.dx,
                  y: vec.dy,
                  scale: [0.5, 1.35, 0.9],
                  rotate: vec.rot,
                }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', duration: 0.65, ease: 'easeOut' }}
                className="absolute text-2xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] select-none"
              >
                {l.burstEmojis[i % l.burstEmojis.length]}
              </motion.span>
            ))}

            {/* Expanding Shockwave Ring on Click */}
            <motion.span
              initial={{ opacity: 0.75, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.35 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="w-44 h-44 rounded-full border-4 pointer-events-none"
              style={{ borderColor: l.accent }}
            />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
        }}
        animate={{
          scale: isPopping ? 0.95 : selected ? 1.02 : 1,
          rotateZ: isPopping ? -1.8 : 0,
          y: isPopping ? -2 : selected ? -8 : 0,
        }}
        whileHover={{ y: -10, scale: 1.025 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
        onClick={handleCardClick}
        className="relative h-full w-full preserve-3d cursor-pointer select-none group"
      >
        {/* ============================================================ */}
        {/* FRONT OF RUNNING PASS (COLLECTIBLE PERFORATED RACE TICKET)   */}
        {/* ============================================================ */}
        <article
          className="relative flex flex-col h-full rounded-[32px] overflow-hidden backface-hidden transition-all duration-300"
          style={{
            background: l.grad,
            border: selected ? `3.5px solid #2A1450` : '3px solid #2A1450',
            boxShadow: selected
              ? `0 24px 48px -10px ${l.ringGlow}, 0 0 0 3px ${l.accent}, 0 9px 0 #2A1450`
              : '0 16px 32px -14px rgba(42, 20, 80, 0.32), 0 6px 0 #2A1450',
          }}
        >
          {/* Animated Holographic Sheen Sweep on Hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <div className="absolute -inset-y-12 w-32 bg-gradient-to-r from-transparent via-white/65 to-transparent animate-ticket-shimmer" />
          </div>

          {/* Interactive Pointer Glare */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-45 transition-opacity duration-300"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.9) 0%, transparent 60%)`
              ),
            }}
          />

          {/* 1. TOP TICKET STUB HEADER WITH FULL-COLOR ARTWORK & FLOATING MASCOT */}
          <div
            className="relative px-5 pt-4 pb-5 text-white overflow-hidden border-b-2 border-[#2A1450]"
            style={{ background: l.headerGrad }}
          >
            {/* Vivid Coastal Artwork Backdrop inside Header */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url(${BEACH})`,
                backgroundSize: l.art.size,
                backgroundPosition: l.art.pos,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none"
            />

            {/* Decorative Subtle Paw Watermark */}
            <PawIcon
              size={72}
              color="#FFFFFF"
              className="absolute -right-3 -bottom-4 opacity-10 rotate-12 pointer-events-none"
            />

            {/* Top Row: Pass Category & Flip BIB Preview Trigger */}
            <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-[#2A1450]/30"
                  style={{ background: l.badgeBg, color: l.badgeText }}
                >
                  {isDog ? (
                    <>
                      <PawIcon size={11} color="currentColor" />
                      <span>DOG RUN PASS</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 fill-current" />
                      <span>RUNNER PASS</span>
                    </>
                  )}
                </span>

                {t.badge && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFC928] text-[#2A1450] border border-[#2A1450] shadow-2xs animate-bounce-subtle">
                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                    {t.badge}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-black/35 hover:bg-[#FFC928] text-white hover:text-[#2A1450] backdrop-blur-md px-2.5 py-1 rounded-full border border-white/40 hover:border-[#2A1450] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="พลิกดูตัวอย่างป้ายหมายเลขวิ่ง (BIB)"
              >
                <RotateCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-500" />
                <span>พลิกดู BIB</span>
              </button>
            </div>

            {/* Distance Hero Lockup + Floating Mascot Medallion */}
            <div className="relative z-10 flex items-end justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono font-extrabold tracking-[0.18em] text-[#FFE28A] uppercase drop-shadow-xs">
                  {l.waveLabel}
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <motion.span
                    key={selected ? 'sel' : 'idle'}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 14 }}
                    className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight text-white drop-shadow-[0_4px_0_rgba(23,21,28,0.5)]"
                  >
                    {t.distanceLabel}
                  </motion.span>
                  <span className="text-[11px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-black/40 text-[#FFD84D] border border-white/25">
                    #{l.bibPrefix}
                  </span>
                </div>
                <h4 className="mt-1.5 text-base sm:text-lg font-extrabold text-white leading-snug drop-shadow-xs">
                  {t.name}
                </h4>
              </div>

              {/* Floating Emoji Medallion that Bounces on Selection/Hover */}
              <motion.div
                animate={
                  selected || isPopping
                    ? {
                        y: [0, -8, 0],
                        rotate: [0, -12, 12, 0],
                        scale: [1, 1.18, 1],
                      }
                    : { y: 0, rotate: 0, scale: 1 }
                }
                transition={{ type: 'tween', duration: 0.55, ease: 'easeOut' }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/95 border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform"
              >
                {t.emoji}
              </motion.div>
            </div>
          </div>

          {/* 2. TELEMETRY MINI BAR (START TIME · CUTOFF · WATER STATIONS) */}
          <div className="grid grid-cols-3 divide-x divide-[#2A1450]/15 bg-white/90 backdrop-blur-xs border-b-2 border-[#2A1450]/15 text-center py-2.5 px-1">
            <div className="px-1">
              <div className="text-[10px] font-extrabold text-[#6B5A85] flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" style={{ color: l.iconColor }} />
                <span>ปล่อยตัว</span>
              </div>
              <div className="text-xs font-black text-[#2A1450] tabular-nums mt-0.5">
                {l.startTime}
              </div>
            </div>
            <div className="px-1">
              <div className="text-[10px] font-extrabold text-[#6B5A85] flex items-center justify-center gap-1">
                <Flame className="w-3 h-3" style={{ color: l.iconColor }} />
                <span>Cut-off</span>
              </div>
              <div className="text-xs font-black text-[#2A1450] tabular-nums mt-0.5">
                {l.cutoff}
              </div>
            </div>
            <div className="px-1">
              <div className="text-[10px] font-extrabold text-[#6B5A85] flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3" style={{ color: l.iconColor }} />
                <span>จุดน้ำดื่ม</span>
              </div>
              <div className="text-xs font-black text-[#2A1450] tabular-nums mt-0.5">
                {l.waterCount} จุด
              </div>
            </div>
          </div>

          {/* 3. MAIN TICKET BODY: SUBTITLE, RUBBER STAMP & PERKS */}
          <div className="p-5 pb-3 flex-1 flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-xs font-extrabold text-[#2A1450]/85 leading-relaxed">
                  {l.sub}
                </p>
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.span
                      key="selected-stamp"
                      initial={{ scale: 1.8, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: -3, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 15 }}
                      className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-[#2A1450] text-[#FFC928] border-2 border-[#FFC928] shadow-sm shrink-0"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>เลือกแล้ว!</span>
                    </motion.span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-[#6B5A85] bg-white/70 px-2 py-0.5 rounded-full border border-[#2A1450]/15 shrink-0">
                      คลิกเพื่อเลือก
                    </span>
                  )}
                </AnimatePresence>
              </div>

              {/* Included Race Pack Items */}
              <ul className="space-y-2 text-xs sm:text-[13px] font-bold text-[#2A1450]">
                {perkList(isDog).map(({ Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-2.5 bg-white/90 hover:bg-white rounded-xl px-2.5 py-2 border border-[#2A1450]/10 shadow-2xs transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-[#2A1450]/15"
                      style={{ background: l.accentSoft, color: l.iconColor }}
                    >
                      <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="leading-snug flex-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extra Add-on Note for Dog Run Cards */}
            {isDog && (
              <div className="mt-3 px-3 py-2 rounded-xl bg-white/85 border-2 border-dashed border-[#2A1450]/25 flex items-center justify-between text-[11px] font-extrabold text-[#2A1450]">
                <span>เพิ่มคน / น้องหมาได้:</span>
                <span className="tabular-nums" style={{ color: l.accentDark }}>
                  +{t.addPersonPrice}฿/คน · +{t.addDogPrice}฿/ตัว
                </span>
              </div>
            )}
          </div>

          {/* 4. AUTHENTIC PERFORATED TICKET DIVIDER */}
          <div className="relative flex items-center justify-between my-1 px-3" aria-hidden="true">
            {/* Left Semi-Circle Cutout Notch */}
            <div className="-ml-6 w-6 h-6 rounded-full bg-[#FAF7FF] border-r-[3px] border-[#2A1450] shrink-0 shadow-inner" />
            <div className="w-full border-t-2 border-dashed border-[#2A1450]/35 mx-2" />
            <span
              className="text-[9px] font-mono font-black tracking-widest uppercase shrink-0 px-2.5 py-0.5 rounded-full border border-[#2A1450]/25 shadow-2xs flex items-center gap-1"
              style={{ background: l.accentSoft, color: l.accentDark }}
            >
              <Ticket className="w-2.5 h-2.5" />
              <span>{l.serialCode}</span>
            </span>
            <div className="w-full border-t-2 border-dashed border-[#2A1450]/35 mx-2" />
            {/* Right Semi-Circle Cutout Notch */}
            <div className="-mr-6 w-6 h-6 rounded-full bg-[#FAF7FF] border-l-[3px] border-[#2A1450] shrink-0 shadow-inner" />
          </div>

          {/* 5. BOTTOM TICKET STUB: PRICE & ACTION CTA */}
          <div className="p-5 pt-3 bg-white/90 backdrop-blur-xs relative z-10">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#6B5A85]">
                  ราคาบัตรวิ่ง / {t.baseLabel}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#2A1450] tabular-nums leading-none">
                    {t.basePrice.toLocaleString('th-TH')}
                  </span>
                  <span className="text-xs font-extrabold text-[#2A1450]">บาท</span>
                </div>
              </div>

              {/* Mini Barcode Visual */}
              <div className="text-right" aria-hidden="true">
                <div className="inline-flex items-end gap-[2px] h-6 opacity-75">
                  {[2, 4, 1.5, 3, 1.5, 4, 2, 1.5, 3.5, 2, 4, 1.5].map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-[#2A1450] rounded-full inline-block"
                      style={{
                        width: `${w}px`,
                        height: idx % 3 === 0 ? '100%' : '78%',
                      }}
                    />
                  ))}
                </div>
                <span className="block text-[8px] font-mono font-black text-[#2A1450] tracking-widest">
                  ADMIT ONE
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleRegisterClick}
              className="relative overflow-hidden w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 font-extrabold text-sm sm:text-[15px] border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] hover:shadow-[0_6px_0_#2A1450] active:translate-y-1 active:shadow-[0_1px_0_#2A1450] transition-all cursor-pointer"
              style={{
                background: l.btnGrad,
                color: l.btnText,
              }}
            >
              <Ticket className="w-4 h-4 shrink-0" />
              <span>สมัครวิ่งระยะ {t.distanceLabel}</span>
              <ArrowRight className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </article>

        {/* ============================================================ */}
        {/* BACK OF RUNNING PASS (3D FLIP: OFFICIAL BIB & ROUTE PREVIEW) */}
        {/* ============================================================ */}
        <article
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
          }}
          style={{
            transform: 'rotateY(180deg)',
            background: l.grad,
            border: `3.5px solid #2A1450`,
            boxShadow: '0 20px 40px -12px rgba(42, 20, 80, 0.45), 0 8px 0 #2A1450',
          }}
          className="absolute inset-0 rounded-[32px] overflow-hidden backface-hidden flex flex-col justify-between p-5"
        >
          {/* 4 Classic Marathon BIB Pin Holes */}
          <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2A1450]" />
          <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2A1450]" />
          <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2A1450]" />
          <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2A1450]" />

          {/* Back Top Header */}
          <div className="pt-2">
            <div className="flex items-center justify-between border-b-2 border-[#2A1450] pb-2.5">
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-widest block"
                  style={{ color: l.accentDark }}
                >
                  OFFICIAL BIB PREVIEW
                </span>
                <span className="text-xs font-extrabold text-[#2A1450]">
                  ตัวอย่างป้ายเบอร์วิ่ง {t.distanceLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#2A1450] text-white hover:bg-[#5B20A8] transition-colors cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>พลิกกลับ</span>
              </button>
            </div>

            {/* Simulated BIB Number Box */}
            <div
              className="mt-4 rounded-2xl p-4 text-center border-2 border-[#2A1450] shadow-[4px_4px_0_#2A1450] relative overflow-hidden text-white"
              style={{ background: l.headerGrad }}
            >
              <div className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block border border-white/30 bg-black/30 text-[#FFE28A]">
                {l.waveLabel}
              </div>
              <div className="font-display text-5xl font-black tracking-wider text-white my-1.5 tabular-nums drop-shadow">
                {l.bibPrefix}
              </div>
              <div className="text-xs font-extrabold text-white/90 truncate">
                YOUR NAME HERE · {t.distanceLabel}
              </div>
            </div>

            {/* Route & Telemetry Specs */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#2A1450]/15 flex items-center justify-between">
                <span className="font-bold text-[#6B5A85]">ลักษณะเส้นทาง:</span>
                <span className="font-extrabold text-[#2A1450]">{l.elevationText}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#2A1450]/15 flex items-center justify-between">
                <span className="font-bold text-[#6B5A85]">ความยาก:</span>
                <span className="font-extrabold text-[#2A1450]">{routeInfo.difficulty}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#2A1450]/15 flex items-center justify-between">
                <span className="font-bold text-[#6B5A85]">เวลาปล่อยตัว / Cut-off:</span>
                <span className="font-extrabold tabular-nums" style={{ color: l.accentDark }}>
                  {l.startTime} ({l.cutoff})
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#2A1450]/15 flex items-center justify-between">
                <span className="font-bold text-[#4B2D78]">ระบบชิปจับเวลา:</span>
                <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> RFID Timing Pass
                </span>
              </div>
            </div>
          </div>

          {/* Bottom CTA on Back */}
          <div className="pt-3 border-t border-dashed border-[#2A1450]/25">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRegister();
              }}
              className="w-full rounded-2xl py-3 px-4 flex items-center justify-center gap-2 font-extrabold text-sm border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] cursor-pointer"
              style={{ background: l.btnGrad, color: l.btnText }}
            >
              <PawIcon size={16} color="currentColor" />
              <span>จองหมายเลข BIB ระยะ {t.distanceLabel}</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </article>
      </motion.div>
    </motion.div>
  );
};

/** Calculator state: one registration at a time (1 KM or 3 KM). */
type Dist = '1km' | '3km';
type Counts = Record<Dist, { base: number; people: number; dogs: number }>;
const emptyCounts: Counts = {
  '1km': { base: 1, people: 0, dogs: 0 },
  '3km': { base: 0, people: 0, dogs: 0 },
};

const Qty: React.FC<{
  value: number;
  onChange: (n: number) => void;
  max: number;
  label: string;
}> = ({ value, onChange, max, label }) => (
  <div className="flex items-center rounded-full bg-[#F3EEFB] border-2 border-[#2A1450]/20 overflow-hidden shadow-2xs">
    <button
      type="button"
      aria-label={`ลด ${label}`}
      disabled={value <= 0}
      onClick={() => onChange(value - 1)}
      className="w-8 h-8 flex items-center justify-center text-[#2A1450] disabled:opacity-30 hover:bg-[#E2D4FA] active:scale-90 transition cursor-pointer"
    >
      <Minus className="w-4 h-4 stroke-[2.5]" />
    </button>
    <span className="w-7 text-center text-sm font-extrabold text-[#2A1450] tabular-nums">
      {value}
    </span>
    <button
      type="button"
      aria-label={`เพิ่ม ${label}`}
      disabled={value >= max}
      onClick={() => onChange(value + 1)}
      className="w-8 h-8 flex items-center justify-center text-[#2A1450] disabled:opacity-30 hover:bg-[#FFC928] active:scale-90 transition cursor-pointer"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
    </button>
  </div>
);

export const TicketSection: React.FC<TicketSectionProps> = ({
  selectedRoute,
  onSelectRoute,
  onOpenRegister,
  onOpenComparisonModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'individual' | 'dog'>('all');
  const [counts, setCounts] = useState<Counts>(emptyCounts);

  const individual = ticketCategories.filter((t) => t.group === 'individual');
  const dog = ticketCategories.filter((t) => t.group === 'dog');

  const rows = [
    { label: '5 กม. บุคคลทั่วไป (Fun & Mass Run)', badge: '5K', price: '690 บาท', note: 'ต่อ 1 คน' },
    { label: '10 กม. บุคคลทั่วไป (Mini Marathon)', badge: '10K', price: '890 บาท', note: 'ต่อ 1 คน' },
    { label: 'Dog Run 1 กม. (แพ็กเกจคู่ 1 คน + 1 น้องหมา)', badge: '1K DOG', price: '790 บาท', note: 'แพ็กเกจหลัก' },
    { label: 'Dog Run 3 กม. (แพ็กเกจคู่ 1 คน + 1 น้องหมา)', badge: '3K DOG', price: '890 บาท', note: 'แพ็กเกจหลัก' },
    { label: 'Dog Run 1 กม. เพิ่มผู้ร่วมวิ่ง', badge: '+คน', price: '+450 บาท', note: 'ต่อ 1 คน' },
    { label: 'Dog Run 1 กม. เพิ่มสุนัข', badge: '+หมา', price: '+250 บาท', note: 'ต่อ 1 ตัว' },
    { label: 'Dog Run 3 กม. เพิ่มผู้ร่วมวิ่ง', badge: '+คน', price: '+500 บาท', note: 'ต่อ 1 คน' },
    { label: 'Dog Run 3 กม. เพิ่มสุนัข', badge: '+หมา', price: '+300 บาท', note: 'ต่อ 1 ตัว' },
  ];

  const update = (d: Dist, field: 'base' | 'people' | 'dogs', value: number) => {
    const other: Dist = d === '1km' ? '3km' : '1km';
    setCounts((c) => {
      const cur = { ...c[d], [field]: value };
      if (field === 'base' && value === 0) {
        cur.people = 0;
        cur.dogs = 0;
      }
      if (field !== 'base' && value > 0) cur.base = 1;
      return { [d]: cur, [other]: { base: 0, people: 0, dogs: 0 } } as Counts;
    });
  };

  const calc = useMemo(() => {
    const active: Dist = counts['3km'].base > 0 ? '3km' : '1km';
    const c = counts[active];
    const t = ticketById(active);
    const total =
      c.base * t.basePrice +
      c.people * (t.addPersonPrice ?? 0) +
      c.dogs * (t.addDogPrice ?? 0);
    return {
      active,
      total,
      c,
      totalPeople: c.base > 0 ? 1 + c.people : 0,
      totalDogs: c.base > 0 ? 1 + c.dogs : 0,
    };
  }, [counts]);

  const calcRows: {
    d: Dist;
    field: 'base' | 'people' | 'dogs';
    label: string;
    price: number;
    max: number;
    Icon: any;
    color: string;
  }[] = [];

  (['1km', '3km'] as Dist[]).forEach((d) => {
    const t = ticketById(d);
    const km = d === '1km' ? '1' : '3';
    calcRows.push(
      {
        d,
        field: 'base',
        label: `Dog ${km} กม. (1 คน + 1 น้องหมา)`,
        price: t.basePrice,
        max: 1,
        Icon: PawIcon,
        color: '#E59A00',
      },
      {
        d,
        field: 'people',
        label: `Dog ${km} กม. เพิ่มคน`,
        price: t.addPersonPrice ?? 0,
        max: 9,
        Icon: UserPlus,
        color: '#6D2FC4',
      },
      {
        d,
        field: 'dogs',
        label: `Dog ${km} กม. เพิ่มสุนัข`,
        price: t.addDogPrice ?? 0,
        max: 9,
        Icon: PawIcon,
        color: '#F2762A',
      }
    );
  });

  return (
    <div>
      {/* ---------- 1. EVENT CATEGORY HEADER MATCHING MOCKUP ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-7"
      >
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EFE6FD] border border-[#D8C2F8] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
            <PawIcon size={26} color="#7B3FC6" />
          </span>
          <div>
            <span className="block text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-[#7B3FC6]">
              EVENT CATEGORY
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#2A1450] leading-tight">
              เลือกระยะวิ่งของคุณ
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6B5A85] mt-0.5">
              วิ่งได้ทุกสไตล์ จะมากับเพื่อน หรือ มากับน้องหมา ก็สนุกได้เหมือนกัน (พลิกบัตรเพื่อดูตัวอย่างป้าย BIB ได้ทุกใบ)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Interactive Category Filter Segmented Control */}
          <div
            role="tablist"
            aria-label="กรองประเภทบัตรวิ่ง"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-white border-2 border-[#2A1450]/20 shadow-xs"
          >
            {[
              { id: 'all', label: 'ทั้งหมด (4 ระยะ)' },
              { id: 'individual', label: 'วิ่งบุคคล (5K/10K)' },
              { id: 'dog', label: 'วิ่งคู่น้องหมา (1K/3K)' },
            ].map((tab) => {
              const active = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilterTab(tab.id as 'all' | 'individual' | 'dog')}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                    active ? 'text-[#2A1450]' : 'text-[#6B5A85] hover:text-[#2A1450]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="ticketFilterPill"
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      className="absolute inset-0 rounded-full bg-[#FFC928] border border-[#2A1450]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {onOpenComparisonModal && (
            <button
              type="button"
              onClick={onOpenComparisonModal}
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#FAF7FF] text-[#2A1450] border-2 border-[#2A1450] px-5 py-2 text-xs sm:text-sm font-extrabold shadow-2xs transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <span>เปรียบเทียบระยะวิ่งทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* ---------- 2. COLLECTIBLE 3D TICKET PASSES GRID (4-CARD ROW) ---------- */}
      <AnimatePresence mode="wait">
        {filterTab === 'all' ? (
          <motion.div
            key="all-4-cards"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-9"
          >
            {ticketCategories.map((t, i) => (
              <TicketCard
                key={t.id}
                t={t}
                index={i}
                selected={selectedRoute === t.id}
                onSelect={() => onSelectRoute(t.id)}
                onRegister={() => onOpenRegister(t.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={filterTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-9"
          >
            {(filterTab === 'individual' ? individual : dog).map((t, i) => (
              <TicketCard
                key={t.id}
                t={t}
                index={i}
                selected={selectedRoute === t.id}
                onSelect={() => onSelectRoute(t.id)}
                onRegister={() => onOpenRegister(t.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- 3. PRICE TABLE + INTERACTIVE LIVE PASS BUILDER ---------- */}
      <div id="ticket-pricing" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-7 scroll-mt-24">
        {/* Left: Complete Price Breakdown Table (5 cols) */}
        <div className="lg:col-span-5 rounded-[30px] overflow-hidden bg-white border-[3px] border-[#2A1450] shadow-[0_14px_34px_-16px_rgba(75,45,120,0.4),0_6px_0_#2A1450] flex flex-col">
          <div
            className="px-6 py-4 text-white border-b-[3px] border-[#2A1450]"
            style={{ background: 'linear-gradient(135deg,#6D2FC4,#4B1C8C)' }}
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5 text-[#FFC928]" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  ตารางราคาบัตรวิ่งทั้งหมด
                </h3>
                <p className="text-xs text-white/80">
                  อัตราค่าสมัครอย่างเป็นทางการ รวมเสื้อวิ่ง เหรียญ และ BIB
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#EFE7FA] flex-1 flex flex-col justify-between">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`px-5 py-3 flex items-center justify-between gap-2 ${
                  i % 2 ? 'bg-[#FAF7FF]' : 'bg-white'
                } hover:bg-[#F3ECFF] transition-colors`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#EFE7FA] text-[#5B20A8] shrink-0">
                    {r.badge}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#2A1450] truncate">
                    {r.label}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#2A1450] tabular-nums">
                    {r.price}
                  </span>
                  <span className="block text-[10px] font-semibold text-[#6B5A85]">
                    {r.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Dog Run Pass Builder & Live Ticket Preview (7 cols) */}
        <div className="lg:col-span-7 rounded-[30px] overflow-hidden bg-white border-[3px] border-[#2A1450] shadow-[0_14px_34px_-16px_rgba(75,45,120,0.4),0_6px_0_#2A1450] flex flex-col justify-between">
          <div className="px-6 py-4 bg-gradient-to-r from-[#FFF6D6] via-[#F3EEFB] to-[#E2F8EC] border-b-[3px] border-[#2A1450] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#FFC928] border-2 border-[#2A1450] flex items-center justify-center shrink-0 shadow-[2px_2px_0_#2A1450]">
                <ShoppingCart className="w-5 h-5 text-[#2A1450]" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2A1450] leading-tight">
                  จำลองแพ็กเกจบัตรวิ่ง Dog Run & คำนวณราคา
                </h3>
                <p className="text-xs font-semibold text-[#6B5A85]">
                  ปรับจำนวนคนและน้องหมา เพื่อดูตัวอย่างบัตรกลุ่มของคุณแบบเรียลไทม์
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center flex-1">
            {/* Stepper Controls (7 of 12 cols) */}
            <ul className="md:col-span-7 divide-y divide-[#F1EAFB]">
              {calcRows.map((r) => {
                const isSelectedDist = calc.active === r.d;
                return (
                  <li
                    key={r.d + r.field}
                    className={`flex items-center gap-2.5 py-2.5 px-2 rounded-xl transition-colors ${
                      isSelectedDist ? 'bg-[#FAF7FF]' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-lg bg-white border border-[#E2D6F5] flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ color: r.color }}
                    >
                      <r.Icon
                        {...(r.Icon === PawIcon
                          ? { size: 15, color: r.color }
                          : { className: 'w-4 h-4' })}
                      />
                    </span>
                    <span className="flex-1 text-xs sm:text-[13px] font-bold text-[#2A1450] leading-tight">
                      {r.label}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#2A1450] w-14 text-right tabular-nums">
                      {r.price.toLocaleString('th-TH')}.-
                    </span>
                    <Qty
                      value={counts[r.d][r.field]}
                      max={r.max}
                      label={r.label}
                      onChange={(n) => update(r.d, r.field, n)}
                    />
                  </li>
                );
              })}
            </ul>

            {/* Live Animated Mini Ticket Stub Preview (5 of 12 cols) */}
            <div className="md:col-span-5">
              <motion.div
                key={`${calc.active}-${calc.totalPeople}-${calc.totalDogs}`}
                initial={{ scale: 0.96, opacity: 0.85 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="rounded-3xl p-4 border-[3px] border-[#2A1450] shadow-[4px_5px_0_#2A1450] relative overflow-hidden"
                style={{
                  background: look[calc.active].grad,
                }}
              >
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#2A1450]/25 pb-2 mb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2A1450]">
                    LIVE GROUP PASS
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#2A1450] text-[#FFC928]">
                    {calc.active.toUpperCase()} DOG RUN
                  </span>
                </div>

                {/* Animated Participant Icons */}
                <div className="my-2.5">
                  <div className="text-[11px] font-bold text-[#4B2D78] mb-1.5">
                    ผู้เข้าร่วมในบัตรนี้ ({calc.totalPeople} คน + {calc.totalDogs} น้องหมา):
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[34px] p-2 rounded-2xl bg-white/80 border border-[#2A1450]/15">
                    {Array.from({ length: Math.min(calc.totalPeople, 6) }).map((_, idx) => (
                      <motion.span
                        key={`p-${idx}`}
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-6 h-6 rounded-full bg-[#6D2FC4] text-white flex items-center justify-center text-[11px] font-bold shadow-2xs"
                        title="นักวิ่ง"
                      >
                        🏃
                      </motion.span>
                    ))}
                    {calc.totalPeople > 6 && (
                      <span className="text-[11px] font-extrabold text-[#6D2FC4]">
                        +{calc.totalPeople - 6}
                      </span>
                    )}
                    <span className="text-xs font-black text-[#2A1450]/40 mx-0.5">+</span>
                    {Array.from({ length: Math.min(calc.totalDogs, 6) }).map((_, idx) => (
                      <motion.span
                        key={`d-${idx}`}
                        initial={{ scale: 0, rotate: 15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-6 h-6 rounded-full bg-[#FF8A3D] text-white flex items-center justify-center text-[11px] font-bold shadow-2xs"
                        title="น้องหมา"
                      >
                        🐶
                      </motion.span>
                    ))}
                    {calc.totalDogs > 6 && (
                      <span className="text-[11px] font-extrabold text-[#EA580C]">
                        +{calc.totalDogs - 6}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-dashed border-[#2A1450]/25 flex items-baseline justify-between">
                  <span className="text-xs font-extrabold text-[#2A1450]">ยอดรวมสุทธิ</span>
                  <div className="text-right">
                    <span className="font-display text-2xl sm:text-3xl font-black text-[#2A1450] tabular-nums">
                      {calc.total.toLocaleString('th-TH')}
                    </span>
                    <span className="text-xs font-extrabold text-[#2A1450] ml-1">บาท</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenRegister(calc.active, {
                      people: calc.c.people,
                      dogs: calc.c.dogs,
                    })
                  }
                  className="mt-3 w-full rounded-2xl py-2.5 px-4 flex items-center justify-center gap-1.5 text-white font-extrabold text-xs sm:text-sm border-2 border-[#2A1450] shadow-[0_3px_0_#2A1450] hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg,#8B4FD8,#5B20A8)',
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>สมัครแพ็กเกจนี้เลย</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- 4. TRUST & SUPPORT FOOTER STRIP ---------- */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { Icon: Calendar, text: 'เปลี่ยนประเภท/ระยะทางได้ภายหลัง' },
          { Icon: ShieldCheck, text: 'ชำระเงินปลอดภัย รับ Digital BIB ทันที' },
          { Icon: Headphones, text: 'ทีมงานดูแลตลอดการแข่งขัน' },
        ].map(({ Icon, text }) => (
          <span
            key={text}
            className="inline-flex items-center gap-2.5 bg-white rounded-full pl-2.5 pr-5 py-2 text-xs sm:text-sm font-bold text-[#2A1450] shadow-[0_8px_20px_-10px_rgba(75,45,120,0.4)] border-2 border-[#2A1450]/15"
          >
            <span className="w-7 h-7 rounded-full bg-[#F3EEFB] text-[#6D2FC4] flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
