import React from 'react';
import {
  ArrowRight,
  Calendar,
  Camera,
  CircleDollarSign,
  Crown,
  HelpCircle,
  MapPin,
  Mountain,
  Sparkles,
  Store,
  TicketCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { RouteId } from '../types';
import { HeroCountdownTimer } from './HeroCountdownTimer';
import { PawIcon } from './brand/DogDecor';

interface HeroProps {
  onOpenArtworkModal: () => void;
  onOpenRegisterModal: () => void;
  onSelectDistance: (distance: RouteId) => void;
}

const BEACH = '/images/hero/beach-run.jpg';
const COASTAL_SUNSET = '/images/hero/changsuek-run-coastal.jpg';

const fadeMask: React.CSSProperties = {
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, #000 24%), linear-gradient(to bottom, transparent 0%, #000 10%)',
  maskImage:
    'linear-gradient(to right, transparent 0%, #000 24%), linear-gradient(to bottom, transparent 0%, #000 10%)',
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
};

export const Hero: React.FC<HeroProps> = ({
  onOpenArtworkModal,
  onOpenRegisterModal,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickNavItems = [
    {
      label: 'เกณฑ์การสมัคร',
      targetId: 'experience',
      circleBg: '#E6D6FC',
      iconColor: '#5B20A8',
      Icon: TicketCheck,
    },
    {
      label: 'เส้นทางวิ่ง',
      targetId: 'distances',
      circleBg: '#C6F4DC',
      iconColor: '#15803D',
      Icon: Mountain,
    },
    {
      label: 'ค่าธรรมเนียม',
      targetId: 'ticket-pricing',
      circleBg: '#FDE68A',
      iconColor: '#B45309',
      Icon: CircleDollarSign,
    },
    {
      label: 'แผนที่ GPS',
      targetId: 'schedule-and-map',
      circleBg: '#BAE6FD',
      iconColor: '#0369A1',
      Icon: MapPin,
    },
    {
      label: 'ตารางแข่งขัน',
      targetId: 'schedule-and-map',
      circleBg: '#E9D5FF',
      iconColor: '#6D28D9',
      Icon: Calendar,
    },
    {
      label: 'อันดับ & สถิติ',
      targetId: 'leaderboard',
      circleBg: '#FEF08A',
      iconColor: '#A16207',
      Icon: Crown,
    },
    {
      label: 'ที่พักใกล้สนาม',
      targetId: 'hotels',
      circleBg: '#BBF7D0',
      iconColor: '#166534',
      Icon: Camera,
    },
    {
      label: 'ร้านค้า/ของที่ระลึก',
      targetId: 'merch-showcase',
      circleBg: '#DDD6FE',
      iconColor: '#5B21B6',
      Icon: Store,
    },
    {
      label: 'คำถามที่พบบ่อย',
      targetId: 'faq',
      circleBg: '#FDE68A',
      iconColor: '#B45309',
      Icon: HelpCircle,
    },
  ];

  return (
    <>
      {/* ================================================================= */}
      {/* 1. HERO SECTION (RESPONSIVE MOBILE SHOWCASE + DESKTOP MOCKUP)     */}
      {/* ================================================================= */}
      <section
        id="hero"
        className="relative overflow-hidden text-[#2A1450]"
        style={{
          background:
            'linear-gradient(180deg, #7AD0F7 0%, #BCE9FC 34%, #E6F6FA 66%, #FCE5A8 100%)',
        }}
      >
        {/* Ambient Sun Glow for Mobile & Desktop */}
        <div
          aria-hidden="true"
          className="absolute -top-12 right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/45 blur-3xl pointer-events-none"
        />

        {/* Desktop Beach Artwork Anchored Right */}
        <img
          src={BEACH}
          alt="ช้างศึก นักวิ่ง และน้องหมาโกลเด้น วิ่งริมชายหาด"
          className="hidden lg:block absolute bottom-0 right-0 w-[82%] max-w-[1340px] h-auto pointer-events-none select-none"
          style={fadeMask}
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* Desktop Right Script Slogan Overlay ("Run with Your Best Friend") */}
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -6, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden xl:block absolute right-10 top-36 z-10 text-right pointer-events-none select-none"
        >
          <div className="font-display italic font-extrabold text-3xl text-white drop-shadow-[0_3px_6px_rgba(25,55,95,0.45)] leading-none">
            Run
          </div>
          <div className="font-display italic font-bold text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(25,55,95,0.45)] -mt-0.5">
            — with —
          </div>
          <div className="font-display italic font-extrabold text-3xl text-white drop-shadow-[0_3px_6px_rgba(25,55,95,0.45)] leading-tight">
            Your Best
            <br />
            Friend
          </div>
        </motion.div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-8 pt-20 sm:pt-26 lg:pt-28 pb-12 sm:pb-16 lg:pb-28 lg:min-h-[700px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[570px] text-center lg:text-left mx-auto lg:mx-0"
          >
            {/* Brand Logo Lockup */}
            <div className="flex flex-col items-center lg:items-start">
              <img
                src="/images/brand/changsuek-run-logo.png"
                alt="CHANGSUEK RUN - เห็นช้างวิ่ง วิ่งตามช้าง"
                className="h-24 sm:h-28 lg:h-32 w-auto object-contain drop-shadow-[0_6px_12px_rgba(42,20,80,0.18)]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Headline with Animated Paw Accents */}
            <div className="relative inline-block mt-1.5 sm:mt-2">
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [12, 20, 12] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -right-6 sm:-top-3 sm:-right-8 opacity-90 pointer-events-none"
              >
                <PawIcon size={22} color="#8B4FD8" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 4, 0], rotate: [12, 4, 12] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute bottom-1 -right-7 sm:-right-9 opacity-90 pointer-events-none"
              >
                <PawIcon size={20} color="#5B20A8" />
              </motion.div>
              <h1 className="text-[38px] sm:text-6xl lg:text-[64px] font-extrabold leading-[1.06] tracking-tight text-[#33145A] drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
                วิ่งสนุกไปกับ
                <br />
                <span className="text-[#4B1C8C]">เพื่อนสี่ขา</span>
              </h1>
            </div>

            <p className="mt-2.5 sm:mt-3 text-xs sm:text-base font-bold text-[#3A1F5D] max-w-[340px] sm:max-w-[440px] mx-auto lg:mx-0 leading-relaxed">
              งานวิ่งรักษ์ช้างและน้องหมา เพื่อสุขภาพที่ดี
              <br className="hidden sm:inline" />
              และสังคมที่อบอุ่นกว่าเดิม
            </p>

            {/* ============================================================= */}
            {/* MOBILE-ONLY FRAMED ARTWORK CARD (Interactive & Crisp on Phone) */}
            {/* ============================================================= */}
            <div className="lg:hidden mt-4 mb-4 relative mx-auto max-w-[440px]">
              <div
                onClick={onOpenArtworkModal}
                className="group relative rounded-[26px] overflow-hidden border-[3px] border-white shadow-[0_16px_34px_-12px_rgba(42,20,80,0.38)] bg-[#BCE9FC] cursor-pointer"
              >
                <img
                  src={BEACH}
                  alt="ช้างศึก นักวิ่ง และน้องหมาโกลเด้น วิ่งริมชายหาด"
                  className="w-full h-52 sm:h-64 object-cover object-[68%_center] block"
                  referrerPolicy="no-referrer"
                />

                {/* Soft bottom gradient for badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1450]/75 via-transparent to-[#1E3A5F]/15 pointer-events-none" />

                {/* Top-Right Script Badge on Mobile */}
                <div className="absolute top-3 right-3.5 text-right -rotate-6 pointer-events-none">
                  <span className="block font-display italic font-black text-base text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] leading-none">
                    Run with Your
                  </span>
                  <span className="block font-display italic font-black text-lg text-[#FFE28A] drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] leading-tight">
                    Best Friend
                  </span>
                </div>

                {/* Top-Left Event Distance Tag */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold text-[#2A1450] shadow-md">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                  <span>5K · 10K · Dog 1K & 3K</span>
                </div>

                {/* Bottom Overlay Info Bar inside Mobile Hero Card */}
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 border border-white shadow-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#2A1450]">
                    <Calendar className="w-3.5 h-3.5 text-[#5B20A8] shrink-0" />
                    <span>15 ก.พ. 2570</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[#7B3FC6]" />
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#2A1450] truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                    <span className="truncate">หาดชะอำ จ.เพชรบุรี</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Date & Venue Pills */}
            <div className="hidden lg:flex mt-6 flex-wrap gap-2.5 justify-start text-xs sm:text-[13px] font-bold text-[#2A1450]">
              <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs rounded-full px-4 py-1.5 shadow-xs border border-white">
                <Calendar className="w-4 h-4 text-[#5B20A8]" />
                <span>15 ก.พ. 2570</span>
              </span>
              <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs rounded-full px-4 py-1.5 shadow-xs border border-white">
                <MapPin className="w-4 h-4 text-[#5B20A8]" />
                <span>หาดชะอำ จังหวัดเพชรบุรี</span>
              </span>
            </div>

            {/* 2 Action CTA Buttons (Side-by-Side on Mobile & Desktop) */}
            <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 justify-center lg:justify-start max-w-[440px] sm:max-w-none mx-auto lg:mx-0">
              <button
                type="button"
                onClick={onOpenRegisterModal}
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full px-4 sm:px-7 py-3 text-xs sm:text-base font-extrabold text-[#2A1450] bg-gradient-to-b from-[#FFD84D] to-[#F5B800] border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer sm:min-w-[180px]"
              >
                <span className="absolute inset-0 ticket-foil-shimmer opacity-50 pointer-events-none" />
                <PawIcon size={16} color="#2A1450" className="relative z-10" />
                <span className="relative z-10">สมัครวิ่งตอนนี้</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('distances')}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-3 text-xs sm:text-base font-extrabold bg-white/95 hover:bg-white text-[#2A1450] border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer sm:min-w-[180px]"
              >
                <span>ดูรายละเอียดงาน</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Top Wave Curve transitioning into Countdown Banner */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-8 sm:h-14 z-20 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M0 52 C 360 82 920 10 1440 24 L1440 80 L0 80 Z"
            fill="#FFC928"
          />
          <path
            d="M0 60 C 360 88 920 18 1440 32 L1440 80 L0 80 Z"
            fill="#371463"
          />
        </svg>
      </section>

      {/* ================================================================= */}
      {/* 2. CURVED PURPLE COUNTDOWN & SUNSET QUOTE WAVE BANNER             */}
      {/* ================================================================= */}
      <div className="relative bg-gradient-to-r from-[#2D0E52] via-[#3E176E] to-[#32125A] text-white overflow-hidden">
        {/* Sunset Coastal Runner & Dog Background (Visible on both Mobile & Desktop) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[52%] opacity-30 md:opacity-100 pointer-events-none"
          style={{
            backgroundImage: `url(${COASTAL_SUNSET})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 55%',
            WebkitMaskImage:
              'linear-gradient(to left, rgba(0,0,0,0.85) 45%, transparent 100%)',
            maskImage:
              'linear-gradient(to left, rgba(0,0,0,0.85) 45%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-y-0 right-0 w-[52%] bg-gradient-to-r from-[#3A1668] via-[#3A1668]/45 to-amber-900/30 pointer-events-none"
        />

        {/* Decorative Paw Prints */}
        <PawIcon
          size={44}
          color="#FFC928"
          className="absolute left-4 top-4 opacity-20 -rotate-12 pointer-events-none"
        />
        <PawIcon
          size={36}
          color="#FFC928"
          className="absolute right-6 bottom-10 lg:left-20 lg:bottom-8 opacity-20 rotate-12 pointer-events-none"
        />

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-8 py-5 sm:py-8 pb-11 sm:pb-14 grid grid-cols-1 lg:grid-cols-12 items-center gap-5 sm:gap-6">
          {/* Left: Countdown Timer (6 cols) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <HeroCountdownTimer targetDate="2027-02-15T06:00:00+07:00" />
          </div>

          {/* Right: Slanted Inspirational Quote (6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-left lg:pl-8 pt-2 lg:pt-0 border-t border-white/15 lg:border-t-0">
            <div className="inline-block -rotate-1 sm:-rotate-2">
              <p className="font-display text-xl sm:text-4xl font-bold text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)] leading-snug">
                “ มากกว่างานวิ่ง คือ{' '}
                <span className="text-[#FFE28A] block sm:inline">การวิ่งไปด้วยกัน ”</span>
              </p>
              <p className="mt-1 text-[9px] sm:text-xs font-mono font-extrabold tracking-[0.24em] text-[#FFC928] uppercase drop-shadow">
                MORE THAN A RUN · A BIGGER FAMILY
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Wave Curve transitioning into the 9 Quick-Nav Icon Cards */}
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-7 sm:h-12 z-20 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M0 18 C 420 68 980 64 1440 12 L1440 70 L0 70 Z"
            fill="#FFC928"
          />
          <path
            d="M0 28 C 420 74 980 70 1440 22 L1440 70 L0 70 Z"
            fill="#F4ECFF"
          />
        </svg>
      </div>

      {/* ================================================================= */}
      {/* 3. 9 QUICK-NAVIGATION ICON CARDS STRIP MATCHING MOCKUP            */}
      {/* ================================================================= */}
      <div className="bg-gradient-to-b from-[#F4ECFF] via-[#FAF6FF] to-white pt-3 sm:pt-4 pb-6 sm:pb-10 relative z-20">
        <div className="max-w-[1360px] mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3.5">
            {quickNavItems.map(({ label, targetId, circleBg, iconColor, Icon }, idx) => (
              <motion.button
                key={label}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                whileHover={{ y: -6, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection(targetId)}
                className="group relative bg-white rounded-2xl p-2.5 sm:p-3.5 border-2 border-[#2A1450]/15 hover:border-[#2A1450] shadow-[0_8px_18px_-8px_rgba(58,21,100,0.22),0_3px_0_rgba(42,20,80,0.1)] hover:shadow-[0_16px_28px_-10px_rgba(91,32,168,0.35),0_5px_0_#2A1450] flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer overflow-hidden"
              >
                {/* Top subtle color accent bar */}
                <span
                  className="absolute top-0 inset-x-0 h-1 opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ background: iconColor }}
                />
                <span
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 border-2 border-white shadow-sm"
                  style={{ background: circleBg, color: iconColor }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold text-[#2A1450] group-hover:text-[#5B20A8] whitespace-nowrap truncate max-w-full">
                  {label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
