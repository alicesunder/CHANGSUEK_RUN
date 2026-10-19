import { RouteId } from '../types';

export interface RunnerProfile {
  fullName: string;
  idCardOrPassport?: string;
  phone: string;
  email: string;
  emergencyPhone: string;
  routeId: RouteId;
  routeName: string;
  bibNumber: string;
  shirtSize: string;
  runningWithDog: boolean;
  dogBreed?: string;
  registrationStatus: 'REGISTERED' | 'CONFIRMED' | 'CHECKED_IN';
  createdAt: string;
}

export interface RunnerChecklistItem {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  category: 'prep' | 'kit' | 'race_day';
}

export const RUNNER_PROFILE_STORAGE_KEY = 'changsuek_runner_profile';
export const RUNNER_CHECKLIST_STORAGE_KEY = 'changsuek_runner_checklist';
export const ROUTE_SIMULATION_STORAGE_KEY = 'changsuek_route_simulation_state';

export const DEFAULT_CHECKLIST_ITEMS: RunnerChecklistItem[] = [
  { id: 'c1', label: 'ลงทะเบียนสมัครวิ่งเรียบร้อย', description: 'ยืนยันข้อมูลและได้รับหมายเลข BIB แล้ว', completed: true, category: 'prep' },
  { id: 'c2', label: 'ตรวจสอบและยืนยันหมายเลข BIB', description: 'จดจำหรือบันทึกภาพ BIB ไว้ในโทรศัพท์', completed: true, category: 'prep' },
  { id: 'c3', label: 'ตรวจสอบไซส์เสื้อวิ่งและจุดรับ Race Kit', description: 'จุดรับ Race Kit ณ หน้าหาดโรงแรม Sea Sand Sun', completed: false, category: 'kit' },
  { id: 'c4', label: 'ตรวจสอบจุดจอดรถและเส้นทางเดินทาง', description: 'ลานจอดรถค่ายนเรศวร 800+ คัน', completed: false, category: 'prep' },
  { id: 'c5', label: 'จำลองเส้นทางวิ่งเสมือนจริง (Start Simulation)', description: 'ศึกษาจุดบริการน้ำดื่มและทางเลี้ยวสำคัญ', completed: false, category: 'prep' },
  { id: 'c6', label: 'ตรวจสอบสภาพอากาศและทิศทางลม', description: 'เตรียมแว่นกันแดด ครีมกันแดด และหมวก', completed: false, category: 'prep' },
  { id: 'c7', label: 'ทบทวนกำหนดการวันแข่งขัน (Race Schedule)', description: 'ปล่อยตัวตรงเวลาตามระยะทาง', completed: false, category: 'race_day' },
  { id: 'c8', label: 'ตรวจสอบเบอร์ติดต่อฉุกเฉินและหน่วยแพทย์', description: 'เบอร์ศูนย์อำนวยการและกู้ชีพค่ายนเรศวร', completed: false, category: 'race_day' },
  { id: 'c9', label: 'เตรียมสายจูงและอุปกรณ์สำหรับสัตว์เลี้ยง (กรณีมีน้องหมา)', description: 'สายจูง ชามน้ำพับได้ ถุงเก็บมูล', completed: false, category: 'kit' },
  { id: 'c10', label: 'พร้อมวิ่งและสนุกไปด้วยกัน (Ready to Run!)', description: 'พักผ่อนให้เพียงพอก่อนวันงาน', completed: false, category: 'race_day' },
];

export function getStoredRunnerProfile(): RunnerProfile | null {
  try {
    const raw = localStorage.getItem(RUNNER_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RunnerProfile;
  } catch {
    return null;
  }
}

export function saveRunnerProfile(profile: RunnerProfile): void {
  try {
    localStorage.setItem(RUNNER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearStoredRunnerProfile(): void {
  try {
    localStorage.removeItem(RUNNER_PROFILE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getStoredChecklist(): RunnerChecklistItem[] {
  try {
    const raw = localStorage.getItem(RUNNER_CHECKLIST_STORAGE_KEY);
    if (!raw) return DEFAULT_CHECKLIST_ITEMS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_CHECKLIST_ITEMS;
  } catch {
    return DEFAULT_CHECKLIST_ITEMS;
  }
}

export function saveChecklist(items: RunnerChecklistItem[]): void {
  try {
    localStorage.setItem(RUNNER_CHECKLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}
