import React, { useRef } from 'react';
import { Download, Share2, Printer, CheckCircle, Dog, Sparkles } from 'lucide-react';
import { RunnerProfile } from '../utils/runnerStorage';

interface RunnerBibCardProps {
  profile: RunnerProfile;
  onOpenSimulation?: () => void;
  className?: string;
}

export const RunnerBibCard: React.FC<RunnerBibCardProps> = ({
  profile,
  onOpenSimulation,
  className = '',
}) => {
  const bibCardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `ฉันสมัคร CHANGSUEK RUN 2027 เรียบร้อยแล้ว! หมายเลข BIB #${profile.bibNumber} ระยะ ${profile.routeName} ร่วมวิ่งด้วยกันนะ! #เห็นช้างวิ่งวิ่งตามช้าง`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CHANGSUEK RUN 2027 BIB',
          text,
          url: window.location.href,
        });
      } catch {
        // Fallback copy
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('คัดลอกข้อความและลิงก์สำหรับแชร์เรียบร้อยแล้ว!');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Outer Printable BIB Canvas */}
      <div
        ref={bibCardRef}
        className="relative bg-gradient-to-b from-white via-[#FCFAFF] to-[#F5EEFF] rounded-[28px] border-4 border-[#3D176C] p-6 sm:p-7 shadow-2xl overflow-hidden printable-bib"
      >
        {/* 4 Corner Pin Holes (Classic Marathons style) */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-[#FAF9FC] border-2 border-[#3D176C] shadow-inner" />
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-[#FAF9FC] border-2 border-[#3D176C] shadow-inner" />
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-[#FAF9FC] border-2 border-[#3D176C] shadow-inner" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-[#FAF9FC] border-2 border-[#3D176C] shadow-inner" />

        {/* Top Header Strip */}
        <div className="flex items-center justify-between border-b-2 border-[#3D176C]/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐘</span>
            <div>
              <span className="block text-xs font-black tracking-widest text-[#5B20A8] uppercase">
                CHANGSUEK RUN 2027
              </span>
              <span className="block text-[10px] text-gray-500 font-semibold">
                เห็นช้างวิ่ง วิ่งตามช้าง • ค่ายนเรศวร
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[#FFC928] text-[#17151C] shadow-xs">
              {profile.routeName}
            </span>
            <span className="block text-[9px] text-gray-400 font-bold uppercase mt-0.5">
              OFFICIAL BIB (PREVIEW)
            </span>
          </div>
        </div>

        {/* Giant BIB Number */}
        <div className="text-center my-4 py-2 bg-white/70 rounded-2xl border border-purple-100 shadow-2xs">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#5B20A8]">
            RACE NUMBER / หมายเลขประจำตัว
          </div>
          <div className="font-mono text-5xl sm:text-6xl font-black tracking-wider text-[#1F1035] my-1">
            {profile.bibNumber}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>สถานะ: ลงทะเบียนสำเร็จ (REGISTERED)</span>
          </div>
        </div>

        {/* Runner Metadata Bottom Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t-2 border-[#3D176C]/80 text-xs">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">ชื่อ-นามสกุล / Name</div>
            <div className="font-black text-[#1F1035] truncate text-sm">
              {profile.fullName || 'นักวิ่งช้างศึก'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">ไซส์เสื้อ / Shirt Size</div>
            <div className="font-bold text-[#1F1035]">{profile.shirtSize || 'L'}</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase">วันที่แข่งขัน / Race Day</div>
            <div className="font-bold text-[#5B20A8]">15 กุมภาพันธ์ 2570</div>
          </div>
        </div>

        {/* Dog Runner Badge (if applicable) */}
        {profile.runningWithDog && (
          <div className="mt-3.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Dog className="w-4 h-4 text-emerald-600" />
              <span>DOG RUNNER PASS: {profile.dogBreed || 'เพื่อนซี้สี่ขา'}</span>
            </div>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
              ตรวจสุขภาพผ่าน
            </span>
          </div>
        )}

        {/* Barcode / QR decorative footer */}
        <div className="mt-4 pt-3 border-t border-dashed border-gray-300 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>CSR-2027-{profile.routeId.toUpperCase()}-{profile.bibNumber}</span>
          <span className="flex items-center gap-1 text-[#5B20A8] font-bold">
            <Sparkles className="w-3 h-3 text-[#FFC928]" />
            <span>RUN FOR A BRIGHTER TOMORROW</span>
          </span>
        </div>
      </div>

      {/* Action Buttons: View, Download/Print, Share, Simulate */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-[#5B20A8] border border-purple-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์ / บันทึก BIB</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#5B20A8] hover:bg-[#4A188A] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>แชร์ BIB ของคุณ</span>
        </button>

        {onOpenSimulation && (
          <button
            onClick={onOpenSimulation}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FFC928] hover:bg-[#F5B800] text-[#17151C] font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>▶ จำลองเส้นทาง</span>
          </button>
        )}
      </div>
    </div>
  );
};
