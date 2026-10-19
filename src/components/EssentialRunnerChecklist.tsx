import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Footprints, 
  Tag, 
  Droplets, 
  Sun, 
  Sparkles, 
  RefreshCw, 
  HelpCircle,
  Shirt,
  Smartphone,
  Watch,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChecklistItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'must-have' | 'gear' | 'hydration' | 'health';
  description: string;
  tip?: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultChecked?: boolean;
}

const CHECKLIST_STORAGE_KEY = 'changsuek_runner_checklist_v1';

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'running-shoes',
    name: 'รองเท้าวิ่ง (Running Shoes)',
    nameEn: 'Running Shoes',
    category: 'must-have',
    description: 'คู่ที่ซ้อมจนชินเท้า ไม่แนะนำให้ใส่รองเท้าคู่ใหม่แกะกล่องวันแข่ง',
    tip: 'ตรวจสอบความกระชับและผูกเชือก 2 ทบป้องกันเชือกหลุดระหว่างวิ่ง',
    icon: Footprints,
    defaultChecked: true,
  },
  {
    id: 'bib-number',
    name: 'เบอร์วิ่งและชิปจับเวลา (Bib Number)',
    nameEn: 'Bib Number',
    category: 'must-have',
    description: 'ติดไว้ที่หน้าอกเสื้อให้มองเห็นชัดเจน พร้อมกรอกข้อมูลติดต่อฉุกเฉินด้านหลัง BIB',
    tip: 'ห้ามพับหรือกรีดทับแผ่นชิปจับเวลาที่ติดอยู่ด้านหลัง',
    icon: Tag,
    defaultChecked: true,
  },
  {
    id: 'hydration-pack',
    name: 'เป้น้ำ / กระบอกน้ำพกพา (Hydration Pack)',
    nameEn: 'Hydration Pack',
    category: 'hydration',
    description: 'กระบอกน้ำนิ่ม (Soft Flask) หรือเป้น้ำพกพา ช่วยจิบน้ำตามจังหวะของตัวเอง',
    tip: 'งานมีจุดน้ำทุก 2 กม. แต่การพกขวดน้ำส่วนตัวช่วยลดขยะแก้วน้ำในสนามได้',
    icon: Droplets,
  },
  {
    id: 'official-jersey',
    name: 'เสื้อวิ่ง Micro-Dry CHANGSUEK',
    nameEn: 'Official Running Shirt',
    category: 'gear',
    description: 'เสื้อวิ่งที่ได้รับใน Race Pack ระบายเหงื่อได้แห้งไว เหมาะกับอากาศริมทะเล',
    icon: Shirt,
  },
  {
    id: 'gps-watch',
    name: 'นาฬิกาวิ่ง / โทรศัพท์มือถือ (GPS Watch & Phone)',
    nameEn: 'GPS Watch / Smartphone',
    category: 'gear',
    description: 'ชาร์จแบตเตอรี่ให้เต็ม 100% สำหรับจับเพซ บันทึกเส้นทาง และติดต่อครอบครัว',
    icon: Watch,
  },
  {
    id: 'sun-protection',
    name: 'ครีมกันแดด & หมวกวิ่ง (Sun Protection)',
    nameEn: 'Sun Protection & Visor',
    category: 'health',
    description: 'หมวกวิ่งช่วยบังแดดริมหาดยามเช้า และทาครีมกันแดดกันน้ำ SPF50+ PA++++',
    icon: Sun,
  },
  {
    id: 'energy-gel',
    name: 'เจลพลังงาน & เกลือแร่ (Energy Gels)',
    nameEn: 'Energy Gels & Electrolytes',
    category: 'hydration',
    description: 'สำหรับนักวิ่งระยะ 10KM หรือผู้ที่ต้องการพลังงานเสริมระหว่างวิ่ง',
    tip: 'ควรทดลองกินตอนซ้อมเพื่อดูการตอบสนองของกระเพาะอาหาร',
    icon: HeartPulse,
  },
  {
    id: 'phone-belt',
    name: 'กระเป๋าคาดเอว / ปลอกแขนใส่มือถือ',
    nameEn: 'Running Belt',
    category: 'gear',
    description: 'เก็บของจำเป็น กุญแจรถ บัตรประชาชน และเงินสดติดตัวแบบแนบกระชับลำตัว',
    icon: Smartphone,
  },
];

