import React from 'react';

interface LogoProps {
  onSelectTab?: (tab: string) => void;
}

export const Logo: React.FC<LogoProps> = ({ onSelectTab }) => {
  const handleLogoClick = () => {
    if (onSelectTab) onSelectTab('HOME');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLogoClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleLogoClick}
      onKeyDown={handleKeyDown}
      aria-label="NOSTALGIA — Return to Home"
      title="NOSTALGIA — Return to Home"
      className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex flex-col items-start text-left select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] rounded-sm p-1 max-w-[calc(100%-95px)] sm:max-w-none"
    >
      <div className="hand-painted-logo-wrapper flex flex-col items-start w-full max-w-[240px] sm:max-w-[340px]">
        {/* Line 1: nostalgia */}
        <div className="w-full text-left -mb-2 sm:-mb-3 z-10 pl-0.5">
          <span className="hand-painted-logo-english text-xl sm:text-3xl md:text-[32px] font-normal tracking-wide text-[#F6E2BC]">
            nostalgia
          </span>
        </div>

        {/* Line 2: नॉस्टैल्जिया */}
        <h1 className="hand-painted-logo-devanagari text-4xl sm:text-6xl md:text-[76px] font-bold tracking-tight text-left leading-none my-0 py-0 text-[#F8E7C9]">
          नॉस्टैल्जिया
        </h1>
      </div>

      {/* Vintage Tagline */}
      <p className="text-[11px] sm:text-sm font-serif italic text-[#F1D7A3] tracking-wide pl-2 border-l-2 border-[#B9472F] py-0.5 mt-2 sm:mt-3 drop-shadow-[0_1px_4px_rgba(20,10,5,0.95)]">
        Some songs don't just play. <br />
        <span className="text-[#E5AD54] font-medium">They take you back.</span>
      </p>
    </div>
  );
};
