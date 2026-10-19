import React from 'react';
import {
  Compass,
  UserPlus,
  CheckCircle2,
  MapPin,
  Flame,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { RouteId } from '../types';

interface ChangsuekRunExperienceProps {
  onOpenRegister: (routeId?: RouteId) => void;
  onOpenRunnerCenter: () => void;
  onOpenSimulation?: (routeId?: RouteId) => void;
  onSelectRoute: (routeId: RouteId) => void;
}

export const ChangsuekRunExperience: React.FC<ChangsuekRunExperienceProps> = ({
  onOpenRegister,
  onOpenRunnerCenter,
  onSelectRoute,
}) => {
  const steps = [
    {
      step: '01',
      title: 'DISCOVER',
      headline: 'ค้นพบเส้นทางที่ใช่',
      desc: 'ศึกษาเส้นทาง GPS 3K / 5K / 10K ชายหาดชะอำ ค่ายนเรศวร และโรงแรม Pet-Friendly 41 แห่ง',
      icon: Compass,
      badge: 'EXPLORE',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'ดูระยะวิ่ง',
      onAction: () => {
        const el = document.getElementById('distances');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      step: '02',
      title: 'REGISTER',
      headline: 'สมัคร & รับ BIB ทันที',
      desc: 'ลงทะเบียนง่ายใน 1 นาที รับเบอร์ BIB ดิจิทัล บัตรประจำตัวนักวิ่ง และสิทธิ์พิเศษสำหรับเพื่อนสี่ขา',
      icon: UserPlus,
      badge: 'OFFICIAL',
      color: 'bg-purple-50 text-[#5B20A8] border-purple-200',
      actionText: 'สมัครรับ BIB',
      onAction: () => onOpenRegister(),
    },
    {
      step: '03',
      title: 'PREPARE',
      headline: 'เตรียมความพร้อม',
      desc: 'เช็กลิสต์ความพร้อมส่วนตัว พยากรณ์อากาศริมหาด จุดรับเสื้อวิ่ง และบริการตรวจสุขภาพน้องหมา',
      icon: CheckCircle2,
      badge: 'CHECKLIST',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      actionText: 'เปิดศูนย์นักวิ่ง',
      onAction: () => onOpenRunnerCenter(),
    },
    {
      step: '04',
      title: 'COURSE PREVIEW',
      headline: 'สำรวจจุดเลี้ยว & จุดบริการน้ำ',
      desc: 'สำรวจพิกัดจุดเลี้ยว จุดบริการน้ำดื่ม และจุดปฐมพยาบาลริมหาดชะอำเพื่อวางแผนกลยุทธ์ Pace',
      icon: MapPin,
      badge: 'ROUTE MAP',
      color: 'bg-amber-50 text-amber-800 border-amber-300',
      actionText: 'ดูแผนที่เส้นทาง',
      onAction: () => {
        onSelectRoute('3km');
        const el = document.getElementById('routes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      step: '05',
      title: 'RACE DAY',
      headline: 'วันแข่งขันจริง 15 ก.พ. 2570',
      desc: 'จุดปล่อยตัวหน้าหาด Sea Sand Sun สัมผัสพลังแห่งการวิ่งเคียงข้างช้างศึกและธรรมชาติ',
      icon: Flame,
      badge: 'FEBRUARY 2027',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      actionText: 'ดูกำหนดการ',
      onAction: () => {
        const el = document.getElementById('schedule');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      step: '06',
      title: 'FINISH & CELEBRATE',
      headline: 'พิชิตเส้นชัย & รับเหรียญ',
      desc: 'รับเหรียญรางวัล Finisher ช้างศึก บันทึกสถิติ และฉลองความสำเร็จร่วมกับครอบครัว',
      icon: Award,
      badge: 'FINISHER',
      color: 'bg-purple-50 text-[#5B20A8] border-purple-200',
      actionText: 'ดูเหรียญรางวัล',
      onAction: () => {
        const el = document.getElementById('merch-showcase');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section id="experience" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF8FD] via-white to-[#FAF8FD] relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/70 border border-purple-200 text-[#5B20A8] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
            <span>CHANGSUEK RUN EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1F1035] tracking-tight leading-tight">
            การเดินทางของนักวิ่งช้างศึก
          </h2>

          <p className="text-sm sm:text-base text-gray-600 font-medium">
            สัมผัสประสบการณ์ดิจิทัลเต็มรูปแบบ ตั้งแต่การค้นพบเส้นทาง สมัครรับ BIB จำลองเส้นทาง จนถึงวินาทีข้ามเส้นชัย
          </p>
        </div>

        {/* 6-Step Journey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Step Number Watermark */}
                <span className="absolute top-4 right-5 text-4xl font-mono font-black text-gray-100 group-hover:text-purple-100/70 transition-colors pointer-events-none">
                  {st.step}
                </span>

                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform ${st.color}`}
                    >
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {st.badge}
                    </span>
                  </div>

                  <div className="text-xs font-black text-[#5B20A8] tracking-widest uppercase mb-1">
                    STEP {st.step} • {st.title}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#1F1035] leading-snug mb-2 group-hover:text-[#5B20A8] transition-colors">
                    {st.headline}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed font-medium">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={st.onAction}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#5B20A8] hover:text-[#3D106B] group/btn cursor-pointer"
                  >
                    <span>{st.actionText}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Launch Banner at Section Bottom */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#3D106B] via-[#5B20A8] to-[#261042] rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-2 border-purple-300/30">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#FFC928]">
              READY TO JOIN US?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              พร้อมแล้วใช่ไหมที่จะก้าวไปด้วยกัน?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              ร่วมเป็นหนึ่งในประวัติศาสตร์งานวิ่งช้างศึกรัน 2027 ท่ามกลางหาดทราย ป่าสน และกลิ่นอายค่ายนเรศวร
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenRegister()}
              className="px-8 py-3.5 rounded-full bg-[#FFC928] hover:bg-[#F5B800] text-[#17151C] font-black text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              สมัครวิ่งทันที
            </button>
            <button
              onClick={onOpenRunnerCenter}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>เปิดศูนย์นักวิ่ง (Runner Center)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
