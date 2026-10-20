import React, { useEffect, useState } from 'react';
import { X, Check, Minus, Plus, UserPlus } from 'lucide-react';
import { RouteId } from '../types';
import { DogCharacter } from './brand/BrandCharacters';
import { PawIcon } from './brand/DogDecor';
import { saveRunnerProfile } from '../utils/runnerStorage';
import {
  ticketCategories,
  ticketById,
  isDogCategory,
  calcTicketTotal,
  formatBaht,
} from '../data/eventData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoute?: RouteId;
  initialExtraPeople?: number;
  initialExtraDogs?: number;
  onRegistrationSuccess?: () => void;
}

const accent: Record<RouteId, string> = {
  '10km': '#C9A6F5',
  '5km': '#FFD84D',
  '3km': '#7FDDB0',
  '1km': '#FFA66E',
};

const inputCls =
  'w-full px-4 py-2.5 rounded-2xl border-2 border-[#2A1450]/30 bg-white text-sm text-[#2A1450] placeholder-[#2A1450]/40 focus:outline-none focus:border-[#7B3FC6] focus:ring-4 focus:ring-[#7B3FC6]/15';
const labelCls = 'block text-xs font-bold text-[#2A1450] mb-1';

const Stepper: React.FC<{
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  icon: React.ReactNode;
  max?: number;
}> = ({ label, hint, value, onChange, icon, max = 9 }) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-10 h-10 rounded-xl bg-white border-2 border-[#2A1450] flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-bold text-[#2A1450]">{label}</div>
        <div className="text-xs font-semibold text-[#6B5A85]">{hint}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        aria-label={`ลด${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        className="w-9 h-9 rounded-full border-2 border-[#2A1450] bg-white flex items-center justify-center disabled:opacity-30 hover:bg-[#FFE48A] active:scale-90 transition"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span key={value} className="w-6 text-center font-display text-xl font-bold animate-pop">
        {value}
      </span>
      <button
        type="button"
        aria-label={`เพิ่ม${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 rounded-full border-2 border-[#2A1450] bg-[#FFC928] flex items-center justify-center disabled:opacity-30 hover:bg-[#FFD84D] active:scale-90 transition"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialRoute = '5km',
  initialExtraPeople = 0,
  initialExtraDogs = 0,
  onRegistrationSuccess,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<RouteId>(initialRoute);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [extraPeople, setExtraPeople] = useState(0);
  const [extraDogs, setExtraDogs] = useState(0);

  const [fullName, setFullName] = useState('');
  const [idCardOrPassport, setIdCardOrPassport] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [shirtSize, setShirtSize] = useState('L');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [extraRunnerNames, setExtraRunnerNames] = useState('');
  const [bibNumber, setBibNumber] = useState('');

  // Follow the ticket the visitor clicked on the page each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRoute(initialRoute);
      setStep(1);
      setExtraPeople(initialExtraPeople);
      setExtraDogs(initialExtraDogs);
    }
  }, [isOpen, initialRoute, initialExtraPeople, initialExtraDogs]);

  if (!isOpen) return null;

  const ticket = ticketById(selectedRoute);
  const isDog = isDogCategory(selectedRoute);
  const total = calcTicketTotal(selectedRoute, extraPeople, extraDogs);
  const dogCount = isDog ? 1 + extraDogs : 0;
  const peopleCount = isDog ? 1 + extraPeople : 1;

  const pickTicket = (id: RouteId) => {
    setSelectedRoute(id);
    if (!isDogCategory(id)) {
      setExtraPeople(0);
      setExtraDogs(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = { '10km': '10', '5km': '05', '3km': '03', '1km': '01' }[selectedRoute];
    const generatedBib = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    setBibNumber(generatedBib);

    saveRunnerProfile({
      fullName: fullName || 'นักวิ่งช้างศึก',
      idCardOrPassport,
      phone,
      email,
      emergencyPhone,
      routeId: selectedRoute,
      routeName: ticket.name,
      bibNumber: generatedBib,
      shirtSize,
      runningWithDog: isDog,
      dogBreed,
      dogName,
      extraPeople,
      extraDogs,
      extraRunnerNames,
      totalPrice: total,
      registrationStatus: 'REGISTERED',
      createdAt: new Date().toISOString(),
    });

    setStep(3);
    onRegistrationSuccess?.();
  };

  const steps = ['เลือกบัตร', 'ข้อมูลนักวิ่ง', 'รับ BIB'];

  const renderTicketOption = (id: RouteId) => {
    const t = ticketById(id);
    const on = selectedRoute === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => pickTicket(id)}
        aria-pressed={on}
        className={`text-left p-3.5 rounded-2xl border-[3px] transition-all ${
          on
            ? 'border-[#2A1450] shadow-[3px_4px_0_#2A1450] -translate-y-0.5'
            : 'border-[#2A1450]/25 hover:border-[#2A1450]/60'
        }`}
        style={{ background: on ? accent[id] : '#fff' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-3xl font-bold leading-none text-[#2A1450]">{t.distanceLabel}</span>
          <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
        </div>
        <div className="text-xs font-semibold text-[#2A1450]/80 mt-1">{t.baseLabel}</div>
        <div className="font-display text-lg font-bold text-[#2A1450] mt-0.5">
          {t.basePrice.toLocaleString('th-TH')} บาท
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-[#2A1450]/70 backdrop-blur-sm overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="สมัครเข้าร่วมงานวิ่ง"
        className="relative w-full max-w-xl my-8 bg-[#FFFDF5] text-[#2A1450] sticker overflow-hidden animate-pop"
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-[#FFC928] border-b-[3px] border-[#2A1450] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border-[3px] border-[#2A1450] flex items-center justify-center overflow-hidden">
              <DogCharacter size={44} isAnimated={false} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#7B3FC6]">CHANG SUEK RUN 2027</div>
              <h2 className="text-lg font-bold leading-tight">
                {step === 3 ? 'สมัครสำเร็จแล้ว!' : 'สมัครเข้าร่วมงานวิ่ง'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="w-9 h-9 rounded-full bg-white border-2 border-[#2A1450] flex items-center justify-center hover:rotate-90 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 px-6 py-3 border-b-2 border-dashed border-[#2A1450]/25 text-xs font-bold">
          {steps.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full border-2 border-[#2A1450] flex items-center justify-center ${
                      done ? 'bg-[#6FD9A8]' : active ? 'bg-[#FFC928]' : 'bg-white text-[#2A1450]/40'
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : n}
                  </span>
                  <span className={active || done ? '' : 'text-[#2A1450]/40'}>{label}</span>
                </div>
                {i < steps.length - 1 && <span className="w-6 h-0.5 bg-[#2A1450]/25" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="font-bold mb-2">🏃 วิ่งบุคคลทั่วไป</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {ticketCategories.filter((t) => t.group === 'individual').map((t) => renderTicketOption(t.id))}
            </div>

            <h3 className="font-bold mb-2">🐾 วิ่งคู่กับสัตว์เลี้ยง</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {ticketCategories.filter((t) => t.group === 'dog').map((t) => renderTicketOption(t.id))}
            </div>

            {isDog && (
              <div className="mb-4 p-4 rounded-2xl bg-[#DDF7EA] border-2 border-dashed border-[#2A1450]/40 animate-pop">
                <div className="text-sm font-bold">รวมแล้ว 1 คน + 1 น้องหมา อยากเพิ่มไหม?</div>
                <Stepper
                  label="เพิ่มคน"
                  hint={`+${ticket.addPersonPrice} บาท/คน`}
                  value={extraPeople}
                  onChange={setExtraPeople}
                  icon={<UserPlus className="w-5 h-5" />}
                />
                <div className="h-px bg-[#2A1450]/15" />
                <Stepper
                  label="เพิ่มน้องหมา"
                  hint={`+${ticket.addDogPrice} บาท/ตัว`}
                  value={extraDogs}
                  onChange={setExtraDogs}
                  icon={<PawIcon size={20} color="#2A1450" />}
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-[#2A1450]/15">
              <div>
                <div className="text-xs font-semibold text-[#6B5A85]">
                  {ticket.distanceLabel} · {peopleCount} คน{isDog ? ` + ${dogCount} น้องหมา` : ''}
                </div>
                <div key={total} className="font-display text-3xl font-bold animate-pop">
                  {formatBaht(total)}
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="btn-paw bg-[#FFC928] px-6 py-3 text-sm">
                ถัดไป
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="p-3 mb-4 rounded-2xl flex items-center justify-between text-sm border-2 border-[#2A1450]" style={{ background: accent[selectedRoute] }}>
              <div className="font-bold">
                {ticket.emoji} {ticket.name}
                <span className="block text-xs font-semibold opacity-80">
                  {peopleCount} คน{isDog ? ` + ${dogCount} น้องหมา` : ''} · {formatBaht(total)}
                </span>
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-xs font-bold underline">
                เปลี่ยนบัตร
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className={labelCls}>ชื่อ - นามสกุล *</label>
                <input type="text" required placeholder="เช่น สมชาย ใจดี" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>เบอร์โทรศัพท์ *</label>
                  <input type="tel" required placeholder="08x-xxx-xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>เบอร์ติดต่อฉุกเฉิน *</label>
                  <input type="tel" required placeholder="08x-xxx-xxxx" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>อีเมล *</label>
                  <input type="email" required placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>ไซส์เสื้อ *</label>
                  <select value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} className={inputCls}>
                    {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {extraPeople > 0 && (
                <div>
                  <label className={labelCls}>ชื่อผู้ร่วมวิ่งเพิ่ม ({extraPeople} คน)</label>
                  <textarea rows={2} placeholder="ชื่อ-นามสกุล และไซส์เสื้อ คนละบรรทัด" value={extraRunnerNames} onChange={(e) => setExtraRunnerNames(e.target.value)} className={inputCls} />
                </div>
              )}

              {isDog && (
                <div className="p-4 rounded-2xl bg-[#DDF7EA] border-2 border-dashed border-[#2A1450]/40 space-y-3">
                  <div className="font-bold text-sm flex items-center gap-2">
                    <PawIcon size={18} color="#2A1450" /> ข้อมูลน้องหมา ({dogCount} ตัว)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>ชื่อน้องหมา *</label>
                      <input type="text" required placeholder="เช่น ช้างน้อย" value={dogName} onChange={(e) => setDogName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>สายพันธุ์ *</label>
                      <input type="text" required placeholder="เช่น โกลเด้น" value={dogBreed} onChange={(e) => setDogBreed(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  {dogCount > 1 && (
                    <p className="text-xs font-semibold text-[#6B5A85]">
                      มีน้องหมามากกว่า 1 ตัว ใส่ชื่อทุกตัวคั่นด้วยเครื่องหมายจุลภาค
                    </p>
                  )}
                  <p className="text-xs font-semibold text-[#6B5A85]">
                    น้องหมาต้องใส่สายจูงตลอดเส้นทาง และนำสมุดวัคซีนมาในวันรับ Race Kit
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 text-sm font-bold text-[#6B5A85] hover:text-[#2A1450]">
                ย้อนกลับ
              </button>
              <button type="submit" className="btn-paw bg-[#FFC928] px-6 py-3 text-sm">
                ยืนยันสมัคร · {formatBaht(total)}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="p-6 text-center">
            <div className="relative p-6 mx-auto max-w-sm rounded-3xl bg-white border-[3px] border-[#2A1450] shadow-[5px_6px_0_#2A1450] mb-6 text-left animate-pop">
              <div className="flex items-center justify-between border-b-2 border-[#2A1450] pb-2 mb-3">
                <span className="text-[11px] font-bold text-[#7B3FC6]">CHANG SUEK RUN 2027</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-[#2A1450]" style={{ background: accent[selectedRoute] }}>
                  {ticket.distanceLabel}
                </span>
              </div>
              <div className="text-center my-3">
                <div className="text-xs font-bold text-[#6B5A85]">BIB NUMBER</div>
                <div className="font-display text-5xl font-bold tracking-wider">{bibNumber}</div>
              </div>
              <div className="pt-2 border-t-2 border-[#2A1450] flex items-center justify-between text-xs gap-2">
                <div>
                  <div className="font-bold">{fullName || 'นักวิ่งผู้รักสุขภาพ'}</div>
                  <div className="text-[#6B5A85]">
                    ไซส์ {shirtSize} · {formatBaht(total)}
                  </div>
                </div>
                {isDog && (
                  <div className="flex items-center gap-1 font-bold bg-[#DDF7EA] border-2 border-[#2A1450] px-2 py-1 rounded-full">
                    <PawIcon size={14} color="#2A1450" />
                    <span>{dogName || 'DOG'}</span>
                  </div>
                )}
              </div>
            </div>

            <h4 className="text-xl font-bold mb-1">ยินดีต้อนรับสู่ครอบครัวช้างศึกรัน!</h4>
            <p className="text-sm text-[#6B5A85] mb-5">
              บันทึกข้อมูลเรียบร้อยแล้ว เจ้าหน้าที่จะส่งอีเมลยืนยันพร้อมกำหนดการรับเสื้อและเบอร์วิ่ง
            </p>
            <button type="button" onClick={onClose} className="btn-paw bg-[#FFC928] px-8 py-3 text-sm">
              เสร็จสิ้น
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
