import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PawIcon } from './brand/DogDecor';

interface EventCtaBannerProps {
  onOpenRegisterModal: () => void;
}

export const EventCtaBanner: React.FC<EventCtaBannerProps> = ({ onOpenRegisterModal }) => {
  return (
    <section className="bg-gradient-to-r from-[#2B1347] via-[#3A1668] to-[#1E0B38] py-12 sm:py-14 text-white relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 1200 200" className="w-full h-full object-cover">
          <path
            d="M 0,150 Q 300,50 600,120 T 1200,90"
            fill="none"
            stroke="#FFC928"
            strokeWidth="3"
            strokeDasharray="6,6"
          />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 bg-white/10 border-2 border-white/25 rounded-[32px] p-6 sm:p-9 backdrop-blur-md shadow-[0_20px_50px_-16px_rgba(0,0,0,0.45)]">
          {/* Left Text */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#FFC928] uppercase tracking-wider mb-1">
              <PawIcon size={16} color="#FFC928" />
              <span>พร้อมแล้วใช่ไหม?</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              มาร่วมเป็นส่วนหนึ่งของ <span className="text-[#FFC928]">CHANGSUEK RUN 2027</span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-2">
              ก้าวไปด้วยกัน เพื่อสุขภาพ ครอบครัว ชุมชน และเพื่อนสี่ขา • วันที่ 15 กุมภาพันธ์ 2570 ณ หาดชะอำ (ค่ายนเรศวร - ค่ายพระราม 6) จ.เพชรบุรี
            </p>
          </div>

          {/* Right Yellow Pill Button */}
          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="bg-gradient-to-b from-[#FFD84D] to-[#F5B800] hover:from-[#FFE066] hover:to-[#FFC928] text-[#2A1450] border-2 border-[#2A1450] shadow-[0_4px_0_#2A1450] font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <PawIcon size={18} color="#2A1450" />
            <span>สมัครวิ่งตอนนี้</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
