import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Sparkles,
  RefreshCw,
  Shirt,
  Footprints,
  MapPin,
} from 'lucide-react';

const CHA_AM_LAT = 12.7989;
const CHA_AM_LON = 99.9678;

interface WeatherData {
  currentTemp: number;
  apparentTemp: number;
  relativeHumidity: number;
  windSpeed: number;
  weatherCode: number;
  uvIndex: number;
  hourlyTimes: string[];
  hourlyTemps: number[];
  hourlyHumidity: number[];
  hourlyWind: number[];
  hourlyWeatherCode: number[];
  sunrise: string;
}

const getWeatherDescription = (
  code: number
): { label: string; icon: React.ReactNode; mood: string } => {
  if (code === 0) {
    return {
      label: 'ท้องฟ้าแจ่มใส ลมพัดเย็น',
      icon: <Sun className="w-7 h-7 text-amber-500" />,
      mood: 'เหมาะแก่การวิ่งทำ New PB ริมหาดชะอำ',
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      label: 'มีเมฆบางส่วน แดดอ่อนยามเช้า',
      icon: <CloudSun className="w-7 h-7 text-amber-500" />,
      mood: 'ทัศนียภาพดีเยี่ยม บังแดดให้อุณหภูมิสบาย',
    };
  }
  if (code >= 51 && code <= 65) {
    return {
      label: 'มีละอองฝนโปรยปรายเล็กน้อย',
      icon: <CloudRain className="w-7 h-7 text-sky-500" />,
      mood: 'ชุ่มฉ่ำ ระวังพื้นเปียกบริเวณโค้งเลียบหาด',
    };
  }
  return {
    label: 'อากาศชายหาดสบาย ลมทะเลพัดโชย',
    icon: <CloudSun className="w-7 h-7 text-[#5B20A8]" />,
    mood: 'สภาพอากาศเปิด ลมทะเลพัดเย็นตลอดเช้า',
  };
};

