import React, { useRef } from 'react';
import { Calendar, MapPin, Activity, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { RouteId } from '../types';
import { HeroCountdownTimer } from './HeroCountdownTimer';

interface HeroProps {
  onOpenArtworkModal: () => void;
  onOpenRegisterModal: () => void;
  onSelectDistance: (distance: RouteId) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenArtworkModal,
  onOpenRegisterModal,
  onSelectDistance,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Subtle parallax translation and slight scale for smooth depth
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-24 flex items-center overflow-hidden text-white"
    >
      {/* Hero background with subtle parallax scrolling */}
      <motion.div
        style={{
          y: backgroundY,
          scale: backgroundScale,
        }}
        className="absolute inset-0 -top-12 -bottom-12 h-[calc(100%+6rem)] w-full pointer-events-none"
      >
        <motion.img
          src="/images/hero/changsuek-run-coastal.jpg"
          alt="CHANGSUEK RUN Coastal Sunset Beach"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover object-center select-none"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Open view preserving the Elephant, Runner, and Dog composition in background */}
          <div className="lg:col-span-6 flex flex-col justify-end items-start relative order-2 lg:order-1 min-h-[120px] lg:min-h-[460px]">
            {/* Storytelling Slogan Badge & Modal Opener */}
            <div className="mt-auto backdrop-blur-md bg-black/45 border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
              <div className="flex flex-col text-[10px] sm:text-[11px] font-black tracking-widest text-white leading-tight uppercase">
                <span className="text-[#FFC928]">RUN WITH CHANGSUEK</span>
                <span className="text-white/80">PEOPLE • PETS • A BRIGHTER TOMORROW</span>
              </div>
              <button
                onClick={onOpenArtworkModal}
                className="ml-auto text-[11px] font-bold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                title="ดูภาพขยายเต็มจอ"
              >
                ดูภาพเต็ม
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Official Logo, Slogan, Quick Info, Countdown & CTAs matching mockup */}
          <div className="lg:col-span-6 flex flex-col items-start text-left order-1 lg:order-2">
            
            {/* Official CHANGSUEK RUN Logo as single complete image asset (NO duplicate text) */}
            <div className="mb-4">
              <img
                src="/images/brand/changsuek-run-logo.png"
                alt="CHANGSUEK RUN - เห็นช้างวิ่ง วิ่งตามช้าง"
                className="h-28 sm:h-36 lg:h-44 w-auto object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Handwritten / Script Subtitle: "มากกว่าวิ่ง คือการก้าวไปด้วยกัน" */}
            <p className="text-lg sm:text-2xl font-bold text-[#FFD633] mb-6 tracking-wide drop-shadow-sm font-serif italic">
              “มากกว่าวิ่ง คือการก้าวไปด้วยกัน”
            </p>

            {/* Event Quick Facts Capsule Bar matching mockup */}
            <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                
                {/* 1. Date */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 font-bold uppercase">วันที่จัดงาน</div>
                    <div className="font-extrabold text-white">15 ก.พ. 2569</div>
                  </div>
                </div>

                {/* 2. Venue */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 font-bold uppercase">สถานที่จัดงาน</div>
                    <div className="font-extrabold text-white">ค่ายพระราม 6 จ.เพชรบุรี</div>
                  </div>
                </div>

                {/* 3. Distances */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 flex-shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 font-bold uppercase">ระยะวิ่ง</div>
                    <div className="font-extrabold text-white">5K / 10K / 21K FUN RUN</div>
                  </div>
                </div>

              </div>
            </div>

            {/* REAL-TIME COUNTDOWN TIMER (PURPLE & GOLD BRAND PALETTE) */}
            <HeroCountdownTimer targetDate="2027-02-15T06:00:00+07:00" className="mb-6" />

            {/* CALL TO ACTION BUTTONS: [สมัครวิ่ง] and [ดูรายละเอียดงาน >] */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
              
              {/* Primary Yellow Pill Button */}
              <button
                onClick={onOpenRegisterModal}
                className="bg-[#FFCC00] hover:bg-[#FFD633] text-[#17151C] font-black text-sm sm:text-base px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
              >
                สมัครวิ่ง
              </button>

              {/* Secondary Outlined / Glass Pill Button */}
              <a
                href="#inspiration"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-full border border-white/30 backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>ดูรายละเอียดงาน</span>
                <ChevronRight className="w-4 h-4" />
              </a>

            </div>

            {/* Bottom-right script signature: Run Together a Brighter Tomorrow */}
            <div className="w-full flex justify-end mt-4 pr-4">
              <span className="text-sm sm:text-base font-serif italic text-white/60 tracking-wider">
                Run Together a Brighter Tomorrow
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
