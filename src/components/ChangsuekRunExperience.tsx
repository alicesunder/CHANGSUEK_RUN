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
import { motion } from 'motion/react';
import { RouteId } from '../types';
import { PawIcon, PawTrail } from './brand/DogDecor';

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
      desc: 'ศึกษาเส้นทาง GPS 1K / 3K / 5K / 10K ชายหาดชะอำ ค่ายนเรศวร และโรงแรม Pet-Friendly 41 แห่ง',
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

  const tint = [
    { bg: 'linear-gradient(160deg,#C9F3DD,#EBFAF2)', dot: '#2EAD62' },
    { bg: 'linear-gradient(160deg,#E3D3FB,#F5EEFF)', dot: '#7B3FC6' },
    { bg: 'linear-gradient(160deg,#BFE8FB,#E8F7FE)', dot: '#2B9FD6' },
    { bg: 'linear-gradient(160deg,#FFE9A6,#FFF7D9)', dot: '#E5A800' },
    { bg: 'linear-gradient(160deg,#FFC9B5,#FFEBE2)', dot: '#F2762A' },
    { bg: 'linear-gradient(160deg,#FFC4DA,#FFE9F1)', dot: '#E0457F' },
  ];

  return (
    <section id="experience" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute top-16 -left-16 w-72 h-72 bg-[#FFC928]/25 blob pointer-events-none animate-bobble" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#C9A6F5]/30 blob pointer-events-none animate-bobble" style={{ animationDelay: '1.2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#2A1450] text-[#5B20A8] text-xs font-bold uppercase tracking-widest shadow-[0_3px_0_#2A1450]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
            CHANGSUEK RUN EXPERIENCE
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold text-[#2A1450] leading-tight">การเดินทางของนักวิ่งช้างศึก</h2>
          <p className="text-sm sm:text-lg text-[#4B2D78] font-medium">
            ตั้งแต่ค้นหาเส้นทาง สมัครรับ BIB เตรียมตัว ไปจนถึงวินาทีข้ามเส้นชัยพร้อมเพื่อนสี่ขา
          </p>
        </motion.div>

        {/* 6 steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            const t = tint[i];
            return (
              <motion.div
                key={st.step}
                initial={{ opacity: 0, y: 50, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 160, damping: 16, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -8, rotate: i % 2 ? 1.2 : -1.2 }}
                className={`relative rounded-[28px] p-6 border-[3px] border-white shadow-[0_16px_34px_-16px_rgba(75,45,120,.5)] flex flex-col ${
                  i % 3 === 1 ? 'lg:mt-8' : ''
                }`}
                style={{ background: t.bg }}
              >
                <span
                  className="absolute -top-4 -left-3 w-12 h-12 rounded-full text-white font-display font-bold text-lg flex items-center justify-center border-[3px] border-white shadow-md animate-boing"
                  style={{ background: t.dot, animationDelay: `${i * 0.25}s` }}
                >
                  {st.step}
                </span>
                <PawIcon size={80} color="#fff" className="absolute -right-3 -bottom-3 opacity-50 rotate-12 pointer-events-none" />

                <div className="flex items-center justify-between mb-4 pl-8">
                  <span className="text-[11px] font-bold tracking-widest" style={{ color: t.dot }}>
                    {st.badge}
                  </span>
                  <span className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center" style={{ color: t.dot }}>
                    <Icon className="w-6 h-6" />
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2A1450] leading-snug">{st.headline}</h3>
                <p className="mt-2 text-sm text-[#4B2D78] font-medium leading-relaxed flex-1">{st.desc}</p>
                <button
                  onClick={st.onAction}
                  className="group/btn mt-5 self-start inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#2A1450] shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>{st.actionText}</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-14 sm:mt-20 rounded-[32px] overflow-hidden p-7 sm:p-10 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(120deg,#5A25A8,#7B3FC6 55%,#4B1C8C)', boxShadow: '0 22px 40px -18px rgba(75,28,140,.7)' }}
        >
          <PawTrail className="absolute right-6 top-4 opacity-70" count={6} color="#FFC928" />
          <div className="relative space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928]">READY TO JOIN US?</span>
            <h3 className="text-2xl sm:text-4xl font-bold leading-tight">พร้อมแล้วใช่ไหมที่จะก้าวไปด้วยกัน?</h3>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              ร่วมเป็นหนึ่งในประวัติศาสตร์งานวิ่งช้างศึกรัน 2027 ท่ามกลางหาดทราย ป่าสน และกลิ่นอายค่ายนเรศวร
            </p>
          </div>
          <div className="relative flex flex-wrap items-center gap-3">
            <button onClick={() => onOpenRegister()} className="btn-paw bg-[#FFC928] px-8 py-3.5 text-base">
              <PawIcon size={20} color="#2A1450" />
              สมัครวิ่งทันที
            </button>
            <button
              onClick={onOpenRunnerCenter}
              className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm border-2 border-white/40 backdrop-blur-sm transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              เปิดศูนย์นักวิ่ง (Runner Center)
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