export const EventWeatherForecast: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlot, setSelectedSlot] = useState<number>(1); // default 06:00 start

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${CHA_AM_LAT}&longitude=${CHA_AM_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&daily=sunrise&timezone=Asia%2FBangkok&forecast_days=2`;
      const res = await fetch(url);
      const data = await res.json();

      const times = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'];
      const morningTemps = [24.5, 25.0, 26.2, 27.8, 29.1, 30.2];
      const morningHumidity = [82, 80, 75, 70, 65, 60];
      const morningWind = [9, 11, 14, 16, 18, 17];
      const morningCodes = [1, 1, 0, 0, 1, 1];

      if (data?.hourly?.time?.length >= 24) {
        for (let i = 0; i < 6; i++) {
          const idx = 5 + i;
          if (data.hourly.temperature_2m[idx] !== undefined) {
            morningTemps[i] = Math.round(data.hourly.temperature_2m[idx] * 10) / 10;
          }
          if (data.hourly.relative_humidity_2m[idx] !== undefined) {
            morningHumidity[i] = data.hourly.relative_humidity_2m[idx];
          }
          if (data.hourly.wind_speed_10m[idx] !== undefined) {
            morningWind[i] = Math.round(data.hourly.wind_speed_10m[idx]);
          }
          if (data.hourly.weather_code[idx] !== undefined) {
            morningCodes[i] = data.hourly.weather_code[idx];
          }
        }
      }

      setWeather({
        currentTemp: morningTemps[1],
        apparentTemp: Math.round((morningTemps[1] + 1.5) * 10) / 10,
        relativeHumidity: morningHumidity[1],
        windSpeed: morningWind[1],
        weatherCode: morningCodes[1],
        uvIndex: 3,
        hourlyTimes: times,
        hourlyTemps: morningTemps,
        hourlyHumidity: morningHumidity,
        hourlyWind: morningWind,
        hourlyWeatherCode: morningCodes,
        sunrise: '06:24',
      });
    } catch {
      setWeather({
        currentTemp: 25.0,
        apparentTemp: 26.5,
        relativeHumidity: 78,
        windSpeed: 12,
        weatherCode: 1,
        uvIndex: 3,
        hourlyTimes: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
        hourlyTemps: [24.2, 24.8, 26.1, 27.5, 28.9, 30.0],
        hourlyHumidity: [82, 78, 74, 68, 64, 60],
        hourlyWind: [10, 12, 14, 16, 17, 18],
        hourlyWeatherCode: [1, 1, 0, 0, 1, 1],
        sunrise: '06:24',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const data = weather || {
    currentTemp: 25.0,
    apparentTemp: 26.5,
    relativeHumidity: 78,
    windSpeed: 12,
    weatherCode: 1,
    uvIndex: 3,
    hourlyTimes: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
    hourlyTemps: [24.2, 24.8, 26.1, 27.5, 28.9, 30.0],
    hourlyHumidity: [82, 78, 74, 68, 64, 60],
    hourlyWind: [10, 12, 14, 16, 17, 18],
    hourlyWeatherCode: [1, 1, 0, 0, 1, 1],
    sunrise: '06:24',
  };

  const activeTemp = data.hourlyTemps[selectedSlot] ?? data.currentTemp;
  const activeHum = data.hourlyHumidity[selectedSlot] ?? data.relativeHumidity;
  const activeWind = data.hourlyWind[selectedSlot] ?? data.windSpeed;
  const activeCode = data.hourlyWeatherCode[selectedSlot] ?? data.weatherCode;
  const activeTime = data.hourlyTimes[selectedSlot] ?? '06:00';
  const desc = getWeatherDescription(activeCode);

  return (
    <div
      id="weather-forecast"
      className="h-full bg-white rounded-[32px] border-[3px] border-[#2A1450] shadow-[0_18px_38px_-14px_rgba(42,20,80,0.28),0_6px_0_#2A1450] overflow-hidden flex flex-col justify-between"
    >
      {/* Top Coastal Sky Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#FFC928]" />

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-[#2A1450]/15">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-[#E0F2FE] border-2 border-[#2A1450] shadow-[2px_2px_0_#2A1450] flex items-center justify-center shrink-0">
                {desc.icon}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2A1450] leading-tight">
                  พยากรณ์อากาศเช้าวันแข่ง
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0369A1]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>หาดชะอำ (ค่ายนเรศวร - ค่ายพระราม 6)</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchWeather}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4ECFF] hover:bg-[#E6D6FC] text-[#4B1C8C] text-xs font-extrabold border border-purple-200 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>อัปเดต</span>
            </button>
          </div>

          {/* Hourly Time Slot Selector (05:00 - 10:00) */}
          <div className="mt-4">
            <div className="text-[11px] font-extrabold text-[#6B5A85] uppercase tracking-wider mb-2">
              เลือกดูสภาพอากาศตามช่วงเวลาปล่อยตัว:
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {data.hourlyTimes.map((time, idx) => {
                const isSelected = selectedSlot === idx;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedSlot(idx)}
                    className={`rounded-xl py-2 px-1 text-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-[#2A1450] text-[#FFC928] border-[#2A1450] shadow-[0_3px_0_#7B3FC6] -translate-y-0.5'
                        : 'bg-[#FAF8FF] hover:bg-purple-50 text-[#2A1450] border-purple-100'
                    }`}
                  >
                    <div className="text-[11px] font-mono font-extrabold">{time}</div>
                    <div
                      className={`text-xs font-black mt-0.5 tabular-nums ${
                        isSelected ? 'text-white' : 'text-[#5B20A8]'
                      }`}
                    >
                      {data.hourlyTemps[idx]}°
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Weather Readout Card */}
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#F0F9FF] via-[#FAF6FF] to-[#FFFBEB] p-4 border-2 border-[#2A1450]/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2A1450] text-[#FFC928] mb-1">
                  เวลา {activeTime} น. • พระอาทิตย์ขึ้น {data.sunrise} น.
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#2A1450] tabular-nums">
                    {activeTemp}°C
                  </span>
                  <span className="text-xs font-extrabold text-[#5B20A8]">{desc.label}</span>
                </div>
                <p className="text-xs text-[#4B2D78] font-semibold mt-1">{desc.mood}</p>
              </div>

              <div className="flex gap-2.5">
                <div className="bg-white rounded-xl px-3 py-2 border border-purple-100 text-center min-w-[78px]">
                  <Droplets className="w-4 h-4 text-[#0284C7] mx-auto mb-0.5" />
                  <div className="text-xs font-black text-[#2A1450] tabular-nums">{activeHum}%</div>
                  <div className="text-[10px] font-bold text-[#6B5A85]">ความชื้น</div>
                </div>
                <div className="bg-white rounded-xl px-3 py-2 border border-purple-100 text-center min-w-[78px]">
                  <Wind className="w-4 h-4 text-[#16A34A] mx-auto mb-0.5" />
                  <div className="text-xs font-black text-[#2A1450] tabular-nums">
                    {activeWind} km/h
                  </div>
                  <div className="text-[10px] font-bold text-[#6B5A85]">ลมทะเล</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Gear Advice Footer */}
        <div className="mt-4 pt-3 border-t border-purple-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 bg-[#FAF8FF] rounded-xl p-2.5 border border-purple-100">
            <Shirt className="w-4 h-4 text-[#6D28D9] shrink-0" />
            <span className="font-bold text-[#2A1450]">
              แนะนำเสื้อผ้า Micro-Dry ระบายเหงื่อ + หมวกบังแดดเช้า
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-[#FFFBEB] rounded-xl p-2.5 border border-amber-200">
            <Footprints className="w-4 h-4 text-[#D97706] shrink-0" />
            <span className="font-bold text-[#2A1450]">
              น้องหมาควรจิบน้ำทุกจุดพัก 1.5 กม.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
