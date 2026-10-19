import React, { useState } from 'react';
import { X, Check, Award, Clock, MapPin, Droplets, Mountain, Heart, Shield, Sparkles, UserPlus } from 'lucide-react';
import { RouteId } from '../types';

interface DistanceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRouteToRegister: (route: RouteId) => void;
}

export const DistanceComparisonModal: React.FC<DistanceComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectRouteToRegister,
}) => {
  if (!isOpen) return null;

  const comparisonData = [
    {
      label: 'ระดับความเหมาะสม',
      icon: Heart,
      f3k: 'ผู้เริ่มต้น เด็ก ครอบครัว และสัตว์เลี้ยง',
      c5k: 'นักวิ่งที่ต้องการพัฒนาความเร็ว สุขภาพ',
      w10k: 'นักวิ่งสายผจญภัย วิ่งเทรล และคนรักสุนัข',
    },
    {
      label: 'เวลาปล่อยตัว (Start)',
      icon: Clock,
      f3k: '06:30 น.',
      c5k: '06:15 น.',
      w10k: '06:00 น.',
    },
    {
      label: 'เวลาคัทออฟ (Cut-off)',
      icon: Clock,
      f3k: '1 ชม. 15 นาที (ชิลมาก)',
      c5k: '1 ชม. 30 นาที',
      w10k: '2 ชม. 15 นาที',
    },
    {
      label: 'ความชันสะสม (Gain)',
      icon: Mountain,
      f3k: '+12 เมตร (ทางเรียบ)',
      c5k: '+18 เมตร (มีเนินป่าสนเบาๆ)',
      w10k: '+28 เมตร (เทรลหาดทราย & เนินดิน)',
    },
    {
      label: 'จุดบริการน้ำดื่ม',
      icon: Droplets,
      f3k: '1 จุด (กม. 1.5) + จุด Start/Finish',
      c5k: '2 จุด (กม. 2, 3.8) + Start/Finish',
      w10k: '4 จุด (กม. 2, 4.5, 7, 8.5) + Start/Finish',
    },
    {
      label: 'สภาพพื้นผิววิ่ง',
      icon: MapPin,
      f3k: 'ถนนลาดยาง 80% + หาดทรายแน่น 20%',
      c5k: 'ถนนลาดยาง 65% + ป่าชายเลน 35%',
      w10k: 'ทรายหาด 35% + ป่าสน 35% + ทางเรียบ 30%',
    },
    {
      label: 'การนำสุนัขเข้าร่วม',
      icon: Heart,
      f3k: 'ยินดีต้อนรับ (มีจุดน้ำสัตว์เลี้ยง)',
      c5k: 'ยินดีต้อนรับ (สายจูงมาตรฐาน)',
      w10k: 'ไฮไลต์ War Dog Trail (มีสัตวแพทย์ดูแล)',
    },
    {
      label: 'ของที่ได้รับใน Race Kit',
      icon: Award,
      f3k: 'เสื้อวิ่ง, เหรียญที่ระลึก, BIB, อาหารเช้า, ประกัน',
      c5k: 'เสื้อวิ่ง, เหรียญที่ระลึก, BIB ชิปจับเวลา, อาหาร, ประกัน',
      w10k: 'เสื้อวิ่ง, เหรียญพิเศษ, BIB ชิปจับเวลา, ผ้า Finisher, อาหาร, ประกัน',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border-2 border-[#EEE4FA] overflow-hidden my-6 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B3FC6] via-[#54239A] to-[#2EAD62] p-5 sm:p-6 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#FFC928] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DISTANCE COMPARISON</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">เปรียบเทียบระยะวิ่งทั้ง 3 ระยะ</h3>
            <p className="text-xs sm:text-sm text-white/80">
              เลือกสนามที่ตอบโจทย์ไลฟ์สไตล์และความสนุกของคุณมากที่สุด
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Distances Top Summary Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 bg-[#FAF9FC] border-b border-gray-100">
          {/* 3KM */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-[#2EAD62]/30 shadow-xs flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-[#DFF5E8] text-[#2EAD62]">
                ง่ายสำหรับทุกคน
              </span>
              <div className="text-xl sm:text-3xl font-black text-[#2EAD62] mt-1">3 KM</div>
              <div className="text-[11px] sm:text-xs font-bold text-gray-600">FUN RUN</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onSelectRouteToRegister('3km');
              }}
              className="mt-3 bg-[#2EAD62] hover:bg-[#259451] text-white text-xs font-black py-2 px-2 rounded-xl transition-all shadow cursor-pointer"
            >
              เลือกสมัคร 3 KM
            </button>
          </div>

          {/* 5KM */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-[#EF5350]/30 shadow-xs flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-red-50 text-[#EF5350]">
                ระดับปานกลาง
              </span>
              <div className="text-xl sm:text-3xl font-black text-[#EF5350] mt-1">5 KM</div>
              <div className="text-[11px] sm:text-xs font-bold text-gray-600">CHALLENGE RUN</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onSelectRouteToRegister('5km');
              }}
              className="mt-3 bg-[#EF5350] hover:bg-[#d94340] text-white text-xs font-black py-2 px-2 rounded-xl transition-all shadow cursor-pointer"
            >
              เลือกสมัคร 5 KM
            </button>
          </div>

          {/* 10KM */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-[#7B3FC6]/30 shadow-xs flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-[#EEE4FA] text-[#7B3FC6]">
                ท้าทาย & เทรล
              </span>
              <div className="text-xl sm:text-3xl font-black text-[#7B3FC6] mt-1">10 KM</div>
              <div className="text-[11px] sm:text-xs font-bold text-gray-600">WAR DOG TRAIL</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onSelectRouteToRegister('10km');
              }}
              className="mt-3 bg-[#7B3FC6] hover:bg-[#54239A] text-white text-xs font-black py-2 px-2 rounded-xl transition-all shadow cursor-pointer"
            >
              เลือกสมัคร 10 KM
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-500">
                <th className="py-2.5 px-3 font-black text-gray-800 w-1/4">เกณฑ์การเปรียบเทียบ</th>
                <th className="py-2.5 px-3 font-black text-[#2EAD62] w-1/4">3 KM (FUN RUN)</th>
                <th className="py-2.5 px-3 font-black text-[#EF5350] w-1/4">5 KM (CHALLENGE)</th>
                <th className="py-2.5 px-3 font-black text-[#7B3FC6] w-1/4">10 KM (WAR DOG)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparisonData.map((row, idx) => {
                const Icon = row.icon;
                return (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-gray-800 flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-[#7B3FC6] flex-shrink-0" />
                      <span>{row.label}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{row.f3k}</td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{row.c5k}</td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{row.w10k}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2EAD62]" />
            <span>ทุกระยะมีประกันอุบัติเหตุและทีมแพทย์กู้ชีพคอยดูแล 100%</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
