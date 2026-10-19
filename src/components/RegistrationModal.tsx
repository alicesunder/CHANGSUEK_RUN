import React, { useState } from 'react';
import { X, Check, Award, Dog, Heart, Calendar, MapPin, Download, AlertCircle } from 'lucide-react';
import { RouteId } from '../types';
import { ElephantCharacter } from './brand/BrandCharacters';
import { saveRunnerProfile } from '../utils/runnerStorage';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoute?: RouteId;
  onRegistrationSuccess?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialRoute = '3km',
  onRegistrationSuccess,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<RouteId>(initialRoute);
  const [selectedTicket, setSelectedTicket] = useState('5km-person');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [idCardOrPassport, setIdCardOrPassport] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [shirtSize, setShirtSize] = useState('L');
  const [runningWithDog, setRunningWithDog] = useState(false);
  const [dogBreed, setDogBreed] = useState('');
  const [bibNumber, setBibNumber] = useState('27088');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // generate random BIB
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = selectedRoute === '10km' ? '10' : selectedRoute === '5km' ? '05' : '03';
    const generatedBib = `${prefix}${randomNum}`;
    setBibNumber(generatedBib);

    // Save to Runner Storage (localStorage)
    const routeInfo = getRouteDetails(selectedRoute);
    saveRunnerProfile({
      fullName: fullName || 'นักวิ่งช้างศึก',
      idCardOrPassport,
      phone,
      email,
      emergencyPhone,
      routeId: selectedRoute,
      routeName: routeInfo.title,
      bibNumber: generatedBib,
      shirtSize,
      runningWithDog,
      dogBreed,
      registrationStatus: 'REGISTERED',
      createdAt: new Date().toISOString(),
    });

    setStep(3);
    setSubmitted(true);
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }
  };

  const getRouteDetails = (id: RouteId) => {
    switch (id) {
      case '10km':
        return {
          title: '10 KM WAR DOG TRAIL',
          color: '#7B3FC6',
          badgeBg: 'bg-[#EEE4FA] text-[#54239A]',
          price: '890 บาท',
          survey: 'รังวัดจริง 10.52 กม.',
        };
      case '5km':
        return {
          title: '5 KM CHALLENGE RUN',
          color: '#EF5350',
          badgeBg: 'bg-red-50 text-red-600',
          price: '690 บาท',
          survey: 'รังวัดจริง 5.20 กม.',
        };
      case '3km':
      default:
        return {
          title: '3 KM FUN RUN',
          color: '#2EAD62',
          badgeBg: 'bg-[#DFF5E8] text-[#2EAD62]',
          price: '890 บาท',
          survey: 'รังวัดจริง 4.08 กม.',
        };
    }
  };

  const currentDetails = getRouteDetails(selectedRoute);

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-[#17151C]/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#FFFFFF] dark:bg-[#180E28] text-[#17151C] dark:text-[#F3F0F9] rounded-3xl shadow-2xl border border-[#EEE4FA] dark:border-[#3B2158] overflow-hidden">
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#7B3FC6] via-[#54239A] to-[#24172F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ElephantCharacter size={32} isAnimated={false} showBib={false} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFC928]">
                CHANG SUEK RUN 2027
              </span>
              <h2 className="text-lg font-black leading-tight">
                {step === 3 ? '🎉 ลงทะเบียนสำเร็จ!' : 'แบบฟอร์มสมัครเข้าร่วมแข่งขัน'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#FAF9FC] dark:bg-[#1E1233] border-b border-[#EEE4FA] dark:border-[#3B2158] text-xs font-bold text-[#6F6878] dark:text-[#A69BB5]">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#7B3FC6] dark:text-[#C59BFF]' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#7B3FC6] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>1</span>
            <span>เลือกระยะวิ่ง</span>
          </div>
          <div className="h-0.5 w-8 bg-[#E5E0EE] dark:bg-[#3B2158]" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#7B3FC6] dark:text-[#C59BFF]' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#7B3FC6] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>2</span>
            <span>ข้อมูลนักวิ่ง</span>
          </div>
          <div className="h-0.5 w-8 bg-[#E5E0EE] dark:bg-[#3B2158]" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#2EAD62]' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#2EAD62] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>3</span>
            <span>บัตรวิ่ง (BIB)</span>
          </div>
        </div>

        {/* Step 1: Select Distance */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-base font-bold text-[#17151C] mb-4">
              เลือกบัตรวิ่งที่ใช่สำหรับคุณและน้องหมา 🐾
            </h3>

            <p className="text-xs text-[#6F6878] mb-4">หมวดบุคคลทั่วไป 5 / 10 กม. • หมวดวิ่งกับสัตว์เลี้ยง 1 / 3 กม.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { id: '5km-person', route: '5km' as RouteId, title: '5 กม. บุคคลทั่วไป', desc: 'สำหรับนักวิ่งเดี่ยว ระยะ 5 กิโลเมตร', price: '690 บาท', note: 'ราคาปกติ 790 บาท', emoji: '🏃', color: 'border-[#7B3FC6] bg-[#EEE4FA]/50' },
                { id: '10km-person', route: '10km' as RouteId, title: '10 กม. บุคคลทั่วไป', desc: 'สำหรับนักวิ่งเดี่ยว ระยะ 10 กิโลเมตร', price: '890 บาท', note: 'บุคคลทั่วไป', emoji: '🏃‍♀️', color: 'border-[#F2C94C] bg-[#FFF8D9]/60' },
                { id: 'dog1-pair', route: '3km' as RouteId, title: 'Dog 1 กม. • คู่หู 1:1', desc: 'ผู้ดูแล 1 คน + น้องหมา 1 ตัว', price: '890 บาท', note: 'DOG RUN', emoji: '🐕', color: 'border-[#FF9A76] bg-[#FFF0E9]/70' },
                { id: 'dog3-pair', route: '3km' as RouteId, title: 'Dog 3 กม. • คู่หู 1:1', desc: 'ผู้ดูแล 1 คน + น้องหมา 1 ตัว', price: '890 บาท', note: 'DOG RUN', emoji: '🐕‍🦺', color: 'border-[#FF9A76] bg-[#FFF0E9]/70' },
                { id: 'dog1-person', route: '3km' as RouteId, title: 'Dog 1 กม. • เพิ่มคน', desc: 'เพิ่มผู้ร่วมวิ่งในทีม', price: '+450 บาท/คน', note: 'ตัวเลือกเสริม', emoji: '👟', color: 'border-[#E5E0EE] bg-white' },
                { id: 'dog1-dog', route: '3km' as RouteId, title: 'Dog 1 กม. • เพิ่มสุนัข', desc: 'เพิ่มสมาชิกสี่ขาในทีม', price: '+250 บาท/ตัว', note: 'ตัวเลือกเสริม', emoji: '🐾', color: 'border-[#E5E0EE] bg-white' },
                { id: 'dog3-person', route: '3km' as RouteId, title: 'Dog 3 กม. • เพิ่มคน', desc: 'เพิ่มผู้ร่วมวิ่งในทีม', price: '+500 บาท/คน', note: 'ตัวเลือกเสริม', emoji: '👟', color: 'border-[#E5E0EE] bg-white' },
                { id: 'dog3-dog', route: '3km' as RouteId, title: 'Dog 3 กม. • เพิ่มสุนัข', desc: 'เพิ่มสมาชิกสี่ขาในทีม', price: '+300 บาท/ตัว', note: 'ตัวเลือกเสริม', emoji: '🐾', color: 'border-[#E5E0EE] bg-white' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedTicket(item.id); setSelectedRoute(item.route); }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTicket === item.id
                      ? 'bg-white border-[#8B43D7] ring-2 ring-offset-2 ring-[#7B3FC6] ring-offset-[#180E28] scale-[1.01] shadow-lg'
                      : 'border-[#E2D8EA] bg-[#241432] hover:border-[#FF9A76] hover:bg-[#2B1740] dark:border-[#E2D8EA] dark:bg-[#241432] dark:hover:bg-[#2B1740]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-black text-sm sm:text-base ${selectedTicket === item.id ? 'text-[#241432]' : 'text-white dark:text-white'}`}><span className="mr-1.5">{item.emoji}</span>{item.title}</span>
                    <span className={`font-extrabold text-sm whitespace-nowrap ${selectedTicket === item.id ? 'text-[#7430C3]' : 'text-[#B879FF] dark:text-[#B879FF]'}`}>{item.price}</span>
                  </div>
                  <p className={`text-xs mb-2 ${selectedTicket === item.id ? 'text-[#62566D]' : 'text-[#C9BED4] dark:text-[#C9BED4]'}`}>{item.desc}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${selectedTicket === item.id ? 'bg-[#F0E3FF] text-[#59258B] border-[#E3D0FA]' : 'bg-[#39254B] text-[#E7DDF0] border-[#59436A]'}`}>{item.id === '5km-person' ? <><span className="line-through opacity-70">ราคาปกติ 790 บาท</span><span className="text-[#2EAD62]">• ราคาพิเศษ</span></> : item.note}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-[#7B3FC6] hover:bg-[#54239A] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>ถัดไป: กรอกข้อมูลนักวิ่ง</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fill Personal Info */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Selected Route Summary Banner */}
            <div className="p-3 mb-4 rounded-xl bg-[#EEE4FA] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#54239A]">ระยะที่เลือก: </span>
                <span className="font-black text-[#17151C]">{({ '5km-person': '5 กม. บุคคลทั่วไป', '10km-person': '10 กม. บุคคลทั่วไป', 'dog1-pair': 'Dog 1 กม. 1:1', 'dog3-pair': 'Dog 3 กม. 1:1', 'dog1-person': 'Dog 1 กม. เพิ่มคน', 'dog1-dog': 'Dog 1 กม. เพิ่มสุนัข', 'dog3-person': 'Dog 3 กม. เพิ่มคน', 'dog3-dog': 'Dog 3 กม. เพิ่มสุนัข' } as Record<string, string>)[selectedTicket] || currentDetails.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#7B3FC6] underline"
              >
                เปลี่ยนระยะ
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#17151C] dark:text-purple-200 mb-1">ชื่อ - นามสกุล *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย ใจดี"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-purple-900/60 bg-white dark:bg-[#201235] text-sm text-[#17151C] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7B3FC6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17151C] dark:text-purple-200 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08x-xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-purple-900/60 bg-white dark:bg-[#201235] text-sm text-[#17151C] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7B3FC6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17151C] dark:text-purple-200 mb-1">เบอร์ติดต่อฉุกเฉิน *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08x-xxx-xxxx"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-purple-900/60 bg-white dark:bg-[#201235] text-sm text-[#17151C] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7B3FC6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17151C] dark:text-purple-200 mb-1">อีเมลติดต่อ *</label>
                  <input
                    type="email"
                    required
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-purple-900/60 bg-white dark:bg-[#201235] text-sm text-[#17151C] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7B3FC6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17151C] dark:text-purple-200 mb-1">ไซส์เสื้อวิ่งที่ระลึก *</label>
                  <select
                    value={shirtSize}
                    onChange={(e) => setShirtSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-purple-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B3FC6] bg-white dark:bg-[#201235] text-[#17151C] dark:text-white"
                  >
                    <option value="XS">XS (รอบอก 34 นิ้ว)</option>
                    <option value="S">S (รอบอก 36 นิ้ว)</option>
                    <option value="M">M (รอบอก 38 นิ้ว)</option>
                    <option value="L">L (รอบอก 40 นิ้ว)</option>
                    <option value="XL">XL (รอบอก 42 นิ้ว)</option>
                    <option value="2XL">2XL (รอบอก 44 นิ้ว)</option>
                    <option value="3XL">3XL (รอบอก 48 นิ้ว)</option>
                  </select>
                </div>
              </div>

              {/* Running with Pet Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#DFF5E8]/40 border border-[#2EAD62]/30">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={runningWithDog}
                    onChange={(e) => setRunningWithDog(e.target.checked)}
                    className="w-4 h-4 text-[#2EAD62] rounded focus:ring-[#2EAD62]"
                  />
                  <div className="flex items-center gap-2">
                    <Dog className="w-4 h-4 text-[#2EAD62]" />
                    <span className="text-xs font-bold text-[#17151C]">
                      พาสุนัข / สัตว์เลี้ยงมาร่วมวิ่งด้วย (ฟรี ไม่มีค่าใช้จ่ายเพิ่ม)
                    </span>
                  </div>
                </label>
                {runningWithDog && (
                  <div className="mt-2 pl-6">
                    <input
                      type="text"
                      placeholder="ระบุสายพันธุ์และชื่อน้องหมา เช่น โกลเด้น ชื่อช้างน้อย"
                      value={dogBreed}
                      onChange={(e) => setDogBreed(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#2EAD62]"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#FFC928] hover:bg-[#F5B800] text-[#17151C] font-black text-sm shadow-md transition-all"
              >
                ยืนยันการสมัคร & รับ BIB
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Confirmation & Digital BIB Card */}
        {step === 3 && (
          <div className="p-6 text-center">
            {/* Digital BIB Card Preview */}
            <div className="relative p-6 mx-auto max-w-sm rounded-3xl bg-white border-4 border-[#17151C] shadow-2xl overflow-hidden mb-6 text-left">
              {/* Corner Holes */}
              <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-[#FAF9FC] border-2 border-[#17151C]" />
              <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-[#FAF9FC] border-2 border-[#17151C]" />
              <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full bg-[#FAF9FC] border-2 border-[#17151C]" />
              <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-[#FAF9FC] border-2 border-[#17151C]" />

              <div className="flex items-center justify-between border-b-2 border-[#17151C] pb-2 mb-3">
                <span className="text-[10px] font-black text-[#7B3FC6]">CHANG SUEK RUN 2027</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFC928] text-[#17151C]">
                  {currentDetails.title}
                </span>
              </div>

              <div className="text-center my-3">
                <div className="text-xs text-gray-500 font-bold">BIB NUMBER</div>
                <div className="font-mono text-5xl font-black tracking-wider text-[#17151C]">
                  {bibNumber}
                </div>
              </div>

              <div className="pt-2 border-t-2 border-[#17151C] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#17151C]">{fullName || 'นักวิ่งผู้รักสุขภาพ'}</div>
                  <div className="text-[11px] text-gray-500">ไซส์เสื้อ: {shirtSize}</div>
                </div>
                {runningWithDog && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#2EAD62] bg-[#DFF5E8] px-2 py-1 rounded-md">
                    <Dog className="w-3.5 h-3.5" />
                    <span>DOG RUNNER</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-black text-[#17151C] mb-1">
                ยินดีต้อนรับสู่ครอบครัวช้างศึกรัน 2027!
              </h4>
              <p className="text-xs text-[#6F6878]">
                ระบบได้บันทึกข้อมูลการสมัครของคุณเรียบร้อยแล้ว เจ้าหน้าที่จะส่งอีเมลยืนยันพร้อมกำหนดการรับเสื้อและเบอร์วิ่งอย่างเป็นทางการ
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#7B3FC6] text-white font-bold text-sm shadow hover:bg-[#54239A] transition-all"
              >
                เสร็จสิ้น & กลับสู่หน้าแรก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
