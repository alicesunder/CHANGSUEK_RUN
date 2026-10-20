import React, { useState } from 'react';
import { Trophy, Flame, Users, Medal, Heart, ChevronRight, Award, Footprints } from 'lucide-react';
import { RouteId } from '../types';

interface RunnerRecord {
  rank: number;
  name: string;
  bib: string;
  category: RouteId;
  time: string;
  pace: string;
  city: string;
  avatar: string;
  cheers: number;
  isPacer?: boolean;
}

interface CommunityTeam {
  rank: number;
  teamName: string;
  totalDistance: string;
  members: number;
  cheers: number;
  badge: string;
  bgColor: string;
}

export const LeaderboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'community'>('individual');
  const [distanceFilter, setDistanceFilter] = useState<'all' | '10km' | '5km' | '3km' | '1km'>('all');
  const [cheerCounts, setCheerCounts] = useState<{ [key: string]: number }>({});
  const [cheeredIds, setCheeredIds] = useState<{ [key: string]: boolean }>({});

  // Mock Top Runners dataset for CHANGSUEK RUN
  const runners: RunnerRecord[] = [
    {
      rank: 1,
      name: 'ชัชวาล วัฒนกุล (Chatchawal)',
      bib: 'C10-0142',
      category: '10km',
      time: '00:36:24',
      pace: '3:38 /km',
      city: 'เพชรบุรี',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      cheers: 342,
    },
    {
      rank: 2,
      name: 'พัชริดา แสนสุข (Patcharida)',
      bib: 'C10-0089',
      category: '10km',
      time: '00:38:10',
      pace: '3:49 /km',
      city: 'กรุงเทพฯ',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      cheers: 289,
    },
    {
      rank: 3,
      name: 'วรพล ธรรมศาสตร์ (Worapon)',
      bib: 'C05-0211',
      category: '5km',
      time: '00:17:45',
      pace: '3:33 /km',
      city: 'ประจวบคีรีขันธ์',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      cheers: 215,
    },
    {
      rank: 4,
      name: 'มนัสวี โชติกา (Manassavee)',
      bib: 'C05-0155',
      category: '5km',
      time: '00:19:12',
      pace: '3:50 /km',
      city: 'ชะอำ-หัวหิน',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      cheers: 178,
    },
    {
      rank: 5,
      name: 'ภานุเดช ฤทธิ์เดช & สุนัขบัดดี้ (Buddy Pacer)',
      bib: 'C03-0004',
      category: '3km',
      time: '00:14:02',
      pace: '4:40 /km',
      city: 'เพชรบุรี',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      cheers: 450,
      isPacer: true,
    },
    {
      rank: 6,
      name: 'กานต์สินี สุริยะ (Kansinee)',
      bib: 'C10-0320',
      category: '10km',
      time: '00:41:05',
      pace: '4:06 /km',
      city: 'สมุทรสงคราม',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
      cheers: 134,
    },
  ];

  // Mock Community Teams
  const communityTeams: CommunityTeam[] = [
    {
      rank: 1,
      teamName: 'ชมรมวิ่งช้างศึกเพชรบุรี (Changsuek Phetchaburi)',
      totalDistance: '1,420 KM',
      members: 128,
      cheers: 890,
      badge: '👑 สโมสรเจ้าภาพ',
      bgColor: 'from-[#3B106B] to-[#250848]',
    },
    {
      rank: 2,
      teamName: 'Cha-Am Beach Runners Club',
      totalDistance: '985 KM',
      members: 94,
      cheers: 642,
      badge: '🌊 เจ้าถิ่นริมหาด',
      bgColor: 'from-[#175B37] to-[#0F3C24]',
    },
    {
      rank: 3,
      teamName: 'เพื่อนสี่ขา พาวิ่ง (Dog & Runner Community)',
      totalDistance: '740 KM',
      members: 86,
      cheers: 1205,
      badge: '🐾 ขวัญใจมหาชน',
      bgColor: 'from-[#D48B06] to-[#996102]',
    },
    {
      rank: 4,
      teamName: 'Bangkok Weekend Striders',
      totalDistance: '620 KM',
      members: 52,
      cheers: 410,
      badge: '⚡ ทีมนักวิ่งกรุงเทพฯ',
      bgColor: 'from-[#4A154B] to-[#2F0B30]',
    },
  ];

  const handleCheer = (id: string, initialCheers: number) => {
    if (cheeredIds[id]) return;
    setCheeredIds((prev) => ({ ...prev, [id]: true }));
    setCheerCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || initialCheers) + 1,
    }));
  };

  const filteredRunners = runners.filter((r) => {
    if (distanceFilter === 'all') return true;
    return r.category === distanceFilter;
  });

  return (
    <section id="leaderboard" className="py-16 sm:py-24 bg-[#FBF9FD] relative overflow-hidden select-none">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Changsuek Brand Identity */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B106B]/10 border border-[#3B106B]/20 text-[#3B106B] text-xs font-black tracking-widest uppercase mb-3">
            <Trophy className="w-3.5 h-3.5 text-[#D48B06]" />
            <span>CHANGSUEK COMMUNITY & LEADERBOARD</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#250848] tracking-tight">
            ตารางเกียรติยศ & ชุมชนนักวิ่งช้างศึก
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium mt-2">
            ร่วมส่งกำลังใจให้นักวิ่งแนวหน้าและชมรมวิ่งที่มาร่วมสร้างประวัติศาสตร์บนเส้นทางเลียบหาดชะอำ-หัวหิน
          </p>

          {/* Toggle Tab: รายบุคคล vs ชุมชน/ทีม */}
          <div className="inline-flex items-center p-1.5 bg-white rounded-2xl border border-purple-100 shadow-sm mt-6">
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-[#3B106B] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#3B106B]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FFD633]" />
              <span>อันดับนักวิ่งรายบุคคล</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'community'
                  ? 'bg-[#3B106B] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#3B106B]'
              }`}
            >
              <Users className="w-4 h-4 text-[#FFD633]" />
              <span>ชมรม & ชุมชนคนรักวิ่ง</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INDIVIDUAL RUNNERS LEADERBOARD */}
        {activeTab === 'individual' && (
          <div>
            {/* Filter buttons by Distance */}
            <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
              {[
                { id: 'all', label: 'ทุกระยะ' },
                { id: '10km', label: '10K' },
                { id: '5km', label: '5K' },
                { id: '3km', label: 'Dog 3K 🐾' },
                { id: '1km', label: 'Dog 1K 🐾' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setDistanceFilter(filter.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    distanceFilter === filter.id
                      ? 'bg-[#FFD633] text-[#250848] border-[#FFD633] shadow-sm font-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Top 3 Podium Highlights on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {filteredRunners.slice(0, 3).map((topRunner, idx) => {
                const podiumPlace = idx === 0 ? 1 : idx === 1 ? 2 : 3;
                const medalColors =
                  podiumPlace === 1
                    ? 'border-[#FFD633] bg-gradient-to-b from-[#FFFDF2] to-white ring-2 ring-[#FFD633]/30'
                    : podiumPlace === 2
                    ? 'border-gray-300 bg-gradient-to-b from-gray-50 to-white'
                    : 'border-amber-600/40 bg-gradient-to-b from-amber-50/40 to-white';

                const medalBadge =
                  podiumPlace === 1
                    ? '🥇 อันดับ 1'
                    : podiumPlace === 2
                    ? '🥈 อันดับ 2'
                    : '🥉 อันดับ 3';

                return (
                  <div
                    key={topRunner.bib}
                    className={`rounded-3xl p-6 border transition-all hover:-translate-y-1 shadow-sm flex flex-col items-center text-center relative overflow-hidden ${medalColors}`}
                  >
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-white border border-gray-200 shadow-xs mb-3 text-[#250848]">
                      {medalBadge}
                    </span>

                    {/* Avatar */}
                    <div className="relative mb-3">
                      <img
                        src={topRunner.avatar}
                        alt={topRunner.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      {topRunner.isPacer && (
                        <span className="absolute -bottom-1 -right-1 text-base" title="วิ่งคู่สัตว์เลี้ยง">
                          🐾
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-[#250848] text-base sm:text-lg leading-tight">
                      {topRunner.name}
                    </h3>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      BIB: {topRunner.bib} • จ.{topRunner.city}
                    </div>

                    {/* Finish Time & Pace */}
                    <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-around">
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">เวลาเข้าเส้นชัย</div>
                        <div className="font-mono text-lg font-black text-[#3B106B]">
                          {topRunner.time}
                        </div>
                      </div>
                      <div className="h-7 w-[1px] bg-gray-200" />
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">ความเร็วเฉลี่ย</div>
                        <div className="font-mono text-sm font-bold text-amber-700">
                          {topRunner.pace}
                        </div>
                      </div>
                    </div>

                    {/* Cheer Button */}
                    <button
                      onClick={() => handleCheer(topRunner.bib, topRunner.cheers)}
                      className={`mt-4 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        cheeredIds[topRunner.bib]
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-[#3B106B]/5 hover:bg-[#3B106B] text-[#3B106B] hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          cheeredIds[topRunner.bib] ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span>
                        ส่งกำลังใจ ({cheerCounts[topRunner.bib] || topRunner.cheers})
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* List Table of Top Runners */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D48B06]" />
                  <span className="font-black text-[#250848] text-sm sm:text-base">
                    อันดับนักวิ่งสถิติดีเยี่ยม ({filteredRunners.length} ท่าน)
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">อัปเดตแบบเรียลไทม์</span>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredRunners.map((runner) => (
                  <div
                    key={runner.bib}
                    className="p-3.5 sm:p-4 hover:bg-purple-50/40 transition-colors flex items-center justify-between gap-3"
                  >
                    {/* Rank & Runner Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 ${
                          runner.rank === 1
                            ? 'bg-[#FFD633] text-[#250848]'
                            : runner.rank === 2
                            ? 'bg-gray-200 text-gray-700'
                            : runner.rank === 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {runner.rank}
                      </span>

                      <img
                        src={runner.avatar}
                        alt={runner.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-100 shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="font-bold text-[#250848] text-xs sm:text-sm truncate">
                          {runner.name}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 flex-wrap">
                          <span>BIB: {runner.bib}</span>
                          <span>•</span>
                          <span className="text-[#3B106B] font-bold uppercase">{runner.category}</span>
                          <span>•</span>
                          <span>{runner.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time & Cheer */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="font-mono font-black text-sm text-[#3B106B]">
                          {runner.time}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          Pace: {runner.pace}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCheer(runner.bib, runner.cheers)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          cheeredIds[runner.bib]
                            ? 'bg-red-50 text-red-600'
                            : 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-[#3B106B]'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            cheeredIds[runner.bib] ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                        <span className="font-mono">
                          {cheerCounts[runner.bib] || runner.cheers}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNITY & RUNNING CLUBS */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {communityTeams.map((team) => (
              <div
                key={team.teamName}
                className="bg-white rounded-3xl border border-purple-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Top Row: Rank & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black text-white px-3 py-1 rounded-full bg-gradient-to-r from-[#3B106B] to-[#250848]">
                    อันดับ {team.rank}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    {team.badge}
                  </span>
                </div>

                {/* Team Name */}
                <h3 className="text-base sm:text-lg font-black text-[#250848] mb-4">
                  {team.teamName}
                </h3>

                {/* Stats Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-[#FBF9FD] p-3 rounded-2xl border border-purple-50 mb-4 text-center">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">ระยะทางรวม</div>
                    <div className="font-mono text-xs sm:text-sm font-black text-[#3B106B] mt-0.5">
                      {team.totalDistance}
                    </div>
                  </div>
                  <div className="border-x border-gray-200">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">สมาชิกที่ลงทะเบียน</div>
                    <div className="font-mono text-xs sm:text-sm font-black text-[#250848] mt-0.5">
                      {team.members} ท่าน
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">คะแนนส่งใจ</div>
                    <div className="font-mono text-xs sm:text-sm font-black text-amber-600 mt-0.5">
                      {cheerCounts[team.teamName] || team.cheers}
                    </div>
                  </div>
                </div>

                {/* Send Cheer to Team */}
                <button
                  onClick={() => handleCheer(team.teamName, team.cheers)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    cheeredIds[team.teamName]
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-[#FFD633] hover:bg-[#FFE066] text-[#250848] shadow-sm'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      cheeredIds[team.teamName] ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>
                    {cheeredIds[team.teamName]
                      ? 'ส่งกำลังใจให้ชมรมแล้ว!'
                      : 'กดส่งหัวใจให้ชมรมนี้'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Motivational Banner at bottom of section */}
        <div className="mt-10 sm:mt-14 bg-gradient-to-r from-[#2A0E4E] via-[#3B106B] to-[#1E0938] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD633]/20 flex items-center justify-center text-[#FFD633] shrink-0">
              <Footprints className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black tracking-wide text-[#FFD633]">
                อยากมีชื่อของคุณบนตารางเกียรติยศ CHANGSUEK RUN?
              </h4>
              <p className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                เลือกระยะที่คุณพร้อม ซ้อมให้เต็มที่ แล้วมาก้าวไปด้วยกัน 15 กุมภาพันธ์ 2570
              </p>
            </div>
          </div>
          <a
            href="#distances"
            className="px-6 py-3 rounded-full bg-[#FFD633] hover:bg-[#FFE066] text-[#250848] font-black text-xs sm:text-sm whitespace-nowrap transition-all shadow-md transform hover:scale-105 active:scale-95"
          >
            เลือกระยะ & สมัครวิ่ง
          </a>
        </div>
      </div>
    </section>
  );
};
