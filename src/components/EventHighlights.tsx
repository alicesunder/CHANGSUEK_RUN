import React from 'react';
import { motion } from 'motion/react';
import { Award, Mountain, Gift, Shirt, Coffee, ShieldAlert, Camera, Users, Dog } from 'lucide-react';

export const EventHighlights: React.FC = () => {
  const highlights = [
    {
      id: 1,
      icon: Award,
      title: 'ประสบการณ์\nงานวิ่งมืออาชีพ',
    },
    {
      id: 2,
      icon: Mountain,
      title: 'เส้นทางสวย\nธรรมชาติ',
    },
    {
      id: 3,
      icon: Gift,
      title: 'เหรียญรางวัล\nสุดพิเศษ',
    },
    {
      id: 4,
      icon: Shirt,
      title: 'เสื้อวิ่งสุดเท่',
    },
    {
      id: 5,
      icon: Coffee,
      title: 'จุดบริการน้ำ\nและอาหาร',
    },
    {
      id: 6,
      icon: ShieldAlert,
      title: 'ทีมแพทย์\nดูแลตลอดงาน',
    },
    {
      id: 7,
      icon: Camera,
      title: 'จุดถ่ายรูป\nสุดประทับใจ',
    },
    {
      id: 8,
      icon: Users,
      title: 'เหมาะสำหรับ\nทุกครอบครัว',
    },
    {
      id: 9,
      icon: Dog,
      title: 'เป็นมิตรกับ\nสัตว์เลี้ยง',
    },
  ];

  const palette = ['#C9A6F5', '#7FDDB0', '#FFD84D', '#FFA66E', '#8ED8F8', '#FF9EBB', '#B7E36B', '#C9A6F5', '#7FDDB0'];

  return (
    <section id="highlights" className="py-14 sm:py-20 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2A1450]">ไฮไลท์งาน</h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-[#4B2D78]">ทำไมต้องวิ่งกับช้างศึกรัน</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-5">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: i * 0.06 }}
                whileHover={{ y: -10, rotate: i % 2 ? 4 : -4, scale: 1.06 }}
                className="bg-white rounded-[24px] p-4 sm:p-5 border-[3px] border-white shadow-[0_14px_28px_-14px_rgba(75,45,120,.5)] flex flex-col items-center text-center cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[#2A1450] mb-3 animate-boing"
                  style={{ background: palette[i], animationDelay: `${i * 0.18}s` }}
                >
                  <Icon className="w-7 h-7 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2A1450] leading-snug whitespace-pre-line">
                  {item.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
