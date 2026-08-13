import React, { useState } from 'react';
import { Home as HomeIcon, Disc3, Heart, Info, Mail } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'HOME',
  onSelectTab,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const navItems = [
    { label: 'HOME', icon: HomeIcon },
    { label: 'PLAYLISTS', icon: Disc3 },
    { label: 'FAVOURITES', icon: Heart },
    { label: 'ABOUT', icon: Info },
    { label: 'CONTACT', icon: Mail },
  ];

  const handleNavClick = (label: string) => {
    setCurrentTab(label);
    if (onSelectTab) onSelectTab(label);
  };

  return (
    <div className="flex flex-col space-y-5 max-w-xs z-30 select-none">
      {/* Two-Line Vintage Indian Hand-Painted Logo (1970s-90s Signboard / Poster Style) */}
      <div className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="hand-painted-logo-wrapper flex flex-col items-center w-full max-w-[260px] sm:max-w-[300px]">
          
          {/* Line 1: nostalgia (Small, elegant retro handwritten script, warm cream/golden, centered above Devanagari) */}
          <div className="w-full text-center -mb-2 sm:-mb-2.5 z-10">
            <span className="hand-painted-logo-english text-xl sm:text-2xl md:text-[26px] font-normal tracking-wide text-[#F6E2BC]">
              nostalgia
            </span>
          </div>

          {/* Line 2: नॉस्टेल्जिया (Much larger, bold vintage Devanagari display lettering, hand-painted Bollywood poster style) */}
          <h1 className="hand-painted-logo-devanagari text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-center leading-none my-0 py-0 text-[#F3DCAC]">
            नॉस्टेल्जिया
          </h1>

        </div>

        {/* Vintage Tagline */}
        <p className="text-xs sm:text-sm font-serif italic text-[#E5AD54]/90 tracking-wide pl-1 border-l-2 border-[#B9472F]/60 py-0.5 mt-2.5">
          Some songs don't just play. <br />
          <span className="text-[#F1D7A3]/90">They take you back.</span>
        </p>
      </div>

      {/* Vertical Navigation Menu */}
      <nav className="pt-2">
        <ul className="flex flex-col space-y-2.5 items-start">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.label;

            return (
              <li key={item.label} className="w-full max-w-[210px]">
                <button
                  onClick={() => handleNavClick(item.label)}
                  className={`group relative flex items-center space-x-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 w-full text-left rounded ${
                    isActive
                      ? 'brush-stroke-active text-[#F1D7A3] font-bold shadow-lg scale-105'
                      : 'text-[#F1D7A3]/80 hover:text-[#F1D7A3] hover:translate-x-1.5 hover:bg-[#3A2116]/40 backdrop-blur-xs'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-6 ${
                      isActive ? 'text-[#E5AD54] stroke-[2.5]' : 'text-[#C88A3D] opacity-80'
                    }`}
                  />
                  <span className="tracking-widest uppercase text-xs font-semibold">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#E5AD54] animate-pulse" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
