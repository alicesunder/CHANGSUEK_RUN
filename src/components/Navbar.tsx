import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, UserCheck } from 'lucide-react';

interface NavbarProps {
  onOpenArtworkModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenRunnerCenter?: () => void;
  onEasterEggTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArtworkModal,
  onOpenRegisterModal,
  onOpenRunnerCenter,
  onEasterEggTrigger,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'TH' | 'EN'>('TH');
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Easter egg: Click logo 3 times
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 3) {
      if (onEasterEggTrigger) onEasterEggTrigger();
      setLogoClicks(0);
    }
  };

  const navLinks = [
    { label: 'หน้าแรก', href: '#hero', active: true },
    { label: 'รายละเอียดงาน', href: '#experience' },
    { label: 'ระยะวิ่ง', href: '#distances' },
    { label: 'เสื้อ & เหรียญ', href: '#merch-showcase' },
    { label: 'กำหนดการ', href: '#schedule' },
    { label: 'เส้นทางวิ่งสำรวจ (GPS)', href: '#routes' },
    { label: 'จุดบริการ', href: '#highlights' },
    { label: 'ที่พัก', href: '#hotels' },
    { label: 'ลีดเดอร์บอร์ด', href: '#leaderboard' },
    { label: 'สภาพอากาศ', href: '#weather-forecast' },
    { label: 'เช็กลิสต์', href: '#runner-checklist' },
    { label: 'FAQ', href: '#faq' },
    { label: 'ติดต่อเรา', href: '#footer' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#3B1763]/95 backdrop-blur-md shadow-lg border-b border-white/10 py-2.5'
          : 'bg-gradient-to-r from-[#3B1763] via-[#3F1A6C] to-[#3B1763] border-b border-white/10 py-3'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Official Brand Identity & Logo Image */}
          <a
            href="#hero"
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer transition-transform hover:scale-102 active:scale-98 select-none flex-shrink-0"
            title="CHANGSUEK RUN 2026 - เห็นช้างวิ่ง วิ่งตามช้าง"
          >
            <img
              src="/images/brand/changsuek-run-logo.png"
              alt="CHANGSUEK RUN"
              className="h-11 sm:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-[13px] font-bold px-2 xl:px-3 py-1.5 transition-all whitespace-nowrap rounded-lg ${
                  link.active
                    ? 'text-white font-black bg-white/10'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Language switch + Primary "สมัครวิ่ง" Yellow Button */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
            {/* Language Switch */}
            <div className="hidden sm:flex items-center text-xs font-bold text-white/70 tracking-wider">
              <button
                onClick={() => setActiveLang('TH')}
                className={`transition-colors cursor-pointer ${
                  activeLang === 'TH' ? 'text-white font-extrabold underline underline-offset-4 decoration-[#FFCC00]' : 'hover:text-white'
                }`}
              >
                TH
              </button>
              <span className="mx-1 text-white/40">|</span>
              <button
                onClick={() => setActiveLang('EN')}
                className={`transition-colors cursor-pointer ${
                  activeLang === 'EN' ? 'text-white font-extrabold underline underline-offset-4 decoration-[#FFCC00]' : 'hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Runner Center Dashboard Button */}
            {onOpenRunnerCenter && (
              <button
                onClick={onOpenRunnerCenter}
                className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-[13px] font-bold px-3.5 py-2 rounded-full border border-white/20 backdrop-blur-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <UserCheck className="w-4 h-4 text-[#FFCC00]" />
                <span>ศูนย์นักวิ่ง (BIB)</span>
              </button>
            )}

            {/* Mockup's Bright Yellow "สมัครวิ่ง" Button */}
            <button
              onClick={onOpenRegisterModal}
              className="bg-[#FFCC00] hover:bg-[#FFD633] text-[#17151C] text-xs sm:text-sm font-black px-4 sm:px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
            >
              สมัครวิ่ง
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#3B1763] border-b border-white/10 px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1.5">
            {onOpenRunnerCenter && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRunnerCenter();
                }}
                className="px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/30 mb-1"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>ศูนย์นักวิ่ง (MY BIB & CHECKLIST)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            )}

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                  link.active
                    ? 'bg-white/10 text-white font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </a>
            ))}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-white/60 font-bold">ภาษา / Language</span>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <button
                  onClick={() => setActiveLang('TH')}
                  className={`px-2 py-1 rounded ${activeLang === 'TH' ? 'bg-[#FFCC00] text-black' : 'bg-white/10'}`}
                >
                  ไทย
                </button>
                <button
                  onClick={() => setActiveLang('EN')}
                  className={`px-2 py-1 rounded ${activeLang === 'EN' ? 'bg-[#FFCC00] text-black' : 'bg-white/10'}`}
                >
                  English
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegisterModal();
              }}
              className="mt-3 w-full bg-[#FFCC00] hover:bg-[#FFD633] text-[#17151C] font-black text-sm py-2.5 rounded-full shadow-md text-center"
            >
              สมัครวิ่งทันที
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
