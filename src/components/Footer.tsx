import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUp, Send, Check } from 'lucide-react';

interface FooterProps {
  onOpenArtworkModal: () => void;
  onOpenRegisterModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArtworkModal, onOpenRegisterModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#17092B] text-white pt-16 pb-10 border-t border-white/10 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Cursive Signature (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <img
              src="/images/brand/changsuek-run-logo.png"
              alt="CHANGSUEK RUN"
              className="h-16 w-auto object-contain mb-4 select-none"
              referrerPolicy="no-referrer"
            />
            
            <p className="text-xs text-purple-200/80 leading-relaxed mb-4 max-w-sm">
              งานวิ่งประวัติศาสตร์ ณ ค่ายพระราม 6 ชายหาดชะอำ-เพชรบุรี ก้าวไปด้วยกันเพื่อสุขภาพ รอยยิ้ม และการอนุรักษ์ธรรมชาติ
            </p>

            {/* Handwritten cursive script matching mockup */}
            <div className="text-sm font-serif italic text-[#FFCC00] tracking-wider mt-1">
              “Run Together a Brighter Tomorrow”
            </div>
          </div>

          {/* Column 2: ลิงก์ด่วน (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              ลิงก์ด่วน
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-semibold">
              <li>
                <a href="#hero" className="hover:text-[#FFCC00] transition-colors">หน้าแรก</a>
              </li>
              <li>
                <a href="#inspiration" className="hover:text-[#FFCC00] transition-colors">รายละเอียดงาน</a>
              </li>
              <li>
                <a href="#distances" className="hover:text-[#FFCC00] transition-colors">ระยะวิ่ง (3K / 5K / 10K / 21K)</a>
              </li>
              <li>
                <a href="#routes" className="hover:text-[#FFCC00] transition-colors">เส้นทางวิ่ง & จุดบริการ</a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-[#FFCC00] transition-colors">กำหนดการวันแข่งขัน</a>
              </li>
              <li>
                <a href="#hotels" className="hover:text-[#FFCC00] transition-colors">ที่พักใกล้สถานที่จัดงาน</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#FFCC00] transition-colors">คำถามที่พบบ่อย (FAQ)</a>
              </li>
            </ul>
          </div>

          {/* Column 3: ติดต่อเรา (2.5 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              ติดต่อเรา
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFCC00] flex-shrink-0 mt-0.5" />
                <span>ค่ายพระราม 6 อ.ชะอำ จ.เพชรบุรี</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                <span>032-471-234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                <span>contact@changsuekrun.com</span>
              </div>

              {/* Social icons */}
              <div className="pt-2 flex items-center gap-2.5 text-white/80">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFCC00] hover:text-black transition-colors cursor-pointer text-xs font-black">
                  FB
                </span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFCC00] hover:text-black transition-colors cursor-pointer text-xs font-black">
                  IG
                </span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFCC00] hover:text-black transition-colors cursor-pointer text-xs font-black">
                  LINE
                </span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFCC00] hover:text-black transition-colors cursor-pointer text-xs font-black">
                  YT
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: ติดตามข่าวสาร (2.5 cols) matching mockup */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">
              ติดตามข่าวสาร
            </h4>
            <p className="text-xs text-white/60 mb-3">
              รับการแจ้งเตือนสิทธิพิเศษและการเปิดรับสมัคร
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center mb-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมลของคุณ..."
                className="w-full pl-3.5 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-8 h-8 rounded-full bg-[#FFCC00] hover:bg-[#FFD633] text-black flex items-center justify-center shadow-md transition-colors cursor-pointer"
                title="ส่ง"
              >
                {subscribed ? <Check className="w-4 h-4 text-black" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 font-bold mb-2">
                ✓ ลงทะเบียนรับข่าวสารเรียบร้อยแล้ว
              </p>
            )}

            <div className="text-xs font-black text-[#FFCC00] tracking-wider">
              #CHANGSUEKRUN #เห็นช้างวิ่งวิ่งตามช้าง
            </div>
          </div>

        </div>

        {/* Bottom copyright row matching mockup */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <div>
            © 2026 CHANGSUEK RUN. All rights reserved. | <span className="text-white/70">เห็นช้างวิ่ง วิ่งตามช้าง</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <span>กลับขึ้นด้านบน</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
