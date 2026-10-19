import React, { useState, useMemo } from 'react';
import { hotelsData } from '../data/hotelsData';
import { Hotel } from '../types';
import {
  MapPin,
  Phone,
  Search,
  PawPrint,
  Car,
  Navigation,
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Table as TableIcon,
  LayoutList,
  Map as MapIcon,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  Heart,
  Star,
  Compass,
} from 'lucide-react';
import { HotelMap } from './HotelMap';
import { getGoogleMapsUrl } from '../utils/geo';

interface HotelExplorerProps {
  initialSearch?: string;
}

// Curated bright, atmospheric hospitality images (bright coastal resorts, Hua Hin/Cha-am hotels)
const getHotelImage = (hotel: Hotel): string => {
  const photoPool = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80', // Resort pool luxury
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80', // Modern coastal room
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80', // Tropical beach resort
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80', // Beachfront hotel
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80', // Coastal villa
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80', // Boutique hotel suite
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop&q=80', // Cozy coastal stay
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80', // Ocean view balcony
  ];
  const idx = Math.abs(hotel.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % photoPool.length;
  return photoPool[idx];
};

export const HotelExplorer: React.FC<HotelExplorerProps> = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'map'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'under3' | '3to5' | 'above5'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');
  const [roomFilter, setRoomFilter] = useState<'all' | 'available' | 'immediate'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Resort' | 'Hotel' | 'Villa' | 'Guest House'>('all');
  const [showAllHotels, setShowAllHotels] = useState(false);
  const [selectedHotelModal, setSelectedHotelModal] = useState<Hotel | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Toggle favorite
  const toggleFavorite = (hotelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [hotelId]: !prev[hotelId],
    }));
  };

  const copyPhoneNumber = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  // Filter and sort logic
  const filteredHotels = useMemo(() => {
    return hotelsData.filter((hotel) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameTh = hotel.nameTh.toLowerCase().includes(q);
        const matchNameEn = hotel.nameEn.toLowerCase().includes(q);
        const matchName = hotel.name.toLowerCase().includes(q);
        const matchPhone = hotel.phone.includes(q);
        const matchPolicy = (hotel.petPolicy || '').toLowerCase().includes(q);
        const matchAddress = (hotel.address || '').toLowerCase().includes(q);
        if (!matchNameTh && !matchNameEn && !matchName && !matchPhone && !matchPolicy && !matchAddress) {
          return false;
        }
      }

      // 2. Distance Filter
      if (distanceFilter === 'under3' && hotel.distanceKm >= 3) return false;
      if (distanceFilter === '3to5' && (hotel.distanceKm < 3 || hotel.distanceKm > 5)) return false;
      if (distanceFilter === 'above5' && hotel.distanceKm <= 5) return false;

      // 3. Price Filter
      if (priceFilter === 'budget' && hotel.priceMin > 1000) return false;
      if (priceFilter === 'mid' && (hotel.priceMin <= 1000 || hotel.priceMin > 3000)) return false;
      if (priceFilter === 'premium' && hotel.priceMin <= 3000) return false;

      // 4. Room Availability Filter
      if (roomFilter === 'available' && (!hotel.availableRoomsCount || hotel.availableRoomsCount <= 0)) return false;
      if (roomFilter === 'immediate' && (!hotel.availableRoomsCount || hotel.availableRoomsCount < 10)) return false;

      // 5. Type Filter
      if (typeFilter !== 'all' && !hotel.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;

      return true;
    }).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  }, [searchQuery, distanceFilter, priceFilter, roomFilter, typeFilter]);

  // Display subset (4 hotels initially for strict sub-900px section height on desktop, expand when requested)
  const displayedHotels = useMemo(() => {
    if (showAllHotels || viewMode === 'table') {
      return filteredHotels;
    }
    return filteredHotels.slice(0, 4);
  }, [filteredHotels, showAllHotels, viewMode]);

  // Stats
  const totalHotelsCount = hotelsData.length;
  const availableHotelsCount = hotelsData.filter(
    (h) => h.availableRoomsCount !== null && h.availableRoomsCount !== undefined && h.availableRoomsCount > 0
  ).length;
  const lowestPrice = Math.min(...hotelsData.map((h) => h.priceMin || 9999));

  return (
    <section id="hotels" className="py-10 sm:py-14 bg-gradient-to-b from-[#FAF8FD] via-white to-[#F5F2FA] text-[#1E1B26] relative overflow-hidden border-b border-purple-100/80">
      {/* Soft warm ambient lighting (No Black) */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/35 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ============================================================ */}
        {/* COMPACT SECTION INTRO (Under 100px height) */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-[#5B20A8] text-[11px] font-bold uppercase tracking-wider mb-1.5 shadow-xs">
              <PawPrint className="w-3 h-3 text-[#5B20A8]" />
              <span>ที่พักใกล้สนามวิ่ง</span>
              <span className="w-1 h-1 rounded-full bg-[#E6A800]" />
              <span className="text-[10px] font-semibold text-purple-700">PET FRIENDLY & RUNNER STAY</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#261042] tracking-tight leading-tight">
              พักผ่อนสบาย ใกล้เส้นทาง <span className="text-[#5B20A8]">CHANGSUEK RUN</span>
            </h2>

            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-normal font-medium">
              รวมที่พักรอบค่ายพระราม 6 หัวหิน พร้อมระยะทาง ราคา และห้องว่างสำหรับนักวิ่งและครอบครัว
            </p>
          </div>

          {/* View Mode Switcher: Cards (Default), Table, Map */}
          <div className="flex items-center gap-1 bg-white border border-purple-100 p-1 rounded-xl shrink-0 self-start md:self-auto shadow-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#5B20A8] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-[#5B20A8] hover:bg-purple-50'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>การ์ด</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#5B20A8] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-[#5B20A8] hover:bg-purple-50'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>ตาราง</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#5B20A8] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-[#5B20A8] hover:bg-purple-50'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>แผนที่</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* QUICK STATS (4 Compact Horizontal Metric Badges) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
          <div className="bg-white hover:bg-purple-50/40 border border-purple-100 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs transition-colors">
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">ที่พักทั้งหมด</div>
              <div className="text-base sm:text-lg font-black text-[#261042] tracking-tight">{totalHotelsCount} <span className="text-[11px] font-normal text-slate-400">แห่ง</span></div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200/70 flex items-center justify-center text-[#5B20A8]">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white hover:bg-purple-50/40 border border-purple-100 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs transition-colors">
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">รัศมีค้นหา</div>
              <div className="text-base sm:text-lg font-black text-[#261042] tracking-tight">30 <span className="text-[11px] font-normal text-slate-400">กม.</span></div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200/70 flex items-center justify-center text-rose-500">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white hover:bg-purple-50/40 border border-purple-100 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs transition-colors">
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">มีห้องว่าง</div>
              <div className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">{availableHotelsCount} <span className="text-[11px] font-normal text-slate-400">แห่ง</span></div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white hover:bg-purple-50/40 border border-purple-100 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs transition-colors">
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">ราคาเริ่มต้น</div>
              <div className="text-base sm:text-lg font-black text-[#B87A00] tracking-tight">฿{lowestPrice.toLocaleString()}+ <span className="text-[10px] font-normal text-slate-400">/คืน</span></div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-[#B87A00]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ONE COMPACT HORIZONTAL FILTER BAR */}
        {/* ============================================================ */}
        <div className="bg-white border border-purple-100 p-2 sm:p-2.5 rounded-xl mb-4 flex flex-wrap md:flex-nowrap items-center gap-2 shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] w-full md:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อที่พัก, ทำเล, เบอร์โทร..."
              className="w-full bg-[#FAF9FD] border border-purple-100 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5B20A8] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Distance Dropdown */}
          <div className="relative shrink-0">
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value as any)}
              className="appearance-none bg-[#FAF9FD] hover:bg-purple-50/50 border border-purple-100 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#5B20A8] cursor-pointer transition-colors"
            >
              <option value="all">ระยะทาง ทั้งหมด</option>
              <option value="under3">&lt; 3 กม. (ใกล้มาก)</option>
              <option value="3to5">3 - 5 กม. (5-10 นาที)</option>
              <option value="above5">&gt; 5 กม. (ตัวเมือง)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Price Dropdown */}
          <div className="relative shrink-0">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="appearance-none bg-[#FAF9FD] hover:bg-purple-50/50 border border-purple-100 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#5B20A8] cursor-pointer transition-colors"
            >
              <option value="all">ราคา ทั้งหมด</option>
              <option value="budget">ประหยัด (&lt; ฿1,000)</option>
              <option value="mid">ปานกลาง (฿1,000 - ฿3,000)</option>
              <option value="premium">พรีเมียม (&gt; ฿3,000)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Rooms Dropdown */}
          <div className="relative shrink-0">
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value as any)}
              className="appearance-none bg-[#FAF9FD] hover:bg-purple-50/50 border border-purple-100 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#5B20A8] cursor-pointer transition-colors"
            >
              <option value="all">ห้องว่าง ทั้งหมด</option>
              <option value="available">มีห้องว่างแน่นอน</option>
              <option value="immediate">ว่าง 10+ ห้อง (กลุ่ม)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Dropdown */}
          <div className="relative shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="appearance-none bg-[#FAF9FD] hover:bg-purple-50/50 border border-purple-100 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#5B20A8] cursor-pointer transition-colors"
            >
              <option value="all">ประเภท ทั้งหมด</option>
              <option value="Resort">รีสอร์ต (Resort)</option>
              <option value="Hotel">โรงแรม (Hotel)</option>
              <option value="Villa">พูลวิลล่า (Villa)</option>
              <option value="Guest House">เกสต์เฮาส์ (Guest House)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {(searchQuery || distanceFilter !== 'all' || priceFilter !== 'all' || roomFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDistanceFilter('all');
                setPriceFilter('all');
                setRoomFilter('all');
                setTypeFilter('all');
              }}
              className="text-[11px] font-bold text-[#5B20A8] hover:underline px-1.5 whitespace-nowrap cursor-pointer"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: COMPACT HORIZONTAL HOTEL CARDS (Modern & Fresh) */}
        {/* Clean white cards, purple borders, soft shadows, warm badges */}
        {/* ============================================================ */}
        {viewMode === 'cards' && (
          <div className="space-y-2.5">
            {displayedHotels.map((hotel) => {
              const hasRooms = hotel.availableRoomsCount !== null && hotel.availableRoomsCount !== undefined && hotel.availableRoomsCount > 0;
              const isFav = !!favorites[hotel.id];
              const hotelImage = getHotelImage(hotel);

              return (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotelModal(hotel)}
                  className="group bg-white hover:bg-purple-50/20 border border-purple-100 hover:border-purple-300 rounded-xl p-2.5 sm:p-3 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative overflow-hidden"
                >
                  {/* LEFT: Bright Crisp Thumbnail */}
                  <div className="relative w-full sm:w-28 md:w-32 h-24 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-purple-50 border border-purple-100">
                    <img
                      src={hotelImage}
                      alt={hotel.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                    {/* Rank badge */}
                    <div className="absolute top-1 left-1 bg-[#5B20A8] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                      #{hotel.rank || 1}
                    </div>

                    {/* Pet Friendly pill */}
                    {hotel.petFriendly && (
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded shadow-xs">
                        <PawPrint className="w-2.5 h-2.5" />
                        <span>สัตว์เลี้ยง</span>
                      </div>
                    )}
                  </div>

                  {/* CENTER: Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#5B20A8] bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                        {hotel.type || 'Hotel'}
                      </span>
                      {hotel.rating && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>{hotel.rating}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-[#261042] group-hover:text-[#5B20A8] transition-colors truncate">
                      {hotel.name}
                    </h3>

                    {hotel.nameTh !== hotel.name && (
                      <p className="text-[10px] text-slate-500 truncate leading-tight">
                        {hotel.nameTh}
                      </p>
                    )}

                    {/* Distance & Location */}
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 flex-wrap font-medium">
                      <span className="flex items-center gap-1 font-bold text-[#261042]">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>ห่างค่าย {hotel.distanceKm} กม.</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>ขับรถ ~{hotel.drivingTimeMinutes} นาที</span>
                      <span className="text-slate-300 hidden md:inline">•</span>
                      <span className="text-slate-500 hidden md:inline truncate max-w-xs">{hotel.addressSnippet || hotel.address}</span>
                    </div>
                  </div>

                  {/* RIGHT: Price, Room Status & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-50 sm:min-w-[145px]">
                    <div className="text-left sm:text-right">
                      {hasRooms ? (
                        <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mb-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ว่าง {hotel.availableRooms}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mb-0.5">
                          <span>ห้องว่าง: ไม่ระบุ</span>
                        </div>
                      )}

                      <div>
                        <span className="text-base font-black text-[#5B20A8]">
                          {hotel.priceStart || `฿${hotel.priceMin.toLocaleString()}`}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium"> /คืน</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleFavorite(hotel.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-rose-50 border-rose-300 text-rose-500'
                            : 'bg-white border-purple-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50'
                        }`}
                        title={isFav ? 'ลบออกจากรายการโปรด' : 'บันทึกในรายการโปรด'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => setSelectedHotelModal(hotel)}
                        className="bg-[#5B20A8] hover:bg-[#471587] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>ดูข้อมูล</span>
                        <ChevronRight className="w-3 h-3 opacity-80" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty Search Result */}
            {filteredHotels.length === 0 && (
              <div className="p-6 text-center bg-white border border-purple-100 rounded-xl shadow-2xs">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-[#261042]">ไม่พบที่พักตามเงื่อนไขที่ค้นหา</div>
                <p className="text-[11px] text-slate-500 mt-0.5">ลองเปลี่ยนคำค้นหา หรือกด "ล้างตัวกรอง" เพื่อดูที่พักทั้งหมด</p>
              </div>
            )}

            {/* SHOW ALL TRIGGER BUTTON */}
            {filteredHotels.length > 4 && (
              <div className="text-center pt-1">
                <button
                  onClick={() => setShowAllHotels(!showAllHotels)}
                  className="bg-white hover:bg-purple-50 text-[#5B20A8] border border-purple-200 text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span>
                    {showAllHotels
                      ? 'ย่อแสดง 4 แห่งแรก'
                      : `ดูที่พักทั้งหมด ${filteredHotels.length} แห่ง (Show All)`}
                  </span>
                  {showAllHotels ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: COMPACT CLEAN TABLE (No dark mode, pure modern light) */}
        {/* ============================================================ */}
        {viewMode === 'table' && (
          <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-xs animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF8FD] border-b border-purple-100 text-[11px] font-black text-purple-900 uppercase">
                    <th className="py-3 px-3.5">#</th>
                    <th className="py-3 px-3.5">ชื่อที่พัก</th>
                    <th className="py-3 px-3.5 text-center">ระยะทาง</th>
                    <th className="py-3 px-3.5 text-center">ห้องว่าง</th>
                    <th className="py-3 px-3.5 text-right">ราคาเริ่มต้น</th>
                    <th className="py-3 px-3.5">สัตว์เลี้ยง</th>
                    <th className="py-3 px-3.5 text-center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {filteredHotels.map((hotel) => {
                    const hasRooms = hotel.availableRoomsCount !== null && hotel.availableRoomsCount !== undefined && hotel.availableRoomsCount > 0;
                    return (
                      <tr
                        key={hotel.id}
                        onClick={() => setSelectedHotelModal(hotel)}
                        className="hover:bg-purple-50/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3.5 font-bold text-[#5B20A8]">
                          #{hotel.rank}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="font-bold text-[#261042] group-hover:text-[#5B20A8] transition-colors truncate max-w-xs">
                            {hotel.name}
                          </div>
                          {hotel.nameTh !== hotel.name && (
                            <div className="text-[10px] text-slate-500 truncate max-w-xs">{hotel.nameTh}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-center whitespace-nowrap text-slate-700 font-medium">
                          {hotel.distanceKm} กม.
                        </td>
                        <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                          {hasRooms ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {hotel.availableRooms}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap font-black text-[#5B20A8]">
                          {hotel.priceStart || `฿${hotel.priceMin.toLocaleString()}`}
                        </td>
                        <td className="py-2.5 px-3.5 text-[11px] text-slate-600 truncate max-w-[180px]">
                          {hotel.petPolicy}
                        </td>
                        <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHotelModal(hotel);
                            }}
                            className="text-[#5B20A8] hover:underline font-bold text-[11px]"
                          >
                            ดูข้อมูล
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: COMPACT SPLIT MAP VIEW (Fresh light layout) */}
        {/* ============================================================ */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-200">
            {/* Left 40%: Scrollable compact list */}
            <div className="lg:col-span-5 max-h-[480px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                <span>เลือกที่พักจากรายการ ({filteredHotels.length})</span>
                <span className="text-[#5B20A8]">คลิกเพื่อดูหมุด</span>
              </div>
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotelModal(hotel)}
                  className="bg-white hover:bg-purple-50/50 border border-purple-100 p-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-2 text-xs shadow-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#261042] truncate">{hotel.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-[#5B20A8]">#{hotel.rank}</span>
                      <span>•</span>
                      <span>{hotel.distanceKm} กม.</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">{hotel.availableRooms || 'ห้องว่างไม่ระบุ'}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-[#5B20A8] text-xs">
                      {hotel.priceStart || `฿${hotel.priceMin.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 60%: Compact Hotel Map */}
            <div className="lg:col-span-7 bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-xs p-2 min-h-[400px]">
              <HotelMap compact={true} />
            </div>
          </div>
        )}

        {/* Informative note */}
        <div className="mt-5 text-center text-[11px] text-slate-500 font-medium">
          * ข้อมูลห้องว่างและราคาอัปเดตล่าสุดสำหรับการเตรียมตัวงาน CHANGSUEK RUN • กรุณาโทรยืนยันกับทางที่พักอีกครั้งก่อนจอง
        </div>

      </div>

      {/* ============================================================ */}
      {/* HOTEL DETAIL MODAL (Light, airy, friendly, no dark styling) */}
      {/* ============================================================ */}
      {selectedHotelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedHotelModal(null)}
        >
          <div
            className="bg-white text-[#1E1B26] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-purple-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedHotelModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Image Preview */}
            <div className="relative w-full h-40 sm:h-44 rounded-2xl overflow-hidden mb-4 border border-purple-100 bg-purple-50">
              <img
                src={getHotelImage(selectedHotelModal)}
                alt={selectedHotelModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-xs font-black text-white bg-[#5B20A8] px-2.5 py-0.5 rounded-full shadow-xs">
                  อันดับ {selectedHotelModal.rank}
                </span>
                <span className="text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <PawPrint className="w-3 h-3" />
                  <span>Pet Friendly</span>
                </span>
              </div>
            </div>

            {/* Hotel Name */}
            <h3 className="text-lg sm:text-xl font-black text-[#261042] mb-0.5">
              {selectedHotelModal.name}
            </h3>
            {selectedHotelModal.nameTh !== selectedHotelModal.name && (
              <p className="text-xs text-slate-500 mb-3">{selectedHotelModal.nameTh}</p>
            )}

            {/* Room Availability */}
            <div className="my-3 p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">สถานะห้องว่าง (อัปเดตล่าสุด):</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                {selectedHotelModal.availableRooms || 'ไม่ระบุ'}
              </span>
            </div>

            {/* Pet Policy */}
            <div className="mb-3.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
              <div className="font-bold text-[#8A5A00] mb-1 flex items-center gap-1.5">
                <PawPrint className="w-3.5 h-3.5" />
                <span>นโยบายสัตว์เลี้ยง (Pet Policy):</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedHotelModal.petPolicy}
              </p>
            </div>

            {/* Key Information */}
            <div className="space-y-2 text-xs text-slate-600 mb-4 font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{selectedHotelModal.address || `${selectedHotelModal.name} ชะอำ - หัวหิน`}</span>
              </div>

              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  ระยะห่างจากค่ายนเรศวร: <strong className="text-[#261042]">{selectedHotelModal.distanceKm} กม.</strong> (~{selectedHotelModal.drivingTimeMinutes} นาที)
                </span>
              </div>

              {selectedHotelModal.phone && selectedHotelModal.phone !== '-' && (
                <div className="flex items-center justify-between bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 mt-1">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <Phone className="w-3.5 h-3.5 text-[#5B20A8]" />
                    <span>เบอร์โทร: {selectedHotelModal.phone}</span>
                  </div>
                  <button
                    onClick={(e) => copyPhoneNumber(selectedHotelModal.phone, e)}
                    className="text-[11px] font-bold text-[#5B20A8] bg-white hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors shadow-xs"
                  >
                    {copiedPhone === selectedHotelModal.phone ? '✓ คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                </div>
              )}
            </div>

            {/* Amenities Tags */}
            {selectedHotelModal.amenities && selectedHotelModal.amenities.length > 0 && (
              <div className="mb-4">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">สิ่งอำนวยความสะดวก:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHotelModal.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price Row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mb-4">
              <span className="text-xs text-slate-500 font-medium">ราคาเริ่มต้น</span>
              <div>
                <span className="text-xl font-black text-[#5B20A8]">
                  {selectedHotelModal.priceStart || `฿${selectedHotelModal.priceMin.toLocaleString()}`}
                </span>
                <span className="text-xs text-slate-400 font-medium"> /คืน</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={getGoogleMapsUrl(selectedHotelModal.googleMaps || selectedHotelModal.name, selectedHotelModal.latitude, selectedHotelModal.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-purple-50 text-[#5B20A8] border border-purple-200 text-xs sm:text-sm font-bold py-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#5B20A8]" />
                <span>นำทาง Google Maps</span>
              </a>

              {selectedHotelModal.phone && selectedHotelModal.phone !== '-' ? (
                <a
                  href={`tel:${selectedHotelModal.phone.split('/')[0].trim()}`}
                  className="bg-[#5B20A8] hover:bg-[#471587] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>โทรสอบถาม</span>
                </a>
              ) : (
                <button
                  onClick={() => setSelectedHotelModal(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold py-2.5 rounded-xl text-center"
                >
                  ปิดหน้าต่าง
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
