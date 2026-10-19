import React from 'react';
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

  return (
    <section id="highlights" className="py-12 sm:py-16 bg-[#FFFFFF] border-b border-purple-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching mockup */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-[#261042] tracking-tight">
            ไฮไลท์งาน
          </h2>
        </div>

        {/* 9 White Cards Grid matching mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group cursor-pointer hover:border-purple-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#6C2EB9] group-hover:bg-[#6C2EB9] group-hover:text-white transition-colors duration-200 mb-3">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-xs font-bold text-gray-800 leading-snug whitespace-pre-line">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
