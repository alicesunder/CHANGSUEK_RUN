import React, { useState } from 'react';
import { RouteId } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  BarChart3,
  Shirt,
  Medal,
  CreditCard,
  Gift,
  ShieldCheck,
  Heart,
  ChevronRight,
  Crown,
  Sparkles,
  X,
  Check,
  Info,
  Package,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SocialShare } from './SocialShare';
import { MerchShowcase } from './MerchShowcase';
import { TicketSection } from './TicketSection';

interface RaceDistancesProps {
  selectedRoute: RouteId;
  onSelectRoute: (id: RouteId) => void;
  onScrollToMap: () => void;
  onOpenRegister: (id?: RouteId, extras?: { people: number; dogs: number }) => void;
  onOpenComparisonModal?: () => void;
  onOpenPaceModal?: () => void;
}

export const RaceDistances: React.FC<RaceDistancesProps> = ({
  selectedRoute,
  onSelectRoute,
  onScrollToMap,
  onOpenRegister,
  onOpenComparisonModal,
  onOpenPaceModal,
}) => {
  const [merchModalOpen, setMerchModalOpen] = useState(false);

  return (
    <section
      id="distances"
      className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-white via-[#FBF8FF] to-[#EFE6FC] paw-bg relative overflow-hidden"
    >
      {/* Soft colour blobs */}
      <div className="absolute -top-16 -left-20 w-72 h-72 bg-[#FFC928]/25 blob pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-[#8ED8F8]/30 blob pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <TicketSection
          selectedRoute={selectedRoute}
          onSelectRoute={onSelectRoute}
          onOpenRegister={onOpenRegister}
        />

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {onOpenComparisonModal && (
            <button onClick={onOpenComparisonModal} className="btn-paw bg-white px-5 py-2.5 text-sm">
              เปรียบเทียบระยะทาง
            </button>
          )}
          {onOpenPaceModal && (
            <button onClick={onOpenPaceModal} className="btn-paw bg-white px-5 py-2.5 text-sm">
              คำนวณเพซและเวลา
            </button>
          )}
          <button onClick={onScrollToMap} className="btn-paw bg-white px-5 py-2.5 text-sm">
            ดูแผนที่เส้นทาง
          </button>
        </div>

        {/* Prominent Showcase: เสื้อวิ่ง & เหรียญรางวัล Finisher */}
        <div id="merch-showcase" className="mt-10 sm:mt-14">
          <MerchShowcase onOpenRegister={() => onOpenRegister(selectedRoute)} />
        </div>

        {/* ============================================================== */}
        {/* BOTTOM BENEFIT BAR: "เมื่อสมัครเข้าร่วม คุณจะได้รับ" (RACE PACK) */}
        {/* PREMIUM TICKET-STYLE AESTHETIC WITH ELEGANT GRID               */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14 relative"
        >
          {/* Outer Ticket Shell with Distinct Double Border & Notches */}
          <div className="relative bg-white rounded-[28px] sm:rounded-[36px] border-2 border-[#5B20A8]/25 shadow-2xl shadow-purple-950/10 overflow-hidden">
            
            {/* Subtle Top Golden Accent Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5B20A8] via-[#F5B800] to-[#5B20A8]" />

            {/* Background Decorative Graphic Elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-radial from-purple-100/60 via-amber-50/20 to-transparent rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-radial from-purple-100/40 to-transparent rounded-full pointer-events-none" />

            <div className="p-6 sm:p-8 lg:p-9 relative z-10">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D106B] via-[#5B20A8] to-[#7B2FFF] text-white flex items-center justify-center shadow-lg shadow-purple-900/25 border-2 border-white/60 shrink-0">
                    <Package className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full bg-[#FFC928]/25 text-[#7A5200] border border-[#E59C0E]/40 shadow-2xs">
                        OFFICIAL RACE PACK
                      </span>
                      <span className="text-[11px] font-bold text-[#4A1584] bg-[#F4ECFD] px-2.5 py-0.5 rounded-full border border-[#D8C2F8]">
                        รวมอยู่ในค่าสมัครทุกระยะการวิ่ง
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#25183B] tracking-tight">
                      เมื่อสมัครเข้าร่วม <span className="text-[#5B20A8]">คุณจะได้รับ</span>
                    </h3>
                  </div>
                </div>

                {/* Interactive Preview Button */}
                <button
                  type="button"
                  onClick={() => setMerchModalOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#F4ECFD] to-[#EAE0FC] hover:from-[#EAE0FC] hover:to-[#DFCEFA] text-[#3D106B] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 border-[#D8C2F8] shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <Eye className="w-4 h-4 text-[#5B20A8] group-hover:scale-110 transition-transform" />
                  <span>ดูภาพของรางวัลจริง (เสื้อ & เหรียญ 3D)</span>
                </button>
              </div>

              {/* Included Items: Clean 2x2 Grid Layout with Modern SVG Line Icons */}
              <div className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* 1. Shirt (เสื้อวิ่ง) */}
                  <div
                    onClick={() => setMerchModalOpen(true)}
                    className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-purple-100 hover:border-[#5B20A8] shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 cursor-pointer group hover:-translate-y-1 relative"
                  >
                    {/* Modern Circular Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#F4ECFD] border-2 border-[#D8C2F8] flex items-center justify-center text-[#5B20A8] shrink-0 group-hover:scale-105 group-hover:bg-[#5B20A8] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#5B20A8] transition-colors truncate">
                          เสื้อวิ่ง CHANGSUEK
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Micro-Dry Sublimation
                      </p>
                      <span className="inline-block text-[10px] font-bold text-[#5B20A8] bg-purple-50 px-2 py-0.5 rounded-full mt-1.5 border border-purple-200">
                        ระบายอากาศพิเศษ
                      </span>
                    </div>
                  </div>

                  {/* 2. Medal (เหรียญที่ระลึก) with subtle hover scale & gentle golden glow */}
                  <div
                    onClick={() => setMerchModalOpen(true)}
                    className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-amber-100 hover:border-[#E59C0E] shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(245,184,0,0.35)] transition-all duration-300 flex items-center gap-4 cursor-pointer group hover:-translate-y-1 relative"
                  >
                    {/* Modern Circular Icon Container with Golden Glow on hover */}
                    <div className="w-14 h-14 rounded-full bg-[#FFF9EA] border-2 border-[#F5D88A] flex items-center justify-center text-[#D48A06] shrink-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#F5B800] group-hover:to-[#D48A06] group-hover:text-white group-hover:shadow-[0_0_22px_rgba(245,184,0,0.55)] group-hover:border-[#E59C0E] transition-all duration-300 shadow-sm relative">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7.21 15 2.26-4.52a2 2 0 0 1 1.79-1.11h1.48a2 2 0 0 1 1.79 1.11L16.79 15" />
                        <circle cx="12" cy="17" r="5" />
                        <path d="M12 12v-1" />
                        <path d="m4.93 4.93 4.24 4.24" />
                        <path d="m14.83 9.17 4.24-4.24" />
                        <path d="M14 4h7v7" />
                        <path d="M10 4H3v7" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#D48A06] transition-colors truncate">
                          เหรียญที่ระลึก Finisher
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        หล่อนูน 3D Zinc Alloy
                      </p>
                      <span className="inline-block text-[10px] font-bold text-[#A86E00] bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 border border-amber-200">
                        พร้อมสายคล้องคอทอพิเศษ
                      </span>
                    </div>
                  </div>

                  {/* 3. Bib (หมายเลขวิ่ง) */}
                  <div className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 group hover:-translate-y-1 relative">
                    {/* Modern Circular Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#F4ECFD] border-2 border-[#D8C2F8] flex items-center justify-center text-[#5B20A8] shrink-0 group-hover:scale-105 group-hover:bg-[#5B20A8] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="3" />
                        <circle cx="7" cy="7" r="1" fill="currentColor" />
                        <circle cx="17" cy="7" r="1" fill="currentColor" />
                        <path d="M7 14h10" />
                        <path d="M9 11h6" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#5B20A8] transition-colors truncate block">
                        หมายเลขแข่งขัน (BIB)
                      </span>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        พิมพ์ชื่อเฉพาะบุคคล + ชิปจับเวลา
                      </p>
                      <span className="inline-block text-[10px] font-bold text-[#5B20A8] bg-purple-50 px-2 py-0.5 rounded-full mt-1.5 border border-purple-200">
                        ระบบ Timing RFID
                      </span>
                    </div>
                  </div>

                  {/* 4. Souvenir / Gift (ของที่ระลึกจากงาน) */}
                  <div className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 group hover:-translate-y-1 relative">
                    {/* Modern Circular Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#F4ECFD] border-2 border-[#D8C2F8] flex items-center justify-center text-[#5B20A8] shrink-0 group-hover:scale-105 group-hover:bg-[#5B20A8] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="8" width="18" height="14" rx="2" />
                        <path d="M12 8v14" />
                        <path d="M19 12H5" />
                        <path d="m7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#5B20A8] transition-colors truncate block">
                        ของที่ระลึก & ประกันภัย
                      </span>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        กระเป๋าผ้า + ประกันอุบัติเหตุ
                      </p>
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-200">
                        คุ้มครองตลอดงาน
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Perforated Ticket Divider with Notches */}
              <div className="relative my-7">
                <div className="border-t-2 border-dashed border-purple-200 w-full" />
                {/* Left Ticket Notch */}
                <div className="absolute -left-6 sm:-left-8 lg:-left-9 -top-3 w-6 h-6 rounded-full bg-[#F8F5FC] border-r-2 border-[#5B20A8]/25" />
                {/* Right Ticket Notch */}
                <div className="absolute -right-6 sm:-right-8 lg:-right-9 -top-3 w-6 h-6 rounded-full bg-[#F8F5FC] border-l-2 border-[#5B20A8]/25" />
              </div>

              {/* Bottom Footer Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    นักวิ่งที่เข้าเส้นชัยตามเวลาที่กำหนดจะได้รับ <span className="font-bold text-[#5B20A8]">เหรียญ Finisher สลักชื่อ และของว่างฟื้นฟูกำลัง</span> ทุกคน
                  </p>
                </div>

                <div className="font-comic text-base sm:text-lg text-[#5B20A8] font-bold flex items-center gap-1.5 shrink-0">
                  <span>มากกว่าการวิ่ง คือการให้</span>
                  <span className="text-[#F5B800] text-xl">💛</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Merch & Race Pack Details Modal */}
      {merchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-purple-100">
            <button
              onClick={() => setMerchModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#FFC928] bg-[#3D106B] px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                OFFICIAL RACE PACK
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#25183B] mb-1">
              เสื้อวิ่ง & เหรียญรางวัลอย่างเป็นทางการ
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              CHANGSUEK RUN 2027: ผลิตจากวัสดุเกรดพรีเมียม สิทธิพิเศษเฉพาะนักวิ่งที่สมัคร
            </p>

            {/* Official product photos */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="relative group overflow-hidden rounded-2xl border border-purple-100 shadow-sm bg-purple-50/30">
                <img
                  src="/images/merch/jersey-full.jpg"
                  alt="เสื้อวิ่ง CHANGSUEK RUN 2027"
                  className="w-full h-44 sm:h-52 object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold py-1 px-2.5 rounded-lg text-center">
                  เสื้อวิ่ง Micro-Dry Sublimation
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl border border-purple-100 shadow-sm bg-purple-50/30">
                <img
                  src="/images/merch/medal-full.jpg"
                  alt="เหรียญรางวัล Finisher CHANGSUEK RUN 2027"
                  className="w-full h-44 sm:h-52 object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold py-1 px-2.5 rounded-lg text-center">
                  เหรียญหล่อนูน 3 มิติ Zinc Alloy
                </div>
              </div>
            </div>

            {/* Benefit Details List */}
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 mb-6">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="font-bold text-[#4A1584] mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  เสื้อวิ่งผ้าไมโครโพลีเอสเตอร์ Micro-Dry
                </div>
                <div className="text-xs text-gray-600 pl-6">
                  ระบายอากาศดีเยี่ยม นุ่มลื่น แห้งไว ไม่อมเหงื่อ พร้อมลายพิมพ์ Sublimation คุณภาพสูงไม่ลอกล่อน
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  เหรียญรางวัล Finisher โลหะผสม Zinc Alloy
                </div>
                <div className="text-xs text-gray-600 pl-6">
                  หล่อนูน 3 มิติ ลายช้างศึกและธรรมชาติริมหาดค่ายนเรศวร สลักชื่อระยะวิ่ง พร้อมสายคล้องคอทอพิเศษ
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  หมายเลขวิ่ง (BIB) & ประกันอุบัติเหตุ
                </div>
                <div className="text-xs text-gray-600 pl-6">
                  พร้อมระบบจับเวลามาตรฐาน และความคุ้มครองอุบัติเหตุตลอดระยะเวลาการแข่งขัน
                </div>
              </div>
            </div>

            {/* Modal CTA */}
            <button
              onClick={() => {
                setMerchModalOpen(false);
                onOpenRegister(selectedRoute);
              }}
              className="w-full bg-[#FFC928] hover:bg-[#F5B800] text-[#25183B] font-black py-3.5 rounded-full shadow-md text-sm transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              สมัครวิ่งและรับของที่ระลึกระยะ {selectedRoute.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

