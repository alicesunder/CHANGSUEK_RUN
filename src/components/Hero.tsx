import React from 'react';
import { Calendar, ChevronRight, MapPin, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { RouteId } from '../types';
import { HeroCountdownTimer } from './HeroCountdownTimer';
import { PawIcon } from './brand/DogDecor';
import { ticketCategories } from '../data/eventData';

interface HeroProps {
  onOpenArtworkModal: () => void;
  onOpenRegisterModal: () => void;
  onSelectDistance: (distance: RouteId) => void;
}

const BEACH = '/images/hero/beach-run.jpg';

const chipBg: Record<RouteId, string> = {
  '5km': 'linear-gradient(160deg,#FFF1B8,#FFFBE6)',
  '10km': 'linear-gradient(160deg,#E7DAFB,#F7F2FF)',
  '1km': 'linear-gradient(160deg,#FFE3D0,#FFF6EE)',
  '3km': 'linear-gradient(160deg,#FFEFD0,#FFFAEF)',
};

const fadeMask: React.CSSProperties = {
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 16%)',
  maskImage:
    'linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 16%)',
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
};

export const Hero: React.FC<HeroProps> = ({
  onOpenArtworkModal,
  onOpenRegisterModal,
  onSelectDistance,
}) => {
  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden text-[#2A1450]"
        style={{
          background: 'linear-gradient(180deg,#78D0F7 0%,#A9E3FA 38%,#D8F1F8 62%,#F7E6B5 100%)',
        }}
      >
        {/* Beach artwork anchored bottom-right, fading into the sky (desktop) */}
        <img
          src={BEACH}
          alt="ช้างม่วง นักวิ่ง และน้องหมาโกลเด้น วิ่งเล่นริมชายหาด"
          className="hidden lg:block absolute bottom-0 right-0 w-[80%] max-w-[1320px] h-auto pointer-events-none select-none"
          style={fadeMask}
          loading="eager"
        />

        {/* Drifting paw prints */}
        {[
          { l: '58%', t: '16%', s: 40, r: -18 },
          { l: '44%', t: '22%', s: 30, r: 14 },
          { l: '88%', t: '12%', s: 36, r: 10 },
          { l: '50%', t: '84%', s: 34, r: -8 },
        ].map((p, i) => (
          <PawIcon
            key={i}
            size={p.s}
            color="#FFFFFF"
            className="absolute opacity-60 animate-bobble pointer-events-none"
            style={{
              left: p.l,
              top: p.t,
              animationDelay: `${i * 0.7}s`,
              filter: 'drop-shadow(0 2px 0 rgba(123,63,198,.25))',
            }}
          />
        ))}

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-8 lg:pb-44 lg:min-h-[800px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[640px] text-center lg:text-left mx-auto lg:mx-0"
          >
            <img
              src="/images/brand/changsuek-run-logo.png"
              alt="CHANGSUEK RUN - เห็นช้างวิ่ง วิ่งตามช้าง"
              className="h-24 sm:h-32 lg:h-36 w-auto object-contain mx-auto lg:mx-0 drop-shadow-lg"
            />

            <h1 className="mt-4 text-[44px] sm:text-6xl lg:text-[72px] font-bold leading-[1.05] tracking-tight">
              วิ่งสนุกไปกับ
              <br />
              <span className="inline-flex items-center gap-3">
                เพื่อนซี้สี่ขา
                <svg viewBox="0 0 120 50" className="w-16 sm:w-24 h-auto -rotate-6 shrink-0" aria-hidden="true">
                  <defs>
                    <linearGradient id="bolt" x1="0" x2="1">
                      <stop offset="0" stopColor="#FFC928" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#FFC928" />
                    </linearGradient>
                  </defs>
                  <path d="M0 30 C 30 26 60 18 118 6 C 92 18 70 26 52 30 C 70 30 86 32 108 40 C 70 38 36 34 0 30 Z" fill="url(#bolt)" />
                </svg>
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg font-medium text-[#3A2166] max-w-[520px] mx-auto lg:mx-0 leading-relaxed">
              งานวิ่งริมหาดชะอำ-หัวหิน พาน้องหมามาวิ่งด้วยกัน หรือจะวิ่งคนเดียวก็สนุกได้เหมือนกัน
            </p>

            {/* Ticket chips */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } } }}
              className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[600px] mx-auto lg:mx-0"
            >
              {ticketCategories.map((t) => (
                <motion.button
                  key={t.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 14 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 16 } },
                  }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  onClick={() => onSelectDistance(t.id)}
                  className="text-left rounded-[20px] px-3.5 py-3 cursor-pointer border border-white/90 shadow-[0_10px_24px_-12px_rgba(75,45,120,.55)] backdrop-blur-sm"
                  style={{ background: chipBg[t.id] }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[28px] font-bold leading-none">{t.distanceLabel}</span>
                    <span className="text-xl" aria-hidden="true">{t.emoji}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#4B2D78] mt-1.5 leading-tight">
                    {t.group === 'dog' ? 'วิ่งคู่น้องหมา' : 'บุคคลทั่วไป'}
                  </div>
                  <div className="font-display text-[19px] font-bold mt-0.5">
                    {t.group === 'dog' ? 'เริ่ม ' : ''}
                    {t.basePrice}.-
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Date + place */}
            <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start text-sm font-semibold">
              <span className="inline-flex items-center gap-2.5 bg-white/90 rounded-full pl-3 pr-5 py-2 shadow-[0_8px_18px_-10px_rgba(75,45,120,.5)]">
                <Calendar className="w-5 h-5 text-[#7B3FC6]" />
                15 ก.พ. 2570
              </span>
              <span className="inline-flex items-center gap-2.5 bg-white/90 rounded-full pl-3 pr-5 py-2 shadow-[0_8px_18px_-10px_rgba(75,45,120,.5)]">
                <MapPin className="w-5 h-5 text-[#7B3FC6]" />
                ค่ายนเรศวร ชะอำ-หัวหิน
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onOpenRegisterModal}
                className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-[#2A1450] transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(180deg,#FFD84D,#FFBE0B)',
                  border: '3px solid #2A1450',
                  boxShadow: '0 6px 0 #2A1450',
                }}
              >
                <PawIcon size={26} color="#2A1450" />
                สมัครวิ่งเลย
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="#distances"
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-lg font-bold bg-white/90 text-[#2A1450] transition-transform hover:scale-105"
                style={{ border: '3px solid #2A1450', boxShadow: '0 6px 0 #2A1450' }}
              >
                ดูราคาบัตรวิ่ง
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Mobile / tablet artwork in flow */}
          <div className="lg:hidden mt-8 -mx-4 sm:-mx-8 relative">
            <img
              src={BEACH}
              alt="ช้างม่วง นักวิ่ง และน้องหมาโกลเด้น วิ่งเล่นริมชายหาด"
              className="w-full h-auto block"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%)',
              }}
            />
          </div>
        </div>

        <button
          onClick={onOpenArtworkModal}
          className="absolute z-20 right-4 sm:right-8 bottom-24 sm:bottom-28 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#2A1450] shadow-md hover:scale-105 transition-transform"
        >
          <Maximize2 className="w-4 h-4" />
          ดูภาพเต็ม
        </button>

        {/* Purple wave with a gold line */}
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-16 sm:h-24 z-10 pointer-events-none"
          aria-hidden="true"
        >
          <path d="M0 62 C 220 10 420 24 640 58 C 860 92 1100 88 1440 20 L1440 110 L0 110 Z" fill="#FFC928" />
          <path d="M0 76 C 220 28 420 40 640 72 C 860 104 1100 102 1440 38 L1440 110 L0 110 Z" fill="#4B1C8C" />
        </svg>
      </section>

      {/* Countdown band continues the purple wave */}
      <div className="bg-[#4B1C8C] pb-8 px-4">
        <div className="max-w-[560px] mx-auto">
          <HeroCountdownTimer targetDate="2027-02-15T06:00:00+07:00" />
        </div>
      </div>
    </>
  );
};
