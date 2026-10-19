import React, { useState } from 'react';
import { Sparkles, Shirt, Award, Check, ZoomIn } from 'lucide-react';

interface MerchShowcaseProps {
  onOpenRegister?: () => void;
  className?: string;
}

export const MerchShowcase: React.FC<MerchShowcaseProps> = ({
  onOpenRegister,
  className = '',
}) => {
  const [activeItem, setActiveItem] = useState<'shirt' | 'medal'>('shirt');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const sizes = [
    { size: '2S', chest: '34"' },
    { size: 'S', chest: '36"' },
    { size: 'M', chest: '38"' },
    { size: 'L', chest: '40"' },
    { size: 'XL', chest: '42"' },
    { size: '2XL', chest: '44"' },
    { size: '3XL', chest: '46"' },
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Outer Shell */}
      <div className="bg-white rounded-[28px] sm:rounded-[36px] border-2 border-purple-100 shadow-xl overflow-hidden">
        {/* Top Gold & Purple Rim */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#3B106B] via-[#FFD633] to-[#3B106B]" />

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD633]/20 border border-[#FFD633]/40 text-[#250848] text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D48B06]" />
                <span>OFFICIAL RACE SOUVENIR</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#250848] tracking-tight">
                เสื้อวิ่ง & เหรียญรางวัล Finisher
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                ออกแบบพิเศษลายช้างศึกคู่สายลมทะเล สำหรับนักวิ่ง CHANGSUEK RUN 2027 ทุกคน
              </p>
            </div>

            {/* Selector Tab for Quick switching */}
            <div className="flex items-center gap-1.5 p-1 bg-purple-50/80 rounded-2xl border border-purple-100 shrink-0 self-start md:self-auto">
              <button
                onClick={() => setActiveItem('shirt')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeItem === 'shirt'
                    ? 'bg-[#3B106B] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#3B106B]'
                }`}
              >
                <Shirt className="w-4 h-4 text-[#FFD633]" />
                <span>เสื้อวิ่ง Micro-Dry</span>
              </button>
              <button
                onClick={() => setActiveItem('medal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeItem === 'medal'
                    ? 'bg-[#3B106B] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#3B106B]'
                }`}
              >
                <Award className="w-4 h-4 text-[#FFD633]" />
                <span>เหรียญรางวัล 3D</span>
              </button>
            </div>
          </div>

          {/* Large Visible 2-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            
            {/* 1. SHIRT CARD */}
            <div
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                activeItem === 'shirt'
                  ? 'border-[#3B106B] bg-gradient-to-b from-[#FBF8FE] to-white shadow-md ring-2 ring-[#3B106B]/15'
                  : 'border-purple-100 bg-white hover:border-purple-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#3B106B] text-white flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-[#FFD633]" />
                    <span>เสื้อวิ่งที่ระลึก (Official Jersey)</span>
                  </span>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    ได้รับทุกคน ทุกระยะ
                  </span>
                </div>

                {/* Big Visible Image */}
                <div
                  onClick={() => setZoomedImage('/images/merch/jersey-full.jpg')}
                  className="relative group rounded-2xl overflow-hidden border border-purple-100 shadow-sm bg-purple-50/50 mb-4 cursor-pointer aspect-4/3 flex items-center justify-center"
                >
                  <img
                    src="/images/merch/jersey-full.jpg"
                    alt="เสื้อวิ่ง CHANGSUEK RUN 2027 Micro-Dry Sublimation"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4 text-[#FFD633]" />
                      คลิกเพื่อดูภาพขยาย
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#250848] text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    ลายพิมพ์ Full Sublimation
                  </div>
                </div>

                {/* Features & Size info */}
                <h4 className="text-lg font-black text-[#250848]">
                  เสื้อวิ่งผ้าไมโครโพลีเอสเตอร์ Micro-Dry
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  เนื้อผ้านุ่มลื่น สัมผัสเบาสบาย ระบายอากาศดีเยี่ยม แห้งเร็ว ไม่อมเหงื่อ ลายพิมพ์สีสดคมชัดไม่ลอกล่อน
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-1.5 text-purple-900 bg-purple-50/70 p-2 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ระบายอากาศ 360°</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-900 bg-purple-50/70 p-2 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ป้องกันรังสี UV แดดเช้า</span>
                  </div>
                </div>

                {/* Size guide badges */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-[11px] font-bold text-gray-500 mb-1.5">
                    ตารางขนาดรอบอก (นิ้ว):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((s) => (
                      <span
                        key={s.size}
                        className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-mono font-bold text-gray-700"
                      >
                        {s.size}: <span className="text-[#3B106B]">{s.chest}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="mt-5 w-full py-2.5 rounded-xl bg-[#3B106B] hover:bg-[#2A0E4E] text-[#FFD633] text-xs font-black tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  เลือกไซส์เสื้อตอนสมัครวิ่ง
                </button>
              )}
            </div>

            {/* 2. MEDAL CARD */}
            <div
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                activeItem === 'medal'
                  ? 'border-[#D48B06] bg-gradient-to-b from-[#FFFDF5] to-white shadow-md ring-2 ring-[#FFD633]/20'
                  : 'border-amber-100 bg-white hover:border-amber-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-[#D48B06] to-[#A86E00] text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#FFF9EA]" />
                    <span>เหรียญรางวัล Finisher (Official Medal)</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    เมื่อเข้าเส้นชัย
                  </span>
                </div>

                {/* Big Visible Image */}
                <div
                  onClick={() => setZoomedImage('/images/merch/medal-full.jpg')}
                  className="relative group rounded-2xl overflow-hidden border border-amber-100 shadow-sm bg-amber-50/40 mb-4 cursor-pointer aspect-4/3 flex items-center justify-center"
                >
                  <img
                    src="/images/merch/medal-full.jpg"
                    alt="เหรียญรางวัล Finisher CHANGSUEK RUN 2027 Zinc Alloy 3D"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4 text-[#FFD633]" />
                      คลิกเพื่อดูภาพขยาย
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    หล่อนูน 3 มิติ Zinc Alloy
                  </div>
                </div>

                {/* Features info */}
                <h4 className="text-lg font-black text-[#250848]">
                  เหรียญ Finisher สลักลายช้างศึกคู่ธรรมชาติ
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  โลหะผสม Zinc Alloy ชุบผิวพรีเมียมไม่เป็นสนิม ออกแบบลายเส้นรูปช้างศึกเดินเคียงคู่สายลมหาดค่ายนเรศวร พร้อมสายคล้องคอผ้าซาตินทอพิเศษ
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50/70 p-2 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>หล่อนูน 3 มิติ คมชัดสูง</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50/70 p-2 rounded-xl">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>สลักชื่อและระยะวิ่งเฉพาะรุ่น</span>
                  </div>
                </div>

                {/* Special feature notes */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-[11px] font-bold text-gray-500 mb-1">
                    ไฮไลท์พิเศษของเหรียญรางวัล:
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    ✨ ด้านหลังมีช่องสำหรับติดแท็กสถิติเวลาส่วนตัว (Engraved Time Slot) สามารถนำไปตั้งโชว์เป็นเกียรติยศแห่งความภาคภูมิใจ
                  </p>
                </div>
              </div>

              {onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD633] to-[#FFC928] hover:from-[#FFE066] hover:to-[#FFD633] text-[#250848] text-xs font-black tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  สมัครวิ่งเพื่อพิชิตเหรียญรางวัลนี้
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center">
            <img
              src={zoomedImage}
              alt="ภาพขยายของรางวัล CHANGSUEK RUN"
              className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border-2 border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-white/80 text-xs font-bold bg-black/50 px-4 py-1.5 rounded-full">
              คลิกที่ใดก็ได้เพื่อปิด
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
