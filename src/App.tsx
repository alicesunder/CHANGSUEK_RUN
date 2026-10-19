/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RouteId } from './types';
import { CustomCursor } from './components/CustomCursor';
import { EasterEggElephant } from './components/EasterEggElephant';
import { RegistrationModal } from './components/RegistrationModal';
import { ArtworkViewerModal } from './components/ArtworkViewerModal';
import { DistanceComparisonModal } from './components/DistanceComparisonModal';
import { VideoTeaserModal } from './components/VideoTeaserModal';
import { PaceCalculatorModal } from './components/PaceCalculatorModal';
import { RunnerCenter } from './components/RunnerCenter';
import { InteractiveRouteMap } from './components/InteractiveRouteMap';
import { ChangsuekRunExperience } from './components/ChangsuekRunExperience';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventIntro } from './components/EventIntro';
import { RaceDistances } from './components/RaceDistances';
import { EventHighlights } from './components/EventHighlights';
import { RouteAndScheduleSection } from './components/RouteAndScheduleSection';
import { HotelExplorer } from './components/HotelExplorer';
import { LeaderboardSection } from './components/LeaderboardSection';
import { EventWeatherForecast } from './components/EventWeatherForecast';
import { EssentialRunnerChecklist } from './components/EssentialRunnerChecklist';
import { FAQSection } from './components/FAQSection';
import { EventCtaBanner } from './components/EventCtaBanner';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedRoute, setSelectedRoute] = useState<RouteId>('3km');
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerTargetRoute, setRegisterTargetRoute] = useState<RouteId>('3km');
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [paceModalOpen, setPaceModalOpen] = useState(false);
  const [runnerCenterOpen, setRunnerCenterOpen] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [simulationTriggerRoute, setSimulationTriggerRoute] = useState<RouteId | null>(null);

  const handleSelectDistance = (distance: RouteId) => {
    setSelectedRoute(distance);
    const elem = document.getElementById('interactive-map');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToMap = () => {
    const elem = document.getElementById('interactive-map');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenRegister = (distance?: RouteId) => {
    if (distance) {
      setRegisterTargetRoute(distance);
    } else {
      setRegisterTargetRoute(selectedRoute);
    }
    setRegisterModalOpen(true);
  };

  const handleOpenSimulation = (routeId?: RouteId) => {
    const targetRoute = routeId || selectedRoute || '3km';
    setSelectedRoute(targetRoute);
    setSimulationTriggerRoute(targetRoute);
    setTimeout(() => {
      const elem = document.getElementById('interactive-map');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17151C] font-sans antialiased selection:bg-[#FFCC00] selection:text-[#17151C] relative overflow-x-hidden pb-16 lg:pb-0">
      {/* 1. Desktop Custom Cursor */}
      <CustomCursor />

      {/* 2. Easter Egg Elephant */}
      <EasterEggElephant
        isActive={easterEggActive}
        onClose={() => setEasterEggActive(false)}
      />

      {/* 3. Navbar matching mockup (with Runner Center entry) */}
      <Navbar
        onOpenArtworkModal={() => setArtworkModalOpen(true)}
        onOpenRegisterModal={() => handleOpenRegister()}
        onOpenRunnerCenter={() => setRunnerCenterOpen(true)}
        onEasterEggTrigger={() => setEasterEggActive(true)}
      />

      {/* Main Content Experience strictly matching user reference layout */}
      <main>
        {/* 4. Hero Section */}
        <Hero
          onOpenArtworkModal={() => setArtworkModalOpen(true)}
          onOpenRegisterModal={() => handleOpenRegister()}
          onSelectDistance={handleSelectDistance}
        />

        {/* 5. CHANGSUEK RUN EXPERIENCE (Flagship 6-step Journey Section) */}
        <ChangsuekRunExperience
          onOpenRegister={handleOpenRegister}
          onOpenRunnerCenter={() => setRunnerCenterOpen(true)}
          onOpenSimulation={handleOpenSimulation}
          onSelectRoute={setSelectedRoute}
        />

        {/* 6. แรงบันดาลใจจากช้าง สู่เส้นทางที่ยิ่งใหญ่กว่า (Inspiration Section) */}
        <EventIntro onOpenVideoModal={() => setVideoModalOpen(true)} />

        {/* 7. ระยะวิ่ง (4 distance cards + เสื้อวิ่ง & เหรียญรางวัล) */}
        <RaceDistances
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
          onScrollToMap={handleScrollToMap}
          onOpenRegister={handleOpenRegister}
          onOpenComparisonModal={() => setComparisonModalOpen(true)}
          onOpenPaceModal={() => setPaceModalOpen(true)}
        />

        {/* 8. ไฮไลท์งาน (9 white cards with purple line icons) */}
        <EventHighlights />

        {/* 9. กำหนดการวันแข่งขัน (Race Day Schedule) */}
        <RouteAndScheduleSection
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
          onOpenArtworkModal={() => setArtworkModalOpen(true)}
          onOpenSimulation={handleOpenSimulation}
        />

        {/* 10. แผนที่เส้นทางหลักหนึ่งเดียว: เส้นทางวิ่งสำรวจ (GPS Survey) — CHANGSUEK RUN ROUTE MAP */}
        <InteractiveRouteMap
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
          onOpenArtworkModal={() => setArtworkModalOpen(true)}
          onOpenRunnerCenter={() => setRunnerCenterOpen(true)}
          initialSimulationActive={simulationTriggerRoute !== null}
        />

        {/* 11. ที่พักใกล้สถานที่จัดงาน (2 featured hotel cards + expandable directory) */}
        <HotelExplorer />

        {/* 12. ตารางเกียรติยศ & ชุมชนนักวิ่งช้างศึก (Leaderboard & Community) */}
        <LeaderboardSection />

        {/* 13. พยากรณ์อากาศวันแข่ง & เตรียมความพร้อมอุปกรณ์ (Real-Time Weather Forecast) */}
        <EventWeatherForecast />

        {/* 14. เช็กลิสต์อุปกรณ์จำเป็นสำหรับนักวิ่ง (Essential Runner Checklist) */}
        <EssentialRunnerChecklist />

        {/* 15. คำถามที่พบบ่อย (FAQ) */}
        <FAQSection />

        {/* 16. CTA Banner: พร้อมแล้วใช่ไหม? มาร่วมเป็นส่วนหนึ่งของ CHANGSUEK RUN */}
        <EventCtaBanner onOpenRegisterModal={() => handleOpenRegister()} />
      </main>

      {/* 17. Footer matching mockup */}
      <Footer
        onOpenArtworkModal={() => setArtworkModalOpen(true)}
        onOpenRegisterModal={() => handleOpenRegister()}
      />

      {/* 18. Mobile Bottom Navigation with Runner Center & Quick Actions */}
      <MobileBottomNav
        onOpenRegisterModal={() => handleOpenRegister()}
        onOpenRunnerCenter={() => setRunnerCenterOpen(true)}
        onOpenSimulation={() => handleOpenSimulation()}
      />

      {/* Modals & Dialogs */}
      <RunnerCenter
        isOpen={runnerCenterOpen}
        onClose={() => setRunnerCenterOpen(false)}
        onOpenRegisterModal={() => {
          setRunnerCenterOpen(false);
          handleOpenRegister();
        }}
        onOpenSimulation={(routeId) => {
          setRunnerCenterOpen(false);
          handleOpenSimulation(routeId);
        }}
        onSelectRoute={setSelectedRoute}
      />

      <RegistrationModal
        isOpen={registerModalOpen}
        initialRoute={registerTargetRoute}
        onClose={() => setRegisterModalOpen(false)}
        onRegistrationSuccess={() => {
          setRegisterModalOpen(false);
          setRunnerCenterOpen(true);
        }}
      />

      <ArtworkViewerModal
        isOpen={artworkModalOpen}
        onClose={() => setArtworkModalOpen(false)}
        onOpenSimulation={(routeId) => {
          setArtworkModalOpen(false);
          handleOpenSimulation(routeId);
        }}
        onOpenRunnerCenter={() => {
          setArtworkModalOpen(false);
          setRunnerCenterOpen(true);
        }}
      />

      <DistanceComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onSelectRouteToRegister={(route: RouteId) => {
          setSelectedRoute(route);
          setComparisonModalOpen(false);
          handleOpenRegister(route);
        }}
      />

      <VideoTeaserModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onOpenRegisterModal={() => {
          setVideoModalOpen(false);
          handleOpenRegister();
        }}
      />

      <PaceCalculatorModal
        isOpen={paceModalOpen}
        onClose={() => setPaceModalOpen(false)}
        onOpenRegisterModal={(route: RouteId) => {
          setPaceModalOpen(false);
          handleOpenRegister(route);
        }}
      />
    </div>
  );
}
