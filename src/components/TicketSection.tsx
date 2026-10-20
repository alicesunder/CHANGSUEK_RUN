import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  Droplets,
  Headphones,
  Medal,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Shirt,
  Ticket,
  User,
  UserPlus,
} from 'lucide-react';
import { RouteId } from '../types';
import { ticketCategories, TicketCategory, ticketById } from '../data/eventData';
import { PawIcon } from './brand/DogDecor';

interface TicketSectionProps {
  selectedRoute: RouteId;
  onSelectRoute: (id: RouteId) => void;
  onOpenRegister: (id?: RouteId, extras?: { people: number; dogs: number }) => void;
}

const BEACH = '/images/hero/beach-run.jpg';

/** Per-card look: gradient, accent colour and which part of the beach artwork to show. */
const look: Record<
  RouteId,
  { grad: string; accent: string; btn: string; icon: string; art: { size: string; pos: string }; sub: string }
> = {
  '5km': {
    grad: 'linear-gradient(160deg,#FFE27A 0%,#FFF3C0 70%,#FFFBE8 100%)',
    accent: '#F5B800',
    btn: 'linear-gradient(180deg,#FFD84D,#F5B800)',
    icon: '#E59A00',
    art: { size: '330%', pos: '66% 52%' },
    sub: 'สำหรับผู้เริ่มต้น และนักวิ่งทั่วไป',
  },
  '10km': {
    grad: 'linear-gradient(160deg,#D5C2F8 0%,#E9DEFC 70%,#F6F0FF 100%)',
    accent: '#7B3FC6',
    btn: 'linear-gradient(180deg,#8B4FD8,#6D2FC4)',
    icon: '#7B3FC6',
    art: { size: '300%', pos: '28% 50%' },
    sub: 'สำหรับนักวิ่งที่ท้าทายตนเอง',
  },
  '1km': {
    grad: 'linear-gradient(160deg,#FFBF94 0%,#FFE0CC 70%,#FFF3EA 100%)',
    accent: '#FF8A3D',
    btn: 'linear-gradient(180deg,#FFA25F,#F2762A)',
    icon: '#F2762A',
    art: { size: '270%', pos: '92% 62%' },
    sub: 'วิ่งเล่นสนุก ๆ ระยะทางสั้น ๆ',
  },
  '3km': {
    grad: 'linear-gradient(160deg,#9FE8C6 0%,#D3F4E5 70%,#EEFBF4 100%)',
    accent: '#2EAD62',
    btn: 'linear-gradient(180deg,#52CB8D,#2EAD62)',
    icon: '#2EAD62',
    art: { size: '300%', pos: '96% 60%' },
    sub: 'สนุกได้ไกลกว่า ไปด้วยกัน',
  },
};

const perkList = (isDog: boolean) => [
  { Icon: Shirt, text: isDog ? 'เสื้อที่ระลึกสำหรับคนและน้องหมา' : 'เสื้อที่ระลึก' },
  { Icon: Medal, text: 'เหรียญ Finisher' },
  { Icon: Ticket, text: 'เบอร์วิ่ง (BIB)' },
  { Icon: Droplets, text: isDog ? 'น้ำดื่มและของว่างสำหรับน้องหมา' : 'น้ำดื่มและผลไม้' },
];

