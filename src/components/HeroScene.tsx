import React from 'react';
import { User } from 'lucide-react';
import { Logo } from './Logo';
import { Navbar } from './Navbar';
import { MusicPlayer } from './MusicPlayer';
import { SocialLinks } from './SocialLinks';
import { Playlists } from '../pages/Playlists';
import { FavouritesView } from './FavouritesView';

interface HeroSceneProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#24150F] text-[#F1D7A3] select-none">
      
      {/* 1. BACKGROUND SCENE ARTWORK & OVERLAYS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Main Digital Painting Image */}
        <img
          src="/hero-bg.png"
          alt="Vintage Indian Village Tea Stall Scene with Radio Listener"
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-10000 ease-linear animate-subtle-pulse filter brightness-100 contrast-105 saturate-105"
        />

        {/* Subtle Sunset Glow & Vignette Enhancements */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#24150F]/95 via-transparent to-[#24150F]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#24150F]/80 via-transparent to-[#24150F]/40 pointer-events-none" />

        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 paper-texture opacity-50" />

        {/* Film Grain Texture Overlay */}
        <div className="absolute inset-0 film-grain opacity-30 mix-blend-overlay" />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 vignette-overlay" />

        {/* Floating Sunset Dust Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#E5AD54] opacity-40 animate-dust-float"
              style={{
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 15}s`,
                boxShadow: '0 0 6px #E5AD54',
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. TOP SECTION: BRANDING / LOGO (LEFT) & SIGN IN + NAVBAR (RIGHT) */}
      <header className="relative z-30 pt-6 sm:pt-8 px-6 sm:px-12 md:px-16 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-0">
        {/* Left: Vintage Indian Logo & Tagline */}
        <Logo onSelectTab={onSelectTab} />

        {/* Right: SIGN IN Button & Vertical Navigation Menu */}
        <div className="flex flex-col items-center sm:items-end space-y-5 pt-2">
          <button
            onClick={() => {}}
            className="group relative flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#24150F]/80 border border-[#C88A3D]/50 text-[#F1D7A3] hover:text-[#E5AD54] hover:border-[#E5AD54] hover:bg-[#3A2116] transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer"
            title="Sign In"
          >
            <div className="p-1 rounded-full bg-[#3A2116] border border-[#C88A3D]/40 text-[#E5AD54] group-hover:border-[#E5AD54] transition-colors">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase">
              SIGN IN
            </span>
            <div className="absolute -inset-0.5 rounded-full bg-[#E5AD54]/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Right-aligned Vertical Navigation */}
          <Navbar activeTab={activeTab} onSelectTab={onSelectTab} />
        </div>
      </header>

      {/* 3. MIDDLE SECTION: DYNAMIC CONTENT WITH FAST SUBTLE PAGE TRANSITION */}
      <main className="relative z-20 flex-1 my-4 px-4 sm:px-8 md:px-12 flex flex-col justify-center">
        {activeTab === 'HOME' && (
          <div className="transition-all duration-300 ease-out transform translate-y-0 opacity-100 flex items-end justify-end pointer-events-none py-12">
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

        {activeTab === 'PLAYLISTS' && (
          <div className="transition-all duration-300 ease-out transform translate-y-0 opacity-100">
            <Playlists />
          </div>
        )}

        {activeTab === 'FAVOURITES' && (
          <div className="transition-all duration-300 ease-out transform translate-y-0 opacity-100">
            <FavouritesView />
          </div>
        )}

        {(activeTab === 'ABOUT' || activeTab === 'CONTACT') && (
          <div className="transition-all duration-300 ease-out transform translate-y-0 opacity-100 max-w-2xl mx-auto py-12 text-center bg-[#24150F]/90 border border-[#C88A3D]/40 rounded p-8">
            <h2 className="text-3xl font-serif font-bold text-[#F1D7A3] mb-3">
              ABOUT NOSTALGIA ARCHIVE
            </h2>
            <p className="text-sm font-serif italic text-[#F1D7A3]/80 leading-relaxed mb-6">
              NOSTALGIA is a digital tribute to classic Indian cinema, vinyl recordings, and transistor radio broadcasts from the 1960s to 1990s.
            </p>
            <button
              onClick={() => onSelectTab('PLAYLISTS')}
              className="px-6 py-2.5 bg-[#B9472F] text-[#F1D7A3] font-mono text-xs tracking-widest uppercase rounded border border-[#F1D7A3]/30 hover:bg-[#C94B32] transition-colors"
            >
              EXPLORE PLAYLISTS
            </button>
          </div>
        )}
      </main>

      {/* 4. BOTTOM SECTION: SOCIAL LINKS & MUSIC PLAYER */}
      <footer className="relative z-30 px-4 sm:px-8 pb-4 flex flex-col space-y-4">
        {/* Social Links Placement */}
        <div className="flex justify-between items-center px-4">
          <SocialLinks />
          <div className="text-[10px] font-mono text-[#C88A3D]/70 tracking-widest hidden sm:block">
            NOSTALGIA © 1970 - 1999 • ARCHIVE PART 3
          </div>
        </div>

        {/* Bottom Music Player Console */}
        <MusicPlayer />
      </footer>

    </div>
  );
};
