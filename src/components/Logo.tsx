import React from 'react';

interface LogoProps {
  onSelectTab?: (tab: string) => void;
}

export const Logo: React.FC<LogoProps> = ({ onSelectTab }) => {
  const handleLogoClick = () => {
    if (onSelectTab) onSelectTab('HOME');
  };

  return (
    <div
      onClick={handleLogoClick}
      className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex flex-col items-center sm:items-start text-center sm:text-left select-none"
    >
      <div className="hand-painted-logo-wrapper flex flex-col items-center w-full max-w-[260px] sm:max-w-[300px]">
        {/* Line 1: nostalgia */}
        <div className="w-full text-center -mb-2 sm:-mb-2.5 z-10">
          <span className="hand-painted-logo-english text-xl sm:text-2xl md:text-[26px] font-normal tracking-wide text-[#F6E2BC]">
            nostalgia
          </span>
        </div>

        {/* Line 2: नॉस्टेल्जिया */}
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
  );
};
