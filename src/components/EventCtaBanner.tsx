import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EventCtaBannerProps {
  onOpenRegisterModal: () => void;
}

export const EventCtaBanner: React.FC<EventCtaBannerProps> = ({ onOpenRegisterModal }) => {
  return (
    <section className="bg-gradient-to-r from-[#2B1347] via-[#210D3B] to-[#160829] py-12 sm:py-16 text-white relative overflow-hidden">
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

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          
          {/* Left Text matching mockup */}
          <div className="text-center md:text-left">
            <span className="text-xs sm:text-sm font-bold text-[#FFCC00] uppercase tracking-wider block mb-1">
              พร้อมแล้วใช่ไหม?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              มาร่วมเป็นส่วนหนึ่งของ <span className="text-[#FFCC00]">CHANGSUEK RUN</span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-2">
              ก้าวไปด้วยกัน เพื่อสุขภาพ ครอบครัว ชุมชน และเพื่อนสี่ขา วันที่ 15 กุมภาพันธ์ 2569
            </p>
          </div>

          {/* Right Yellow Pill Button matching mockup */}
          <button
            onClick={onOpenRegisterModal}
            className="bg-[#FFCC00] hover:bg-[#FFD633] text-[#17151C] font-black text-sm sm:text-base px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <span>สมัครวิ่งตอนนี้</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      </div>
    </section>
  );
};
