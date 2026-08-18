import React from 'react';
import { Logo } from './Logo';
import { Navbar } from './Navbar';
import { MusicPlayer } from './MusicPlayer';
import { SocialLinks } from './SocialLinks';
import { FavouritesView } from './FavouritesView';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { useParallax } from '../hooks/useParallax';
import { AmbientDust } from './AmbientDust';
import { RadioGlow } from './RadioGlow';
import { CinematicOverlay } from './CinematicOverlay';
import { RainOverlay } from './RainOverlay';
import { ModeSelector } from './ModeSelector';
import { useSceneMode } from '../context/SceneModeContext';
import { PageTransition } from './PageTransition';

interface HeroSceneProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ activeTab, onSelectTab }) => {
  const { bgX, bgY } = useParallax();
  const { mode } = useSceneMode();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#24150F] text-[#F1D7A3] select-none">
      
      {/* 1. BACKGROUND SCENE ARTWORK & CINEMATIC OVERLAYS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Daytime / Default Scene Artwork */}
        <picture>
          <source media="(max-width: 767px)" srcSet="/hero-mobile-bg.jpg" />
          <img
            src="/hero-bg.png"
            alt="Vintage Indian Village Tea Stall Scene with Radio Listener"
            loading="eager"
            // @ts-expect-error fetchpriority attribute
            fetchpriority="high"
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-700 ease-in-out filter brightness-100 contrast-105 saturate-105 ${
              mode === 'night' ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transform: `translate3d(${bgX}px, ${bgY}px, 0) scale(1.04)`,
            }}
          />
        </picture>

        {/* Night Scene Artwork */}
        <img
          src="/hero-night-bg.png"
          alt="Vintage Indian Village Tea Stall Scene at Night"
          loading="eager"
          // @ts-expect-error fetchpriority attribute
          fetchpriority="high"
          className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-700 ease-in-out filter brightness-100 contrast-105 saturate-105 ${
            mode === 'night' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate3d(${bgX}px, ${bgY}px, 0) scale(1.04)`,
          }}
        />

        {/* Radio Ambient Glow connected to Audio State */}
        <RadioGlow />

        {/* Dynamic Mode Atmospheric Overlays */}
        {mode === 'normal' && (
          <>
            <CinematicOverlay />
            <AmbientDust />
          </>
        )}

        {mode === 'rain' && <RainOverlay />}
      </div>

      {/* 2. TOP SECTION: BRANDING / LOGO (LEFT) & NAVBAR (RIGHT) */}
      <header className="relative z-30 pt-3 sm:pt-6 md:pt-8 px-3.5 sm:px-8 md:px-16 flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0">
        {/* Left: Vintage Indian Logo & Tagline */}
        <Logo onSelectTab={onSelectTab} />

        {/* Right / Top-Right: Mode Selector & Navigation Menu */}
        <div className="absolute top-3.5 right-3.5 sm:top-6 sm:right-8 md:static flex items-center space-x-1.5 sm:space-x-3 pt-0 md:pt-2 z-40">
          <ModeSelector />
          <Navbar activeTab={activeTab} onSelectTab={onSelectTab} />
        </div>
      </header>

      {/* 3. MIDDLE SECTION: DYNAMIC CONTENT WITH SMOOTH CINEMATIC PAGE TRANSITION */}
      <main className="relative z-20 flex-1 my-3 sm:my-4 px-3 sm:px-8 md:px-12 flex flex-col justify-center">
        <PageTransition activeKey={activeTab}>
          {activeTab === 'HOME' && (
            <div className="flex items-end justify-end pointer-events-none py-6 sm:py-12">
              {/* Right Atmospheric Quote Overlay */}
              <div className="hidden lg:block text-right max-w-sm ml-auto opacity-90 pb-4">
                <p className="text-lg font-serif italic text-[#F1D7A3]/90 leading-relaxed drop-shadow-md">
                  "A memory is a song that plays softly inside the heart, returning with every gentle sunset..."
                </p>
                <span className="text-xs font-mono text-[#E5AD54] uppercase tracking-widest mt-2 block">
                  — AIR VIVID RETRO
                </span>
              </div>
            </div>
          )}

          {activeTab === 'FAVOURITES' && (
            <div>
              <FavouritesView onSelectTab={onSelectTab} />
            </div>
          )}

          {activeTab === 'ABOUT' && (
            <div>
              <About onSelectTab={onSelectTab} />
            </div>
          )}

          {activeTab === 'CONTACT' && (
            <div>
              <Contact />
            </div>
          )}
        </PageTransition>
      </main>

      {/* 4. BOTTOM SECTION: SOCIAL LINKS & TRANSPARENT MUSIC PLAYER */}
      <footer className="relative z-30 px-2 sm:px-8 pb-3 sm:pb-4 flex flex-col space-y-3 sm:space-y-4">
        {/* Social Links Placement */}
        <div className="flex justify-between items-center px-2 sm:px-4">
          <SocialLinks />
          <div className="text-[10px] font-mono text-[#C88A3D]/70 tracking-widest hidden sm:block">
            NOSTALGIA © 1970 - 1999 • ARCHIVE PART 3
          </div>
        </div>

        {/* Bottom Transparent Music Player Console */}
        <MusicPlayer />
      </footer>

    </div>
  );
};
