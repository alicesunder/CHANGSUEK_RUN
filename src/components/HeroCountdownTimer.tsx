import React, { useState, useEffect } from 'react';
import { Timer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SocialShare } from './SocialShare';

interface CountdownTimerProps {
  targetDate?: string;
  className?: string;
  showSocialShare?: boolean;
}

export const HeroCountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = '2027-02-15T06:00:00+07:00',
  className = '',
  showSocialShare = true,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const destination = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const padNumber = (num: number) => num.toString().padStart(2, '0');

  const timeUnits = [
    { value: padNumber(timeLeft.days), label: 'DAYS', thaiLabel: 'วัน' },
    { value: padNumber(timeLeft.hours), label: 'HOURS', thaiLabel: 'ชั่วโมง' },
    { value: padNumber(timeLeft.minutes), label: 'MINUTES', thaiLabel: 'นาที' },
    { value: padNumber(timeLeft.seconds), label: 'SECONDS', thaiLabel: 'วินาที' },
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Eyebrow Label */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFD633]/20 text-[#FFD633]">
          <Timer className="w-3.5 h-3.5" />
        </span>
        <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#FFD633] uppercase">
          นับถอยหลังสู่วันแข่งขัน • RACE DAY COUNTDOWN
        </span>
        <Sparkles className="w-3 h-3 text-[#FFC928] animate-pulse" />
      </div>

      {/* Grid of countdown boxes matching brand's purple and gold palette */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
        {timeUnits.map((unit, index) => {
          const isSeconds = index === 3;
          return (
            <div
              key={unit.label}
              className={`relative overflow-hidden rounded-2xl p-2 sm:p-3 text-center transition-transform hover:-translate-y-0.5 select-none ${
                isSeconds
                  ? 'bg-gradient-to-b from-[#2E1053] to-[#1E0938] border-2 border-[#FFC928] shadow-[0_4px_20px_rgba(255,201,40,0.25)]'
                  : 'bg-gradient-to-b from-[#2A0E4E]/90 to-[#18062F]/95 border border-[#6B28B8]/60 shadow-[0_4px_16px_rgba(42,14,78,0.35)] backdrop-blur-md'
              }`}
            >
              {/* Subtle gold top rim light */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFC928]/40 to-transparent" />

              {/* Number display container with fixed height & overflow-hidden for seamless flip/pulse */}
              <div className="relative h-8 sm:h-10 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={unit.value}
                    initial={{
                      y: -14,
                      opacity: 0.35,
                      rotateX: -45,
                      scale: 0.92,
                      filter: 'blur(1px)',
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      rotateX: 0,
                      scale: [1, 1.07, 1],
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      y: 14,
                      opacity: 0,
                      rotateX: 45,
                      scale: 0.9,
                      filter: 'blur(1px)',
                    }}
                    transition={{
                      duration: 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`block text-2xl sm:text-4xl font-black font-mono leading-none tracking-tight transform-gpu ${
                      isSeconds ? 'text-[#FFD633] drop-shadow-[0_0_8px_rgba(255,214,51,0.4)]' : 'text-white'
                    }`}
                  >
                    {unit.value}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Unit Labels */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[9px] sm:text-[10px] font-black text-white/70 uppercase tracking-widest">
                  {unit.label}
                </span>
                <span className="text-[8px] sm:text-[9px] font-medium text-[#FFD633]/80 hidden sm:inline">
                  ({unit.thaiLabel})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Social Media Sharing bar (Facebook & X) */}
      {showSocialShare && (
        <div className="mt-3.5 pt-2.5 border-t border-white/10 max-w-md">
          <SocialShare daysRemaining={timeLeft.days} variant="hero" />
        </div>
      )}
    </div>
  );
};
