import React, { useState, useMemo } from 'react';
import { faqData } from '../data/eventData';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
  });

  const categories = [
    { id: 'all', label: 'คำถามทั้งหมด' },
    { id: 'general', label: 'ทั่วไป & กิจกรรม' },
    { id: 'pet', label: 'การพาสุนัขวิ่ง' },
    { id: 'routes', label: 'เส้นทาง & Cut-off' },
    { id: 'transport', label: 'ที่จอดรถ & การเดินทาง' },
    { id: 'race_pack', label: 'ของที่ระลึก & รับบิบ' },
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="faq" className="py-16 bg-white border-b border-[#ECEAF0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-[#6F35B5] uppercase bg-[#F3EDF9] px-3.5 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#18151D] mt-2">
            คำถามที่พบบ่อย (FAQ)
          </h2>
          <p className="text-sm sm:text-base text-[#6F6A76] mt-2">
            รวบรวมข้อสงสัยเกี่ยวกับการแข่งขัน สุนัขร่วมวิ่ง ที่จอดรถ และของที่ระลึก
          </p>
        </div>

        {/* Search & Category filter */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6F6A76]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาคำถาม เช่น สุนัข, ที่จอดรถ, เหรียญรางวัล, เสื้อ..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#ECEAF0] bg-[#FAF9FC] text-sm text-[#18151D] focus:outline-none focus:ring-2 focus:ring-[#8C4DDB]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#6F35B5] text-white shadow-sm'
                    : 'bg-[#FAF9FC] text-[#6F6A76] hover:bg-[#ECEAF0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions */}
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#ECEAF0] bg-[#FAF9FC] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/80 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#18151D]">
                    {item.question}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-white border border-[#ECEAF0] flex items-center justify-center flex-shrink-0 text-[#6F35B5]">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6F6A76] leading-relaxed border-t border-[#ECEAF0]/60 bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional help query */}
        <div className="mt-8 text-center text-xs text-[#6F6A76]">
          มีคำถามเพิ่มเติมที่ไม่มีในนี้?{' '}
          <a href="#contact" className="text-[#6F35B5] font-bold hover:underline">
            ติดต่อทีมงานผู้จัดได้โดยตรง
          </a>
        </div>

      </div>
    </section>
  );
};
