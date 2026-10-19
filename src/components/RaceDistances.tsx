import React, { useState } from 'react';
import { RouteId } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  BarChart3,
  Shirt,
  Medal,
  CreditCard,
  Gift,
  ShieldCheck,
  Heart,
  ChevronRight,
  Crown,
  Sparkles,
  X,
  Check,
  Info,
  Package,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SocialShare } from './SocialShare';
import { MerchShowcase } from './MerchShowcase';

interface RaceDistancesProps {
  selectedRoute: RouteId;
  onSelectRoute: (id: RouteId) => void;
  onScrollToMap: () => void;
  onOpenRegister: (id?: RouteId) => void;
  onOpenComparisonModal?: () => void;
  onOpenPaceModal?: () => void;
}

export const RaceDistances: React.FC<RaceDistancesProps> = ({
  selectedRoute,
  onSelectRoute,
  onScrollToMap,
  onOpenRegister,
  onOpenComparisonModal,
  onOpenPaceModal,
}) => {
  const [merchModalOpen, setMerchModalOpen] = useState(false);

  // Exactly 3 Race Categories matching reference image
  const raceCards = [
    {
      id: '3km' as RouteId,
      distance: '3K',
      category: 'FUN RUN',
      subtitle: 'วิ่งสนุก เพื่อทุกคน',
      badge: null,
      themeColor: '#175B37', // Emerald / Forest Green
      themeLight: '#E8F6EE',
      themeBorder: '#C1E8D2',
      buttonBg: 'bg-[#18603B] hover:bg-[#134D2F]',
      bannerGradient: 'from-[#EAF8F0] via-[#E2F5EA] to-[#D4EFE1]',
      textColor: 'text-[#185E39]',
      subTextColor: 'text-[#2D7A4F]',
      chipBg: 'bg-[#EBF7F1] text-[#185E39] border-[#CEEBDB]',
      accentLeaf: true,
      info: {
        date: 'อาทิตย์ที่ 16 กุมภาพันธ์ 2568',
        time: '07:00 น.',
        route: 'ถนนเลียบชายหาดชะอำ',
        difficulty: 'เหมาะสำหรับทุกเพศทุกวัย',
      },
      buttonText: 'สมัครระยะ 3K',
      illustrationImage: '/images/distances/card-3k-editorial.jpg',
      illustrationAlt: 'CHANGSUEK RUN 3 KM Fun Run Editorial Illustration',
      // SVG Silhouette for 3K Fun Run banner
      bannerSilhouette: (
        <svg
          viewBox="0 0 200 130"
          className="absolute right-0 bottom-0 h-full w-auto max-w-[190px] pointer-events-none select-none"
          fill="none"
        >
          {/* Palm Fronds */}
          <path
            d="M 195,0 C 180,25 170,55 175,130"
            stroke="#175B37"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path d="M 175,30 Q 140,32 125,50 Q 155,46 177,38" fill="#175B37" opacity="0.3" />
          <path d="M 172,52 Q 130,65 115,90 Q 148,78 173,62" fill="#175B37" opacity="0.32" />
          <path d="M 174,75 Q 138,95 125,120 Q 155,102 176,82" fill="#175B37" opacity="0.28" />

          {/* Elephant walking beside runner */}
          <g fill="#175B37" opacity="0.45" transform="translate(105, 52) scale(0.48)">
            {/* Elephant Body */}
            <path d="M 40,60 C 20,40 25,15 50,8 C 75,2 95,15 105,35 C 115,25 130,28 135,42 C 140,55 130,70 120,75 L 122,105 L 110,105 L 108,82 L 95,82 L 93,105 L 82,105 L 84,78 L 65,78 L 63,105 L 52,105 L 55,75 C 45,75 42,68 40,60 Z" />
            {/* Trunk & Ear */}
            <path d="M 132,45 C 142,50 148,65 142,80 C 138,90 146,92 148,84 C 154,65 144,40 130,35 Z" />
            <path d="M 112,32 C 122,35 125,55 115,62 C 105,68 102,48 112,32 Z" fill="#18603B" opacity="0.8" />
          </g>

          {/* Runner in Fun Run */}
          <g fill="#175B37" opacity="0.55" transform="translate(68, 62) scale(0.42)">
            <circle cx="25" cy="15" r="7" />
            <path d="M 22,24 L 30,24 L 35,45 L 28,68 L 22,68 L 27,47 L 18,47 L 10,65 L 4,64 L 14,40 L 15,26 Z" />
            <path d="M 22,27 L 10,38 L 13,44 L 24,34 Z" />
            <path d="M 28,27 L 38,36 L 44,32 L 30,24 Z" />
          </g>

          {/* Golden Dog jogging */}
          <g fill="#175B37" opacity="0.5" transform="translate(150, 84) scale(0.32)">
            <path d="M 10,20 C 12,12 22,10 26,16 C 30,20 38,20 44,24 L 46,38 L 40,38 L 38,28 L 28,28 L 26,38 L 20,38 L 22,26 L 14,26 L 8,32 L 4,28 Z" />
            <circle cx="12" cy="15" r="4" />
          </g>

          {/* Sandy Shoreline Waves */}
          <path d="M 0,126 Q 50,122 100,125 Q 150,128 200,124" stroke="#175B37" strokeWidth="1.5" opacity="0.2" />
        </svg>
      ),
    },
    {
      id: '5km' as RouteId,
      distance: '5K',
      category: 'HEALTHY RUN',
      subtitle: 'เริ่มก้าวแรก สู่สุขภาพที่ดี',
      badge: 'ยอดนิยม',
      themeColor: '#D48B06', // Rich Gold / Amber
      themeLight: '#FFF8E7',
      themeBorder: '#F9D886',
      buttonBg: 'bg-[#D48B06] hover:bg-[#B97705]',
      bannerGradient: 'from-[#FFF8E7] via-[#FFF2D4] to-[#FEE8B8]',
      textColor: 'text-[#965507]',
      subTextColor: 'text-[#B06B0F]',
      chipBg: 'bg-[#FFF6E0] text-[#965507] border-[#FCE19F]',
      accentLeaf: false,
      info: {
        date: 'อาทิตย์ที่ 16 กุมภาพันธ์ 2568',
        time: '06:40 น.',
        route: 'เส้นทางเลียบชายหาด + วิวทะเล',
        difficulty: 'เหมาะสำหรับนักวิ่งทั่วไป',
      },
      buttonText: 'สมัครระยะ 5K',
      illustrationImage: '/images/distances/card-5k-editorial.jpg',
      illustrationAlt: 'CHANGSUEK RUN 5 KM Healthy Run Editorial Illustration',
      // SVG Silhouette for 5K Healthy Run banner
      bannerSilhouette: (
        <svg
          viewBox="0 0 200 130"
          className="absolute right-0 bottom-0 h-full w-auto max-w-[190px] pointer-events-none select-none"
          fill="none"
        >
          {/* Warm Sun Radiance */}
          <circle cx="130" cy="55" r="32" fill="#F5B800" opacity="0.25" />

          {/* Tropical Palm silhouettes */}
          <path
            d="M 198,0 C 185,28 178,60 182,130"
            stroke="#965507"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.28"
          />
          <path d="M 182,28 Q 148,30 132,46 Q 162,42 184,36" fill="#965507" opacity="0.32" />
          <path d="M 180,48 Q 138,62 122,86 Q 155,75 181,58" fill="#965507" opacity="0.35" />
          <path d="M 181,72 Q 142,92 128,118 Q 158,100 182,78" fill="#965507" opacity="0.3" />

          {/* Majestic Elephant walking beside runner */}
          <g fill="#965507" opacity="0.5" transform="translate(108, 48) scale(0.52)">
            <path d="M 40,60 C 20,40 25,15 50,8 C 75,2 95,15 105,35 C 115,25 130,28 135,42 C 140,55 130,70 120,75 L 122,105 L 110,105 L 108,82 L 95,82 L 93,105 L 82,105 L 84,78 L 65,78 L 63,105 L 52,105 L 55,75 C 45,75 42,68 40,60 Z" />
            <path d="M 132,45 C 142,50 148,65 142,80 C 138,90 146,92 148,84 C 154,65 144,40 130,35 Z" />
            <path d="M 112,32 C 122,35 125,55 115,62 C 105,68 102,48 112,32 Z" fill="#784204" opacity="0.8" />
          </g>

          {/* Runner in energetic stride */}
          <g fill="#965507" opacity="0.6" transform="translate(74, 58) scale(0.44)">
            <circle cx="25" cy="15" r="7" />
            <path d="M 22,24 L 30,24 L 36,44 L 32,68 L 24,68 L 28,47 L 18,47 L 8,65 L 2,64 L 14,40 L 15,26 Z" />
            <path d="M 22,27 L 8,36 L 11,42 L 24,34 Z" />
            <path d="M 28,27 L 40,36 L 46,31 L 30,24 Z" />
          </g>

          {/* Companion Dog */}
          <g fill="#965507" opacity="0.55" transform="translate(155, 82) scale(0.32)">
            <path d="M 10,20 C 12,12 22,10 26,16 C 30,20 38,20 44,24 L 46,38 L 40,38 L 38,28 L 28,28 L 26,38 L 20,38 L 22,26 L 14,26 L 8,32 L 4,28 Z" />
            <circle cx="12" cy="15" r="4" />
          </g>

          {/* Beach shore line */}
          <path d="M 0,126 Q 50,122 100,125 Q 150,128 200,124" stroke="#965507" strokeWidth="1.5" opacity="0.22" />
        </svg>
      ),
    },
    {
      id: '10km' as RouteId,
      distance: '10K',
      category: 'CHALLENGE RUN',
      subtitle: 'ท้าทายกว่าเดิม ไปให้ไกลกว่า',
      badge: null,
      themeColor: '#3D106B', // Deep Royal Purple
      themeLight: '#F4ECFD',
      themeBorder: '#D8C2F8',
      buttonBg: 'bg-[#3D106B] hover:bg-[#2C0B4F]',
      bannerGradient: 'from-[#F5EEFF] via-[#EDE0FC] to-[#DFCEFA]',
      textColor: 'text-[#4E1B96]',
      subTextColor: 'text-[#6628BF]',
      chipBg: 'bg-[#F6EFFF] text-[#4E1B96] border-[#DEC9FA]',
      accentLeaf: false,
      info: {
        date: 'อาทิตย์ที่ 16 กุมภาพันธ์ 2568',
        time: '06:20 น.',
        route: 'เส้นทางเลียบชายหาด + จุดชมวิว',
        difficulty: 'สำหรับนักวิ่งที่ต้องการความท้าทาย',
      },
      buttonText: 'สมัครระยะ 10K',
      illustrationImage: '/images/distances/card-10k-editorial.jpg',
      illustrationAlt: 'CHANGSUEK RUN 10 KM Challenge Run Editorial Illustration',
      // SVG Silhouette for 10K Challenge Run banner
      bannerSilhouette: (
        <svg
          viewBox="0 0 200 130"
          className="absolute right-0 bottom-0 h-full w-auto max-w-[190px] pointer-events-none select-none"
          fill="none"
        >
          {/* Distant Sun Sphere */}
          <circle cx="125" cy="50" r="30" fill="#7B2FFF" opacity="0.18" />

          {/* Coastal Palm & Silhouette Fronds */}
          <path
            d="M 198,0 C 185,28 178,60 182,130"
            stroke="#4E1B96"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path d="M 182,28 Q 148,30 132,46 Q 162,42 184,36" fill="#4E1B96" opacity="0.3" />
          <path d="M 180,48 Q 138,62 122,86 Q 155,75 181,58" fill="#4E1B96" opacity="0.32" />

          {/* Elephant Silhouette */}
          <g fill="#4E1B96" opacity="0.5" transform="translate(108, 48) scale(0.52)">
            <path d="M 40,60 C 20,40 25,15 50,8 C 75,2 95,15 105,35 C 115,25 130,28 135,42 C 140,55 130,70 120,75 L 122,105 L 110,105 L 108,82 L 95,82 L 93,105 L 82,105 L 84,78 L 65,78 L 63,105 L 52,105 L 55,75 C 45,75 42,68 40,60 Z" />
            <path d="M 132,45 C 142,50 148,65 142,80 C 138,90 146,92 148,84 C 154,65 144,40 130,35 Z" />
            <path d="M 112,32 C 122,35 125,55 115,62 C 105,68 102,48 112,32 Z" fill="#3D106B" opacity="0.8" />
          </g>

          {/* Challenge Runner in forward sprint */}
          <g fill="#4E1B96" opacity="0.65" transform="translate(74, 56) scale(0.46)">
            <circle cx="25" cy="15" r="7" />
            <path d="M 22,24 L 32,24 L 38,44 L 45,66 L 38,68 L 30,48 L 18,48 L 10,65 L 4,63 L 14,40 L 15,26 Z" />
            <path d="M 22,27 L 6,34 L 8,40 L 24,34 Z" />
            <path d="M 30,27 L 44,38 L 48,32 L 32,24 Z" />
          </g>

          {/* Running Dog companion */}
          <g fill="#4E1B96" opacity="0.55" transform="translate(155, 82) scale(0.32)">
            <path d="M 10,20 C 12,12 22,10 26,16 C 30,20 38,20 44,24 L 46,38 L 40,38 L 38,28 L 28,28 L 26,38 L 20,38 L 22,26 L 14,26 L 8,32 L 4,28 Z" />
            <circle cx="12" cy="15" r="4" />
          </g>

          {/* Wave line */}
          <path d="M 0,126 Q 50,122 100,125 Q 150,128 200,124" stroke="#4E1B96" strokeWidth="1.5" opacity="0.2" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="distances"
      className="py-14 sm:py-20 lg:py-24 bg-[#F8F5FC] relative overflow-hidden select-none"
    >
      {/* 1. Coastal Atmospheric Landscape Background from CHANGSUEK RUN identity */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* Coastal photo wash */}
        <img
          src="/images/hero/changsuek-run-coastal.jpg"
          alt="CHANGSUEK RUN Coastal Horizon"
          className="w-full h-full object-cover object-top opacity-20 mix-blend-multiply"
        />
        {/* Soft lavender/white gradient overlay ensuring crisp typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9FE]/90 via-[#F7F2FC]/80 to-[#F2EBF9]/95 backdrop-blur-[2px]" />

        {/* Subtle radial glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-[#FFC928]/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-[550px] h-[400px] bg-[#7B2FFF]/10 rounded-full blur-3xl" />
      </div>

      {/* 2. Coastal Signpost on the right flank matching reference image */}
      <div className="hidden 2xl:block absolute right-8 top-36 z-0 pointer-events-none select-none opacity-85">
        <div className="relative flex flex-col items-center">
          {/* Planks */}
          <div className="space-y-1.5 flex flex-col items-center">
            {/* RUN */}
            <div className="bg-[#4A1584] text-white text-[13px] font-black tracking-widest px-5 py-1.5 rounded-md shadow-md transform -rotate-3 border border-white/20">
              RUN
            </div>
            {/* FRIENDSHIP */}
            <div className="bg-[#5B20A8] text-white text-[13px] font-black tracking-widest px-5 py-1.5 rounded-md shadow-md transform rotate-2 border border-white/20">
              FRIENDSHIP
            </div>
            {/* NATURE */}
            <div className="bg-[#3D106B] text-white text-[13px] font-black tracking-widest px-5 py-1.5 rounded-md shadow-md transform -rotate-2 border border-white/20">
              NATURE
            </div>
            {/* BETTER TOMORROW */}
            <div className="bg-[#240C44] text-white text-[12px] font-black tracking-widest px-5 py-1.5 rounded-md shadow-md transform rotate-1 border border-white/20">
              BETTER TOMORROW
            </div>
          </div>
          {/* Wooden post trunk */}
          <div className="w-3.5 h-36 bg-[#8B6B55] rounded-b-sm border-x border-[#5E4433] shadow-inner mt-0.5" />
          {/* Ground sand mound */}
          <div className="w-16 h-3 bg-[#D4BA96] rounded-full blur-[1px] -mt-1" />
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ============================================================== */}
        {/* TOP HEADER MATCHING EXACT REFERENCE IMAGE                      */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16 relative"
        >
          {/* Eyebrow Label */}
          <div className="inline-block mb-1.5">
            <span className="text-xs sm:text-sm font-black tracking-[0.28em] text-[#5B20A8] uppercase">
              RACE CATEGORY
            </span>
          </div>

          {/* Main Heading with Golden Arc Smile and Playful Slogan on Right */}
          <div className="relative inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-[#25183B] tracking-tight leading-tight">
                เลือกเส้นทางของคุณ
              </h2>
              {/* Golden smile arc under "เลือกเส้นทาง" matching reference image */}
              <svg
                className="absolute -bottom-2.5 left-1 w-44 sm:w-60 h-3.5 text-[#F5B800] pointer-events-none"
                viewBox="0 0 160 14"
                fill="none"
              >
                <path
                  d="M 4,6 Q 80,14 156,4"
                  stroke="#F5B800"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Playful Cursive Slogan on Top Right: วิ่งด้วยใจ ไปด้วยกัน 💛 */}
            <div className="font-comic text-lg sm:text-2xl text-[#5B20A8] font-bold transform sm:translate-y-[-14px] -rotate-3 flex items-center gap-1.5 text-nowrap">
              <span>วิ่งด้วยใจ ไปด้วยกัน</span>
              <span className="text-[#F5B800] text-xl sm:text-2xl">💛</span>
            </div>
          </div>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium mt-4 max-w-2xl mx-auto">
            ทุกก้าวของคุณ คือพลังให้ช้าง... เพื่อสังคมที่ดีกว่า
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 3 EQUAL-WIDTH RACE CARDS IN 3-COLUMN LAYOUT WITH STAGGER       */}
        {/* ============================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.14,
                delayChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-[1240px] mx-auto"
        >
          {raceCards.map((card) => {
            const isSelected = selectedRoute === card.id;
            const isFeatured = card.badge !== null; // 5K card is featured / ยอดนิยม

            return (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1], // Custom smooth cubic-bezier curve
                    },
                  },
                }}
                whileHover={{
                  scale: 1.025,
                  transition: { duration: 0.25, ease: 'easeOut' },
                }}
                whileTap={{
                  scale: 0.99,
                  transition: { duration: 0.15 },
                }}
                onClick={() => onSelectRoute(card.id)}
                className={`relative bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 flex flex-col justify-between transition-shadow duration-300 cursor-pointer group ${
                  isFeatured
                    ? 'border-2 border-[#E59C0E] shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 md:-translate-y-2'
                    : isSelected
                    ? 'border-2 border-[#5B20A8] shadow-xl shadow-purple-900/10 hover:shadow-2xl hover:shadow-purple-900/20'
                    : 'border border-purple-100 hover:border-purple-300 shadow-md hover:shadow-2xl hover:shadow-purple-900/15'
                }`}
              >
                {/* 5K Floating "ยอดนิยม" Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-[#D48A06] hover:bg-[#B97705] text-white px-4 py-1 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-1.5 border border-white/40">
                      <Crown className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{card.badge}</span>
                    </div>
                  </div>
                )}

                {/* Selected Indicator pill on top-right */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 bg-[#5B20A8] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>เลือกแล้ว</span>
                  </div>
                )}

                <div>
                  {/* Top Artwork Banner matching Reference Image */}
                  <div
                    className={`rounded-[22px] bg-gradient-to-br ${card.bannerGradient} p-5 sm:p-6 pb-4 border relative overflow-hidden min-h-[148px] sm:min-h-[160px] flex flex-col justify-between select-none group/banner`}
                    style={{ borderColor: card.themeBorder }}
                  >
                    {/* Editorial Illustration Image Asset in Top Visual Area */}
                    {card.illustrationImage && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                        <img
                          src={card.illustrationImage}
                          alt={card.illustrationAlt}
                          className="absolute right-0 top-0 h-full w-full object-cover object-right opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Soft directional gradient scrim ensuring pristine typographic legibility on the left while revealing the artwork on the right */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${
                            card.id === '3km'
                              ? 'from-[#EAF8F0] via-[#EAF8F0]/85 to-transparent'
                              : card.id === '5km'
                              ? 'from-[#FFF8E7] via-[#FFF8E7]/85 to-transparent'
                              : 'from-[#F5EEFF] via-[#F5EEFF]/85 to-transparent'
                          } w-4/5 pointer-events-none`}
                        />
                      </div>
                    )}

                    {/* Left Typography */}
                    <div className="relative z-10">
                      {/* Distance Number & Leaf Accent */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-4xl sm:text-[46px] font-black tracking-tight leading-none ${card.textColor}`}
                        >
                          {card.distance}
                        </span>
                        {card.accentLeaf && (
                          <span className="text-[#175B37] text-2xl animate-pulse">🌱</span>
                        )}
                      </div>

                      {/* Category Label */}
                      <h3
                        className={`text-sm sm:text-base font-black tracking-wider uppercase mt-1 ${card.textColor}`}
                      >
                        {card.category}
                      </h3>

                      {/* Subtitle */}
                      <p
                        className={`text-xs sm:text-[13px] font-semibold mt-0.5 ${card.subTextColor}`}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Information Rows matching reference list */}
                  <div className="px-1.5 pt-5 pb-4 space-y-3 text-xs sm:text-[13px]">
                    {/* 1. Race Date */}
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>วันแข่งขัน</span>
                      </div>
                      <span className="font-bold text-[#25183B] text-right">
                        {card.info.date}
                      </span>
                    </div>

                    {/* 2. Start Time */}
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>ปล่อยตัว</span>
                      </div>
                      <span className="font-bold text-[#25183B]">
                        {card.info.time}
                      </span>
                    </div>

                    {/* 3. Route Details */}
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>เส้นทาง</span>
                      </div>
                      <span className="font-bold text-[#25183B] text-right">
                        {card.info.route}
                      </span>
                    </div>

                    {/* 4. Difficulty Level */}
                    <div className="flex items-center justify-between gap-2 pb-1">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <BarChart3 className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>ระดับความยาก</span>
                      </div>
                      <span className="font-bold text-[#25183B] text-right">
                        {card.info.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Included Items: Circular Pills matching reference image */}
                  <div className="pt-2 pb-5 border-t border-dashed border-gray-200">
                    <div className="grid grid-cols-3 gap-2">
                      {/* Shirt */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xs mb-1.5 transition-transform group-hover:scale-105 ${card.chipBg}`}
                        >
                          <Shirt className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 leading-tight">
                          เสื้อวิ่ง
                        </span>
                      </div>

                      {/* Medal */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xs mb-1.5 transition-transform group-hover:scale-105 ${card.chipBg}`}
                        >
                          <Medal className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 leading-tight">
                          เหรียญที่ระลึก
                        </span>
                      </div>

                      {/* BIB */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xs mb-1.5 transition-transform group-hover:scale-105 ${card.chipBg}`}
                        >
                          <span className="text-[10px] font-black tracking-tighter">
                            BIB
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 leading-tight">
                          หมายเลขวิ่ง
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Pill Registration Button & Quick Share */}
                <div className="pt-1 space-y-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoute(card.id);
                      onOpenRegister(card.id);
                    }}
                    className={`w-full ${card.buttonBg} text-white font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer`}
                  >
                    <span>{card.buttonText}</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Quick Share for this selected distance */}
                  <SocialShare selectedDistance={card.id} variant="card" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Prominent Showcase: เสื้อวิ่ง & เหรียญรางวัล Finisher */}
        <div id="merch-showcase" className="mt-10 sm:mt-14">
          <MerchShowcase onOpenRegister={() => onOpenRegister(selectedRoute)} />
        </div>

        {/* ============================================================== */}
        {/* BOTTOM BENEFIT BAR: "เมื่อสมัครเข้าร่วม คุณจะได้รับ" (RACE PACK) */}
        {/* PREMIUM TICKET-STYLE AESTHETIC WITH ELEGANT GRID               */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14 relative"
        >
          {/* Outer Ticket Shell with Distinct Double Border & Notches */}
          <div className="relative bg-white rounded-[28px] sm:rounded-[36px] border-2 border-[#5B20A8]/25 shadow-2xl shadow-purple-950/10 overflow-hidden">
            
            {/* Subtle Top Golden Accent Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5B20A8] via-[#F5B800] to-[#5B20A8]" />

            {/* Background Decorative Graphic Elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-radial from-purple-100/60 via-amber-50/20 to-transparent rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-radial from-purple-100/40 to-transparent rounded-full pointer-events-none" />

            <div className="p-6 sm:p-8 lg:p-9 relative z-10">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D106B] via-[#5B20A8] to-[#7B2FFF] text-white flex items-center justify-center shadow-lg shadow-purple-900/25 border-2 border-white/60 shrink-0">
                    <Package className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full bg-[#FFC928]/25 text-[#7A5200] border border-[#E59C0E]/40 shadow-2xs">
                        OFFICIAL RACE PACK
                      </span>
                      <span className="text-[11px] font-bold text-[#4A1584] bg-[#F4ECFD] px-2.5 py-0.5 rounded-full border border-[#D8C2F8]">
                        รวมอยู่ในค่าสมัครทุกระยะการวิ่ง
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#25183B] tracking-tight">
                      เมื่อสมัครเข้าร่วม <span className="text-[#5B20A8]">คุณจะได้รับ</span>
                    </h3>
                  </div>
                </div>

                {/* Interactive Preview Button */}
                <button
                  type="button"
                  onClick={() => setMerchModalOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#F4ECFD] to-[#EAE0FC] hover:from-[#EAE0FC] hover:to-[#DFCEFA] text-[#3D106B] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 border-[#D8C2F8] shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <Eye className="w-4 h-4 text-[#5B20A8] group-hover:scale-110 transition-transform" />
                  <span>ดูภาพของรางวัลจริง (เสื้อ & เหรียญ 3D)</span>
                </button>
              </div>

              {/* Included Items: Clean 2x2 Grid Layout with Modern SVG Line Icons */}
              <div className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* 1. Shirt (เสื้อวิ่ง) */}
                  <div
                    onClick={() => setMerchModalOpen(true)}
                    className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-purple-100 hover:border-[#5B20A8] shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 cursor-pointer group hover:-translate-y-1 relative"
                  >
                    {/* Modern Circular Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#F4ECFD] border-2 border-[#D8C2F8] flex items-center justify-center text-[#5B20A8] shrink-0 group-hover:scale-105 group-hover:bg-[#5B20A8] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#5B20A8] transition-colors truncate">
                          เสื้อวิ่ง CHANGSUEK
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Micro-Dry Sublimation
                      </p>
                      <span className="inline-block text-[10px] font-bold text-[#5B20A8] bg-purple-50 px-2 py-0.5 rounded-full mt-1.5 border border-purple-200">
                        ระบายอากาศพิเศษ
                      </span>
                    </div>
                  </div>

                  {/* 2. Medal (เหรียญที่ระลึก) with subtle hover scale & gentle golden glow */}
                  <div
                    onClick={() => setMerchModalOpen(true)}
                    className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-amber-100 hover:border-[#E59C0E] shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(245,184,0,0.35)] transition-all duration-300 flex items-center gap-4 cursor-pointer group hover:-translate-y-1 relative"
                  >
                    {/* Modern Circular Icon Container with Golden Glow on hover */}
                    <div className="w-14 h-14 rounded-full bg-[#FFF9EA] border-2 border-[#F5D88A] flex items-center justify-center text-[#D48A06] shrink-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#F5B800] group-hover:to-[#D48A06] group-hover:text-white group-hover:shadow-[0_0_22px_rgba(245,184,0,0.55)] group-hover:border-[#E59C0E] transition-all duration-300 shadow-sm relative">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7.21 15 2.26-4.52a2 2 0 0 1 1.79-1.11h1.48a2 2 0 0 1 1.79 1.11L16.79 15" />
                        <circle cx="12" cy="17" r="5" />
                        <path d="M12 12v-1" />
                        <path d="m4.93 4.93 4.24 4.24" />
                        <path d="m14.83 9.17 4.24-4.24" />
                        <path d="M14 4h7v7" />
                        <path d="M10 4H3v7" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#D48A06] transition-colors truncate">
                          เหรียญที่ระลึก Finisher
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        หล่อนูน 3D Zinc Alloy
                      </p>
                      <span className="inline-block text-[10px] font-bold text-[#A86E00] bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 border border-amber-200">
                        พร้อมสายคล้องคอทอพิเศษ
                      </span>
                    </div>
                  </div>

                  {/* 3. Bib (หมายเลขวิ่ง) */}
                  <div className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 group hover:-translate-y-1 relative">
                    {/* Modern Circular Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#F4ECFD] border-2 border-[#D8C2F8] flex items-center justify-center text-[#5B20A8] shrink-0 group-hover:scale-105 group-hover:bg-[#5B20A8] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="3" />
                        <circle cx="7" cy="7" r="1" fill="currentColor" />
                        <circle cx="17" cy="7" r="1" fill="currentColor" />
                        <path d="M7 14h10" />
                        <path d="M9 11h6" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#5B20A8] transition-colors truncate block">
                        หมายเลขแข่งขัน (BIB)
                      </span>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        พิมพ์ชื่อเฉพาะบุคคล + ชิปจับเวลา
                      </p>
                      <span className="inline-block text-[10px] font-bold text-[#5B20A8] bg-purple-50 px-2 py-0.5 rounded-full mt-1.5 border border-purple-200">
                        ระบบ Timing RFID
                      </span>
                    </div>
                  </div>

                  {/* 4. Souvenir / Gift (ของที่ระลึกจากงาน) */}
                  <div className="bg-gradient-to-b from-[#FAF7FD] to-white rounded-2xl p-4 sm:p-5 border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 group hover:-translate-y-1 relative">
                    {/* Modern Circular Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#F4ECFD] border-2 border-[#D8C2F8] flex items-center justify-center text-[#5B20A8] shrink-0 group-hover:scale-105 group-hover:bg-[#5B20A8] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg
                        className="w-7 h-7 stroke-[1.8]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="8" width="18" height="14" rx="2" />
                        <path d="M12 8v14" />
                        <path d="M19 12H5" />
                        <path d="m7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-black text-[#25183B] leading-tight group-hover:text-[#5B20A8] transition-colors truncate block">
                        ของที่ระลึก & ประกันภัย
                      </span>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        กระเป๋าผ้า + ประกันอุบัติเหตุ
                      </p>
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-200">
                        คุ้มครองตลอดงาน
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Perforated Ticket Divider with Notches */}
              <div className="relative my-7">
                <div className="border-t-2 border-dashed border-purple-200 w-full" />
                {/* Left Ticket Notch */}
                <div className="absolute -left-6 sm:-left-8 lg:-left-9 -top-3 w-6 h-6 rounded-full bg-[#F8F5FC] border-r-2 border-[#5B20A8]/25" />
                {/* Right Ticket Notch */}
                <div className="absolute -right-6 sm:-right-8 lg:-right-9 -top-3 w-6 h-6 rounded-full bg-[#F8F5FC] border-l-2 border-[#5B20A8]/25" />
              </div>

              {/* Bottom Footer Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    นักวิ่งที่เข้าเส้นชัยตามเวลาที่กำหนดจะได้รับ <span className="font-bold text-[#5B20A8]">เหรียญ Finisher สลักชื่อ และของว่างฟื้นฟูกำลัง</span> ทุกคน
                  </p>
                </div>

                <div className="font-comic text-base sm:text-lg text-[#5B20A8] font-bold flex items-center gap-1.5 shrink-0">
                  <span>มากกว่าการวิ่ง คือการให้</span>
                  <span className="text-[#F5B800] text-xl">💛</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Merch & Race Pack Details Modal */}
      {merchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-purple-100">
            <button
              onClick={() => setMerchModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#FFC928] bg-[#3D106B] px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                OFFICIAL RACE PACK
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#25183B] mb-1">
              เสื้อวิ่ง & เหรียญรางวัลอย่างเป็นทางการ
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              CHANGSUEK RUN 2027: ผลิตจากวัสดุเกรดพรีเมียม สิทธิพิเศษเฉพาะนักวิ่งที่สมัคร
            </p>

            {/* Official product photos */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="relative group overflow-hidden rounded-2xl border border-purple-100 shadow-sm bg-purple-50/30">
                <img
                  src="/images/merch/jersey-full.jpg"
                  alt="เสื้อวิ่ง CHANGSUEK RUN 2027"
                  className="w-full h-44 sm:h-52 object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold py-1 px-2.5 rounded-lg text-center">
                  เสื้อวิ่ง Micro-Dry Sublimation
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl border border-purple-100 shadow-sm bg-purple-50/30">
                <img
                  src="/images/merch/medal-full.jpg"
                  alt="เหรียญรางวัล Finisher CHANGSUEK RUN 2027"
                  className="w-full h-44 sm:h-52 object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold py-1 px-2.5 rounded-lg text-center">
                  เหรียญหล่อนูน 3 มิติ Zinc Alloy
                </div>
              </div>
            </div>

            {/* Benefit Details List */}
            <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 mb-6">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="font-bold text-[#4A1584] mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  เสื้อวิ่งผ้าไมโครโพลีเอสเตอร์ Micro-Dry
                </div>
                <div className="text-xs text-gray-600 pl-6">
                  ระบายอากาศดีเยี่ยม นุ่มลื่น แห้งไว ไม่อมเหงื่อ พร้อมลายพิมพ์ Sublimation คุณภาพสูงไม่ลอกล่อน
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  เหรียญรางวัล Finisher โลหะผสม Zinc Alloy
                </div>
                <div className="text-xs text-gray-600 pl-6">
                  หล่อนูน 3 มิติ ลายช้างศึกและธรรมชาติริมหาดค่ายนเรศวร สลักชื่อระยะวิ่ง พร้อมสายคล้องคอทอพิเศษ
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  หมายเลขวิ่ง (BIB) & ประกันอุบัติเหตุ
                </div>
                <div className="text-xs text-gray-600 pl-6">
                  พร้อมระบบจับเวลามาตรฐาน และความคุ้มครองอุบัติเหตุตลอดระยะเวลาการแข่งขัน
                </div>
              </div>
            </div>

            {/* Modal CTA */}
            <button
              onClick={() => {
                setMerchModalOpen(false);
                onOpenRegister(selectedRoute);
              }}
              className="w-full bg-[#FFC928] hover:bg-[#F5B800] text-[#25183B] font-black py-3.5 rounded-full shadow-md text-sm transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              สมัครวิ่งและรับของที่ระลึกระยะ {selectedRoute.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