export const EssentialRunnerChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    const initial: { [key: string]: boolean } = {};
    DEFAULT_CHECKLIST.forEach((item) => {
      if (item.defaultChecked) {
        initial[item.id] = true;
      }
    });
    return initial;
  });

  const [filter, setFilter] = useState<'all' | 'must-have' | 'gear' | 'hydration' | 'health'>('all');

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch {
      // ignore
    }
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalItems = DEFAULT_CHECKLIST.length;
  const completedCount = DEFAULT_CHECKLIST.filter((item) => !!checkedItems[item.id]).length;
  const progressPercentage = Math.round((completedCount / totalItems) * 100);

  const handleSelectAll = () => {
    const all: { [key: string]: boolean } = {};
    DEFAULT_CHECKLIST.forEach((item) => {
      all[item.id] = true;
    });
    setCheckedItems(all);
  };

  const handleReset = () => {
    setCheckedItems({});
  };

  const filteredItems = DEFAULT_CHECKLIST.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="runner-checklist" className="py-14 sm:py-20 bg-white relative overflow-hidden select-none">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B20A8]/10 border border-[#5B20A8]/20 text-[#5B20A8] text-xs font-black tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D48A06]" />
              <span>RACE DAY PREPARATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#24172F] tracking-tight">
              Essential Runner Checklist
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
              เช็กลิสต์อุปกรณ์จำเป็นสำหรับนักวิ่ง ก่อนออกสตาร์ท CHANGSUEK RUN 2027
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleSelectAll}
              className="px-3.5 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-xs font-bold text-[#5B20A8] transition-colors cursor-pointer"
            >
              เลือกทั้งหมด
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-gradient-to-br from-[#FAF8FE] via-white to-[#FFFDF7] rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-black uppercase text-[#5B20A8] tracking-wider">
                ความพร้อมของคุณ (Readiness Level)
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#24172F] mt-0.5">
                {progressPercentage === 100 ? (
                  <span className="text-emerald-600 flex items-center gap-2">
                    🎉 เตรียมตัวครบถ้วน 100% พร้อมวิ่งเต็มพิกัด!
                  </span>
                ) : progressPercentage >= 50 ? (
                  <span>👍 เตรียมพร้อมแล้ว {completedCount} จาก {totalItems} รายการ</span>
                ) : (
                  <span>🎒 เตรียมสัมภาระ {completedCount} จาก {totalItems} รายการ</span>
                )}
              </h3>
            </div>
            <div className="flex items-baseline gap-1 self-start sm:self-auto">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#5B20A8]">
                {progressPercentage}%
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase">เสร็จสิ้น</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-purple-100 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#5B20A8] via-[#FFC928] to-[#2EAD62] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'must-have', label: 'ของจำเป็นต้องมี' },
            { id: 'hydration', label: 'น้ำดื่ม & โภชนาการ' },
            { id: 'gear', label: 'อุปกรณ์วิ่ง' },
            { id: 'health', label: 'การปกป้องร่างกาย' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                filter === cat.id
                  ? 'bg-[#5B20A8] text-white border-[#5B20A8] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-200 hover:text-[#5B20A8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => toggleItem(item.id)}
                  className={`rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-[#FAF8FE] border-[#5B20A8]/40 shadow-xs'
                      : 'bg-white border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Custom Checkbox Toggle Button */}
                  <div className="mt-0.5 shrink-0 text-[#5B20A8]">
                    {isChecked ? (
                      <CheckCircle2 className="w-6 h-6 text-[#5B20A8] fill-[#5B20A8]/15" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-purple-400 transition-colors" />
                    )}
                  </div>

                  {/* Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-[#5B20A8]/10 text-[#5B20A8]'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm sm:text-base font-black transition-all ${
                          isChecked
                            ? 'text-gray-400 line-through'
                            : 'text-[#24172F]'
                        }`}
                      >
                        {item.name}
                      </h4>
                      {item.category === 'must-have' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 shrink-0">
                          สำคัญมาก
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isChecked ? 'text-gray-400' : 'text-gray-600 font-medium'
                      }`}
                    >
                      {item.description}
                    </p>

                    {item.tip && (
                      <div className="mt-2 text-[11px] text-amber-700 bg-amber-50/80 rounded-lg px-2.5 py-1 flex items-start gap-1.5 border border-amber-200/60">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item.tip}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Motivational Footer Note */}
        <div className="mt-8 p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-[#5B20A8] font-bold">
            💡 คำแนะนำ: บันทึกรายการของคุณไว้ในเครื่องนี้โดยอัตโนมัติ เพื่อนำมาเช็กซ้ำก่อนเดินทางในวันเสาร์ที่ 14 ก.พ. 2570
          </span>
          <span className="text-xs text-gray-500 font-mono font-bold">
            {completedCount} / {totalItems} READY
          </span>
        </div>

      </div>
    </section>
  );
};