const TicketCard: React.FC<{
  t: TicketCategory;
  selected: boolean;
  index: number;
  onSelect: () => void;
  onRegister: () => void;
}> = ({ t, selected, index, onSelect, onRegister }) => {
  const l = look[t.id];
  const isDog = t.group === 'dog';
  return (
    <motion.article
      initial={{ opacity: 0, y: 36, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      onClick={onSelect}
      className="relative flex flex-col h-full overflow-hidden rounded-[26px] cursor-pointer bg-white/70"
      style={{
        background: l.grad,
        border: selected ? `3px solid ${l.accent}` : '3px solid rgba(255,255,255,.9)',
        boxShadow: selected
          ? `0 16px 34px -10px ${l.accent}88`
          : '0 10px 26px -12px rgba(75,45,120,.35)',
      }}
    >
      {/* Artwork cropped from the hero picture, fading into the card */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[52%] h-[150px] sm:h-[160px] pointer-events-none"
        style={{
          backgroundImage: `url(${BEACH})`,
          backgroundSize: l.art.size,
          backgroundPosition: l.art.pos,
          WebkitMaskImage: 'linear-gradient(to left, #000 55%, transparent 100%)',
          maskImage: 'linear-gradient(to left, #000 55%, transparent 100%)',
          borderTopRightRadius: 24,
        }}
      />

      {isDog && (
        <span
          className="absolute top-3 left-3 z-10 text-[11px] font-bold text-white px-2.5 py-0.5 rounded-md"
          style={{ background: l.accent }}
        >
          Dog Run
        </span>
      )}

      <div className="relative z-[1] p-5 pt-5 flex flex-col flex-1">
        <div className={isDog ? 'pt-5' : ''}>
          <div className="font-display text-5xl sm:text-6xl font-bold leading-none text-[#2A1450] tracking-tight">
            {t.distanceLabel}
          </div>
          <div className="mt-2 text-sm font-bold text-[#2A1450] leading-tight">{t.name}</div>
          <div className="text-xs font-medium text-[#4B2D78]/80 mt-0.5">{l.sub}</div>
        </div>

        {/* Price pill */}
        <div className="mt-4 rounded-2xl bg-white/95 shadow-sm px-3 py-2.5 text-center">
          <span className="font-display text-3xl font-bold text-[#2A1450]">
            {t.basePrice.toLocaleString('th-TH')}
          </span>
          <span className="ml-1 text-sm font-bold text-[#2A1450]">บาท</span>
          <span className="ml-1 text-xs font-semibold text-[#6B5A85]">/ {t.baseLabel}</span>
        </div>

        <ul className="mt-4 space-y-2 text-[13px] font-medium text-[#2A1450] mb-5">
          {perkList(isDog).map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5">
              <span
                className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center shrink-0 shadow-sm"
                style={{ color: l.icon }}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRegister();
          }}
          className="mt-auto w-full rounded-full py-3 px-4 flex items-center justify-center gap-2 font-bold text-[15px] transition-transform hover:scale-[1.02] active:scale-95"
          style={{ background: l.btn, color: t.id === '5km' ? '#2A1450' : '#fff', boxShadow: `0 6px 14px -6px ${l.accent}` }}
        >
          <PawIcon size={16} color="currentColor" />
          สมัคร {t.distanceLabel}
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </motion.article>
  );
};

const GroupPanel: React.FC<{
  title: string;
  hint: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}> = ({ title, hint, icon, iconColor, children }) => (
  <div className="rounded-[30px] bg-white/80 backdrop-blur-sm border border-white shadow-[0_14px_40px_-18px_rgba(75,45,120,.35)] p-4 sm:p-5">
    <div className="flex items-center gap-3 mb-4 px-1">
      <span
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
        style={{ background: iconColor }}
      >
        {icon}
      </span>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#2A1450] leading-tight">{title}</h3>
        <p className="text-xs sm:text-sm font-medium text-[#6B5A85]">{hint}</p>
      </div>
    </div>
    {children}
  </div>
);

/** Calculator state: one registration at a time (1 KM or 3 KM). */
type Dist = '1km' | '3km';
type Counts = Record<Dist, { base: number; people: number; dogs: number }>;
const emptyCounts: Counts = {
  '1km': { base: 1, people: 0, dogs: 0 },
  '3km': { base: 0, people: 0, dogs: 0 },
};

const Qty: React.FC<{
  value: number;
  onChange: (n: number) => void;
  max: number;
  label: string;
}> = ({ value, onChange, max, label }) => (
  <div className="flex items-center rounded-full bg-[#F3EEFB] border border-[#E2D6F5] overflow-hidden">
    <button
      type="button"
      aria-label={`ลด ${label}`}
      disabled={value <= 0}
      onClick={() => onChange(value - 1)}
      className="w-8 h-8 flex items-center justify-center text-[#6D2FC4] disabled:opacity-30 hover:bg-[#E9DEFC]"
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="w-7 text-center text-sm font-bold text-[#2A1450] tabular-nums">{value}</span>
    <button
      type="button"
      aria-label={`เพิ่ม ${label}`}
      disabled={value >= max}
      onClick={() => onChange(value + 1)}
      className="w-8 h-8 flex items-center justify-center text-[#6D2FC4] disabled:opacity-30 hover:bg-[#E9DEFC]"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

export const TicketSection: React.FC<TicketSectionProps> = ({
  selectedRoute,
  onSelectRoute,
  onOpenRegister,
}) => {
  const individual = ticketCategories.filter((t) => t.group === 'individual');
  const dog = ticketCategories.filter((t) => t.group === 'dog');
  const [counts, setCounts] = useState<Counts>(emptyCounts);

  const rows = [
    { label: '5 กม. บุคคล', price: '690 บาท' },
    { label: '10 กม. บุคคล', price: '890 บาท' },
    { label: 'Dog 1 กม. (1 คน + 1 น้องหมา)', price: '790 บาท' },
    { label: 'Dog 3 กม. (1 คน + 1 น้องหมา)', price: '890 บาท' },
    { label: 'Dog 1 กม. เพิ่มคน', price: '+450 บาท/คน' },
    { label: 'Dog 1 กม. เพิ่มสุนัข', price: '+250 บาท/ตัว' },
    { label: 'Dog 3 กม. เพิ่มคน', price: '+500 บาท/คน' },
    { label: 'Dog 3 กม. เพิ่มสุนัข', price: '+300 บาท/ตัว' },
  ];

  // Changing one distance clears the other so the calculator always describes ONE registration.
  const update = (d: Dist, field: 'base' | 'people' | 'dogs', value: number) => {
    const other: Dist = d === '1km' ? '3km' : '1km';
    setCounts((c) => {
      const cur = { ...c[d], [field]: value };
      if (field === 'base' && value === 0) {
        cur.people = 0;
        cur.dogs = 0;
      }
      if (field !== 'base' && value > 0) cur.base = 1;
      return { [d]: cur, [other]: { base: 0, people: 0, dogs: 0 } } as Counts;
    });
  };

  const calc = useMemo(() => {
    const active: Dist = counts['3km'].base > 0 ? '3km' : '1km';
    const c = counts[active];
    const t = ticketById(active);
    const total =
      c.base * t.basePrice + c.people * (t.addPersonPrice ?? 0) + c.dogs * (t.addDogPrice ?? 0);
    return { active, total, c };
  }, [counts]);

  const calcRows: { d: Dist; field: 'base' | 'people' | 'dogs'; label: string; price: number; max: number; Icon: any; color: string }[] = [];
  (['1km', '3km'] as Dist[]).forEach((d) => {
    const t = ticketById(d);
    const km = d === '1km' ? '1' : '3';
    calcRows.push(
      { d, field: 'base', label: `Dog ${km} กม. (1 คน + 1 น้องหมา)`, price: t.basePrice, max: 1, Icon: PawIcon, color: '#E59A00' },
      { d, field: 'people', label: `Dog ${km} กม. เพิ่มคน`, price: t.addPersonPrice ?? 0, max: 9, Icon: UserPlus, color: '#6D2FC4' },
      { d, field: 'dogs', label: `Dog ${km} กม. เพิ่มสุนัข`, price: t.addDogPrice ?? 0, max: 9, Icon: PawIcon, color: '#F2762A' },
    );
  });

  return (
    <div>
      {/* ---------- Banner header with the beach artwork ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[32px] mb-5 min-h-[340px] sm:min-h-[400px] flex items-end"
        style={{
          backgroundImage: `url(${BEACH})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent hidden sm:block" />
        <div className="relative z-10 w-full px-5 sm:px-8 pb-6 pt-44 sm:pt-52">
          <img
            src="/images/brand/changsuek-run-logo.png"
            alt="CHANGSUEK RUN"
            className="absolute left-5 sm:left-8 top-5 h-24 sm:h-32 w-auto drop-shadow-lg"
          />
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/90 shadow flex items-center justify-center">
              <PawIcon size={30} color="#7B3FC6" />
            </span>
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#2A1450] leading-tight">เลือกบัตรวิ่งของคุณ</h2>
              <p className="text-sm sm:text-base font-medium text-[#4B2D78]">
                เลือกประเภทการวิ่งที่ใช่ แล้วมาร่วมสร้างความทรงจำดี ๆ ไปด้วยกัน
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------- Two group panels ---------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
        <GroupPanel
          title="วิ่งบุคคลทั่วไป"
          hint="สำหรับนักวิ่งทุกคน"
          icon={<User className="w-6 h-6" />}
          iconColor="#6D2FC4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {individual.map((t, i) => (
              <TicketCard key={t.id} t={t} index={i} selected={selectedRoute === t.id}
                onSelect={() => onSelectRoute(t.id)} onRegister={() => onOpenRegister(t.id)} />
            ))}
          </div>
        </GroupPanel>

        <GroupPanel
          title="วิ่งคู่กับสัตว์เลี้ยง"
          hint="วิ่งกับน้องหมา สร้างความสุขไปด้วยกัน"
          icon={<PawIcon size={26} color="#fff" />}
          iconColor="#2EAD62"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dog.map((t, i) => (
              <TicketCard key={t.id} t={t} index={i + 2} selected={selectedRoute === t.id}
                onSelect={() => onSelectRoute(t.id)} onRegister={() => onOpenRegister(t.id)} />
            ))}
          </div>
        </GroupPanel>
      </div>

      {/* ---------- Price table + calculator ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="rounded-[26px] overflow-hidden bg-white shadow-[0_14px_40px_-18px_rgba(75,45,120,.4)] border border-[#E9DEFC]">
          <div className="px-6 py-4 text-white" style={{ background: 'linear-gradient(135deg,#7B3FC6,#5A25A8)' }}>
            <div className="flex items-center gap-3">
              <PawIcon size={26} color="#fff" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">ตารางราคาบัตรวิ่งทั้งหมด</h3>
                <p className="text-xs text-white/80">เลือกระยะทางและจำนวนผู้เข้าร่วมที่ต้องการ</p>
              </div>
            </div>
          </div>
          <table className="w-full text-sm sm:text-[15px] my-auto">
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label} className={`${i % 2 ? 'bg-[#FAF7FF]' : ''} ${i ? 'border-t border-[#EFE7FA]' : ''}`}>
                  <td className="px-6 py-3 font-semibold text-[#2A1450]">{r.label}</td>
                  <td className="px-6 py-3 text-right font-bold text-[#2A1450] whitespace-nowrap">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-[26px] overflow-hidden bg-white shadow-[0_14px_40px_-18px_rgba(75,45,120,.4)] border border-[#E9DEFC] flex flex-col">
          <div className="px-6 py-4 bg-[#F3EEFB]">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-[#6D2FC4]" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2A1450] leading-tight">ตัวอย่างการคิดราคา</h3>
                <p className="text-xs text-[#6B5A85]">เลือกรายการเพิ่มเติมตามจำนวนที่ต้องการ</p>
              </div>
            </div>
          </div>
          <ul className="px-4 sm:px-6 py-2 flex-1">
            {calcRows.map((r) => (
              <li key={r.d + r.field} className="flex items-center gap-3 py-2 border-b border-[#F1EAFB] last:border-0">
                <span className="w-7 h-7 rounded-lg bg-[#F7F3FD] flex items-center justify-center shrink-0" style={{ color: r.color }}>
                  <r.Icon {...(r.Icon === PawIcon ? { size: 16, color: r.color } : { className: 'w-4 h-4' })} />
                </span>
                <span className="flex-1 text-[13px] sm:text-sm font-semibold text-[#2A1450] leading-tight">{r.label}</span>
                <span className="text-sm font-bold text-[#2A1450] w-16 text-right tabular-nums">
                  {r.price.toLocaleString('th-TH')}.-
                </span>
                <Qty
                  value={counts[r.d][r.field]}
                  max={r.max}
                  label={r.label}
                  onChange={(n) => update(r.d, r.field, n)}
                />
              </li>
            ))}
          </ul>
          <div className="px-4 sm:px-6 pb-5 pt-2">
            <div className="flex items-baseline justify-between mb-3 px-1">
              <span className="text-sm font-semibold text-[#6B5A85]">ยอดรวม</span>
              <span key={calc.total} className="font-display text-3xl font-bold text-[#2A1450] animate-pop">
                {calc.total.toLocaleString('th-TH')} <span className="text-base">บาท</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenRegister(calc.active, { people: calc.c.people, dogs: calc.c.dogs })
              }
              className="w-full rounded-full py-3.5 px-5 flex items-center justify-center gap-2 text-white font-bold text-base transition-transform hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(180deg,#8B4FD8,#6D2FC4)', boxShadow: '0 8px 18px -8px #6D2FC4' }}
            >
              <ShoppingCart className="w-5 h-5" />
              สมัครวิ่งคู่น้องหมาเลย
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Info pills ---------- */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { Icon: Calendar, text: 'เปลี่ยนประเภท/ระยะทางได้ภายหลัง' },
          { Icon: ShieldCheck, text: 'ชำระเงินปลอดภัย' },
          { Icon: Headphones, text: 'สอบถามเพิ่มเติม' },
        ].map(({ Icon, text }) => (
          <span
            key={text}
            className="inline-flex items-center gap-2.5 bg-white rounded-full pl-2 pr-5 py-2 text-sm font-semibold text-[#2A1450] shadow-[0_8px_20px_-10px_rgba(75,45,120,.45)] border border-[#EFE7FA]"
          >
            <span className="w-8 h-8 rounded-full bg-[#F3EEFB] text-[#6D2FC4] flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
