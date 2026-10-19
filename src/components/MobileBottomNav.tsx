import React from 'react';
import { UserCheck, MapPin, UserPlus, Play, Calendar, Sparkles } from 'lucide-react';
import { getStoredRunnerProfile } from '../utils/runnerStorage';

interface MobileBottomNavProps {
  onOpenRegisterModal: () => void;
  onOpenRunnerCenter: () => void;
  onOpenSimulation: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenRegisterModal,
  onOpenRunnerCenter,
  onOpenSimulation,
}) => {
  const profile = getStoredRunnerProfile();

  return (
    <nav
      id="mobile-bottom-bar"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1 px-2 safe-bottom"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {/* 1. Center / BIB Dashboard */}
        <button
          onClick={onOpenRunnerCenter}
          className="flex flex-col items-center justify-center p-1.5 text-gray-600 hover:text-[#5B20A8] transition-colors relative min-h-[48px] cursor-pointer"
        >
          <div className="relative">
            <UserCheck className="w-5 h-5 text-[#5B20A8]" />
            {profile && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">
            {profile ? 'BIB ของฉัน' : 'ศูนย์นักวิ่ง'}
          </span>
        </button>

        {/* 2. Map & Landmarks */}
        <a
          href="#routes"
          className="flex flex-col items-center justify-center p-1.5 text-gray-600 hover:text-[#5B20A8] transition-colors min-h-[48px]"
        >
          <MapPin className="w-5 h-5 text-[#EF5350]" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">เส้นทาง</span>
        </a>

        {/* 3. Center CTA: Register or Quick Simulation */}
        <button
          onClick={profile ? onOpenRunnerCenter : onOpenRegisterModal}
          className="flex flex-col items-center justify-center -mt-5 p-2 rounded-2xl shadow-xl border-2 border-white transition-all transform active:scale-95 cursor-pointer bg-[#FFC928] hover:bg-[#F5B800] text-[#17151C] min-w-[56px] min-h-[56px]"
          aria-label={profile ? 'ดู BIB และศูนย์นักวิ่ง' : 'สมัครวิ่ง'}
        >
          {profile ? (
            <>
              <span className="text-xl leading-none">🐘</span>
              <span className="text-[9px] font-black uppercase tracking-tight mt-0.5">
                BIB #{profile.bibNumber.slice(-4)}
              </span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 text-[#17151C]" />
              <span className="text-[9px] font-black uppercase tracking-tight mt-0.5">
                สมัครวิ่ง
              </span>
            </>
          )}
        </button>

        {/* 4. Start Simulation */}
        <button
          onClick={onOpenSimulation}
          className="flex flex-col items-center justify-center p-1.5 text-gray-600 hover:text-[#5B20A8] transition-colors min-h-[48px] cursor-pointer"
        >
          <div className="relative">
            <Play className="w-5 h-5 text-[#FFC928] fill-[#FFC928]" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">จำลองวิ่ง</span>
        </button>

        {/* 5. Schedule */}
        <a
          href="#schedule"
          className="flex flex-col items-center justify-center p-1.5 text-gray-600 hover:text-[#5B20A8] transition-colors min-h-[48px]"
        >
          <Calendar className="w-5 h-5 text-[#2EAD62]" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">กำหนดการ</span>
        </a>
      </div>
    </nav>
  );
};
