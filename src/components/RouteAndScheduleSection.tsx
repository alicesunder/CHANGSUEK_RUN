import React, { useState } from 'react';
import { RouteId } from '../types';
import {
  ChevronRight,
  Ticket,
  UserCheck,
  Flag,
  Mic,
  Award,
  Calendar,
  MapPin,
  Crown,
  Printer,
  FileDown,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface RouteAndScheduleProps {
  selectedRoute?: RouteId;
  onSelectRoute?: (id: RouteId) => void;
  onOpenArtworkModal?: () => void;
  onOpenSimulation?: (id?: RouteId) => void;
}

export const RouteAndScheduleSection: React.FC<RouteAndScheduleProps> = ({
  selectedRoute,
  onSelectRoute,
  onOpenArtworkModal,
  onOpenSimulation,
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const scheduleItems = [
    {
      time: '05:00',
      title: 'ลงทะเบียน รับ Race Pack',
      desc: 'รับหมายเลขวิ่ง เสื้อวิ่ง และอุปกรณ์การแข่งขัน (BIB & Race Kit Collection)',
      icon: Ticket,
      badge: null,
      highlight: false,
    },
    {
      time: '05:30',
      title: 'วอร์มอัพ (Warm-Up)',
      desc: 'เตรียมร่างกายก่อนเข้าสู่สนาม พร้อมกิจกรรมอบอุ่นร่างกายโดยโค้ชผู้เชี่ยวชาญ',
      icon: UserCheck,
      badge: null,
      highlight: false,
    },
    {
      time: '06:00',
      title: 'ปล่อยตัว FUN RUN (3 KM)',
      desc: 'วิ่งสนุกริมชายหาดชะอำ บรรยากาศครอบครัวและสัตว์เลี้ยง',
      icon: Flag,
      badge: '3 KM',
      highlight: false,
    },
    {
      time: '06:20',
      title: 'ปล่อยตัว MINI MARATHON (5 KM)',
      desc: 'เริ่มก้าวแรกสู่สุขภาพที่ดี พร้อมสัมผัสไอทะเลและลมเช้า',
      icon: Flag,
      badge: '5 KM • ยอดนิยม',
      highlight: true,
    },
    {
      time: '06:40',
      title: 'ปล่อยตัว CHALLENGE RUN (10 KM)',
      desc: 'ท้าทายขีดจำกัดตัวเอง เส้นทางผ่านจุดประวัติศาสตร์ค่ายพระราม 6',
      icon: Flag,
      badge: '10 KM',
      highlight: false,
    },
    {
      time: '09:00',
      title: 'กิจกรรมบนเวที & ดนตรีสด',
      desc: 'ความสนุก ความบันเทิง การแสดงดนตรีริมหาด และกิจกรรมพิเศษมากมาย',
      icon: Mic,
      badge: null,
      highlight: false,
    },
    {
      time: '10:00',
      title: 'พิธีมอบรางวัล (Award Ceremony)',
      desc: 'มอบถ้วยเกียรติยศและของที่ระลึกให้กับนักวิ่งทุกประเภทการแข่งขัน',
      icon: Award,
      badge: null,
      highlight: false,
    },
    {
      time: '11:00',
      title: 'ปิดงาน (Closing Ceremony)',
      desc: 'ขอบคุณนักวิ่งทุกคนที่ร่วมเป็นส่วนหนึ่งของครอบครัว CHANGSUEK RUN',
      icon: Flag,
      badge: null,
      highlight: false,
    },
  ];

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <section id="schedule-section" className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF8FD] via-white to-[#F8F5FD] border-b border-purple-100/70 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ============================================================ */}
        {/* 1. SCHEDULE SECTION (EXACTLY MATCHING USER'S REFERENCE IMAGE) */}
        {/* ============================================================ */}
        <div id="schedule" className="mb-16 sm:mb-20">
          
          {/* Header with Title on Left, Slogans and Runners on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-10">
            <div>
              {/* Top Eyebrow with Purple-Yellow Accent Bar */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] text-[#5B20A8] uppercase">
                  RACE DAY SCHEDULE
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-0.5 bg-[#5B20A8] rounded-full" />
                  <div className="w-3 h-0.5 bg-[#FFC928] rounded-full" />
                </div>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F1035] tracking-tight">
                กำหนดการวันแข่งขัน
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-2">
                ทุกช่วงเวลาสำคัญของวันแข่งขัน มาร่วมสร้างความทรงจำไปด้วยกัน
              </p>
            </div>

            {/* Right Side Visual Header & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-start md:self-auto">
              {/* Print Schedule Button */}
              <button
                onClick={() => setPrintModalOpen(true)}
                className="print-hide inline-flex items-center gap-2 bg-white hover:bg-purple-50 text-[#5B20A8] border-2 border-purple-200 hover:border-[#5B20A8] text-xs sm:text-sm font-black px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95"
                title="พิมพ์หรือบันทึกกำหนดการเป็น PDF"
              >
                <Printer className="w-4 h-4 text-[#5B20A8] group-hover:scale-110 transition-transform" />
                <span>พิมพ์กำหนดการ (PDF)</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-sm sm:text-base font-black italic tracking-wider text-[#5B20A8]">
                    RUN TOGETHER
                  </span>
                  <span className="block text-xs sm:text-sm font-black italic tracking-wider text-[#E59C0E]">
                    A BRIGHTER TOMORROW
                  </span>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FAF5FF] to-[#F1E8FC] border border-purple-200/80 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                  <img
                    src="/images/hero/changsuek-run-coastal.jpg"
                    alt="Changsuek Runners and Elephant"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN SCHEDULE TICKET / TIMELINE CONTAINER */}
          <div className="bg-white/95 rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 border border-purple-100 shadow-[0_10px_35px_-8px_rgba(91,32,168,0.08)] relative">
            
            {/* Top Right Sub-brand Badge inside container */}
            <div className="hidden sm:block absolute top-8 right-8 text-right pointer-events-none">
              <span className="block text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase">
                CHANGSUEK RUN 2027
              </span>
              <span className="block text-[8px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
                RUN FOR A KINDER WORLD
              </span>
              <div className="w-12 h-0.5 bg-amber-400 rounded-full ml-auto mt-1" />
            </div>

            {/* TIMELINE LIST */}
            <div className="space-y-4 sm:space-y-5 relative">
              
              {/* Left Continuous Timeline Vertical Line */}
              <div className="absolute left-[13px] sm:left-[17px] top-6 bottom-6 w-0.5 bg-purple-200/70" />

              {/* ----------------- 05:00 ลงทะเบียน รับ Race Pack ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                {/* Timeline Dot */}
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                {/* Time Stamp */}
                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  05:00
                </span>

                {/* Row Content Card */}
                <div className="flex-1 bg-white hover:bg-[#FAF8FD] rounded-2xl p-3 sm:p-4 border border-transparent hover:border-purple-100 transition-all flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                    <Ticket className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                      ลงทะเบียน รับ Race Pack
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-0.5">
                      รับหมายเลขวิ่ง เสื้อวิ่ง และอุปกรณ์การแข่งขัน
                    </p>
                  </div>
                </div>
              </div>

              {/* ----------------- 05:30 วอร์มอัพ ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  05:30
                </span>

                <div className="flex-1 bg-white hover:bg-[#FAF8FD] rounded-2xl p-3 sm:p-4 border border-transparent hover:border-purple-100 transition-all flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                    <UserCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                      วอร์มอัพ
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-0.5">
                      เตรียมร่างกายก่อนเข้าสู่สนาม พร้อมกิจกรรมอบอุ่นร่างกาย
                    </p>
                  </div>
                </div>
              </div>

              {/* ----------------- 06:00 ปล่อยตัว FUN RUN (3 KM) ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  06:00
                </span>

                {/* Styled Card with Distance Badge */}
                <div className="flex-1 bg-[#FAF7FD]/80 hover:bg-[#FAF7FD] rounded-2xl p-3 sm:p-4 border border-purple-200/70 hover:border-purple-300 transition-all flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                      <Flag className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#5B20A8] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-2xs tracking-wider">
                          3 KM
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                          ปล่อยตัว FUN RUN
                        </h3>
                      </div>
                      <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-1">
                        วิ่งสนุก สำหรับทุกคน
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------- 06:20 ปล่อยตัว 5 KM (HIGHLIGHTED CARD: ยอดนิยม) ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                {/* Radiant Highlight Timeline Dot */}
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(245,184,0,0.5)]">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#E59C0E] font-mono w-14 sm:w-16 shrink-0">
                  06:20
                </span>

                {/* Highlighted Yellow/Gold Card matching user design */}
                <div className="flex-1 bg-gradient-to-r from-[#FFFBEF] via-[#FFF8E6] to-[#FFFBEF] rounded-2xl p-3.5 sm:p-4 border-2 border-[#F5B800] shadow-[0_6px_20px_rgba(245,184,0,0.22)] flex items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
                  
                  {/* Subtle decorative background glow */}
                  <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-amber-200/20 to-transparent pointer-events-none" />

                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 relative z-10">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 text-[#D48A06] flex items-center justify-center shrink-0 border border-amber-300 shadow-2xs">
                      <Flag className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#F5B800] text-[#1F1035] text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-2xs tracking-wider">
                          5 KM
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                          ปล่อยตัว 5 KM
                        </h3>
                      </div>
                      <p className="text-xs sm:text-[13px] text-amber-900/80 font-medium mt-1">
                        เริ่มก้าวแรก สู่สุขภาพที่ดี
                      </p>
                    </div>
                  </div>

                  {/* Right "ยอดนิยม" Badge */}
                  <div className="shrink-0 relative z-10">
                    <span className="inline-flex items-center gap-1.5 bg-[#F5B800] text-[#1F1035] text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
                      <Crown className="w-3.5 h-3.5" />
                      <span>ยอดนิยม</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* ----------------- 06:40 ปล่อยตัว 10 KM ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  06:40
                </span>

                <div className="flex-1 bg-[#FAF7FD]/80 hover:bg-[#FAF7FD] rounded-2xl p-3 sm:p-4 border border-purple-200/70 hover:border-purple-300 transition-all flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                      <Flag className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#3D106B] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-2xs tracking-wider">
                          10 KM
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                          ปล่อยตัว 10 KM
                        </h3>
                      </div>
                      <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-1">
                        ท้าทายตัวเอง ไปให้ไกลกว่าเดิม
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------- 09:00 กิจกรรมบนเวที ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  09:00
                </span>

                <div className="flex-1 bg-white hover:bg-[#FAF8FD] rounded-2xl p-3 sm:p-4 border border-transparent hover:border-purple-100 transition-all flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                    <Mic className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                      กิจกรรมบนเวที
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-0.5">
                      ความสนุก ความบันเทิง และกิจกรรมพิเศษมากมาย
                    </p>
                  </div>
                </div>
              </div>

              {/* ----------------- 10:00 พิธีมอบรางวัล ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  10:00
                </span>

                <div className="flex-1 bg-white hover:bg-[#FAF8FD] rounded-2xl p-3 sm:p-4 border border-transparent hover:border-purple-100 transition-all flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                    <Award className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                      พิธีมอบรางวัล
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-0.5">
                      มอบรางวัลให้กับนักวิ่งทุกประเภท
                    </p>
                  </div>
                </div>
              </div>

              {/* ----------------- 11:00 ปิดงาน ----------------- */}
              <div className="flex items-center gap-3 sm:gap-6 relative group">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shrink-0 z-10 shadow-xs group-hover:border-[#5B20A8] transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B20A8]" />
                </div>

                <span className="text-sm sm:text-base font-black text-[#1F1035] font-mono w-14 sm:w-16 shrink-0">
                  11:00
                </span>

                <div className="flex-1 bg-white hover:bg-[#FAF8FD] rounded-2xl p-3 sm:p-4 border border-transparent hover:border-purple-100 transition-all flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4ECFD] text-[#5B20A8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
                    <Flag className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1F1035] leading-tight">
                      ปิดงาน
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-0.5">
                      ขอบคุณทุกคนที่ร่วมเป็นส่วนหนึ่งของ CHANGSUEK RUN
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Quote slogan block from image on right side */}
            <div className="hidden lg:block absolute bottom-28 right-10 text-right pointer-events-none">
              <div className="font-serif italic text-2xl font-black text-[#261042] tracking-tight">
                "เห็นช้างวิ่ง
              </div>
              <div className="font-serif italic text-2xl font-black text-[#5B20A8] tracking-tight">
                วิ่งตามช้าง"
              </div>
              <div className="w-24 h-0.5 bg-[#FFC928] rounded-full ml-auto mt-2" />
              <div className="text-[9px] font-black tracking-widest text-gray-400 uppercase mt-1">
                MORE THAN A RUN · A BIGGER FAMILY
              </div>
            </div>

            {/* Bottom Info Bar matching the card in user mockup */}
            <div className="mt-8 pt-6 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                {/* 1. วันแข่งขัน */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B20A8] flex items-center justify-center border border-purple-200/80">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">วันแข่งขัน</span>
                    <span className="text-xs sm:text-sm font-black text-[#1F1035]">
                      วันอาทิตย์ที่ 15 กุมภาพันธ์ 2569
                    </span>
                  </div>
                </div>

                {/* 2. สถานที่จัดงาน */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B20A8] flex items-center justify-center border border-purple-200/80">
                    <MapPin className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">สถานที่จัดงาน</span>
                    <span className="text-xs sm:text-sm font-black text-[#1F1035]">
                      ค่ายพระราม 6 จ.เพชรบุรี
                    </span>
                  </div>
                </div>
              </div>

              {/* Watermark note */}
              <div className="text-right text-xs font-serif italic text-purple-300">
                Phetchaburi
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. CLEAN, PRINTER-FRIENDLY PDF PREVIEW & PRINT DIALOG */}
      {/* ============================================================ */}
      {printModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-100 overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full print:max-h-none print:rounded-none">
            
            {/* Modal Header (Hidden during actual paper print) */}
            <div className="print-hide flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-[#FAF8FD]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5B20A8] text-white flex items-center justify-center shadow-xs">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1F1035]">
                    พิมพ์กำหนดการแข่งขัน (Race Day Schedule)
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    ฉบับย่อ สะดวกพกพา หรือบันทึกเป็นไฟล์ PDF (Save as PDF)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Schedule Sheet Content (Clean, elegant, black/purple typography for PDF) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 printable-schedule-sheet text-[#111827]">
              {/* Document Header */}
              <div className="border-b-2 border-[#5B20A8] pb-4 mb-6 flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-black text-[#5B20A8] tracking-widest uppercase">
                    CHANGSUEK RUN 2027 • OFFICIAL RACE SCHEDULE
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1F1035] mt-1">
                    กำหนดการแข่งขันงานช้างศึกรัน
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                    "เห็นช้างวิ่ง วิ่งตามช้าง" • ค่ายพระราม 6 ชายหาดชะอำ จ.เพชรบุรี
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block bg-[#FAF5FF] border border-[#5B20A8]/30 text-[#5B20A8] text-[11px] font-black px-3 py-1 rounded-md">
                    15 กุมภาพันธ์ 2569
                  </span>
                </div>
              </div>

              {/* Quick Info Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 mb-6 text-xs text-gray-700">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">สถานที่ (Venue)</span>
                  <span className="font-bold text-[#1F1035]">ค่ายพระราม 6 เพชรบุรี</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">จุดสตาร์ท (Start Line)</span>
                  <span className="font-bold text-[#1F1035]">ลานกิจกรรมหน้าหาด</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">สิ่งสำคัญ (Check)</span>
                  <span className="font-bold text-[#5B20A8]">นำ BIB และติดชิปวิ่ง</span>
                </div>
              </div>

              {/* Clean Schedule Table / List */}
              <div className="space-y-3">
                {scheduleItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`page-break-avoid flex items-start gap-4 p-3 rounded-xl border transition-colors ${
                      item.highlight
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    {/* Time Column */}
                    <div className="w-16 font-mono font-black text-sm text-[#5B20A8] shrink-0 pt-0.5">
                      {item.time} น.
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-[#1F1035]">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            item.highlight
                              ? 'bg-amber-400 text-[#1F1035]'
                              : 'bg-purple-100 text-[#5B20A8]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Footer Notes */}
              <div className="mt-8 pt-4 border-t border-dashed border-gray-300 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>* กำหนดการอาจมีการปรับเปลี่ยนตามสภาพอากาศและการจราจรหน้างาน</span>
                <span className="font-mono text-gray-400">changsuek-run.com/schedule</span>
              </div>
            </div>

            {/* Modal Bottom Action Bar (Hidden when printing paper/PDF) */}
            <div className="print-hide p-4 sm:p-5 border-t border-gray-100 bg-[#FAF8FD] flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 hidden sm:inline font-medium">
                💡 ในหน้าต่างพิมพ์ ให้เลือกเครื่องพิมพ์เป็น <b>"บันทึกเป็น PDF" (Save as PDF)</b>
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  onClick={handlePrintSchedule}
                  className="print-keep inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B20A8] hover:bg-[#471587] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>สั่งพิมพ์ / บันทึก PDF ตอนนี้</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
