import React from 'react';
import { Home as HomeIcon, Heart, Info, Mail } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'HOME',
  onSelectTab,
}) => {
  const navItems = [
    { label: 'HOME', icon: HomeIcon },
    { label: 'FAVOURITES', icon: Heart },
    { label: 'ABOUT', icon: Info },
    { label: 'CONTACT', icon: Mail },
  ];

  const handleNavClick = (label: string) => {
    if (onSelectTab) onSelectTab(label);
  };

  return (
    <nav className="z-30 select-none w-full md:w-auto" aria-label="Main Navigation">
      <ul className="flex flex-row md:flex-col flex-wrap justify-center sm:justify-end gap-1.5 sm:gap-2 md:gap-0 md:space-y-2.5 items-center md:items-end">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;

          return (
            <li key={item.label} className="w-auto md:w-full md:max-w-[210px]">
              <button
                onClick={() => handleNavClick(item.label)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs md:text-sm font-medium transition-all duration-300 w-full text-left rounded cursor-pointer min-h-[38px] md:min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5AD54] ${
                  isActive
                    ? 'brush-stroke-active text-[#F1D7A3] font-bold shadow-lg scale-102 md:scale-105'
                    : 'text-[#F1D7A3]/80 hover:text-[#FFFFFF] hover:bg-[#3A2116]/60 backdrop-blur-xs border border-[#F1D7A3]/10 md:border-transparent md:hover:translate-x-1.5'
                }`}
              >
                {/* Terracotta paint accent line on hover for desktop */}
                {!isActive && (
                  <span className="hidden md:block absolute left-1 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-[#B9472F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <Icon
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-all duration-300 ${
                    isActive
                      ? 'text-[#E5AD54] stroke-[2.5]'
                      : 'text-[#C88A3D] opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 group-hover:text-[#E5AD54]'
                  }`}
                />
                <span className="tracking-widest uppercase text-[10px] sm:text-xs font-semibold transition-colors duration-300 group-hover:drop-shadow-[0_1px_4px_rgba(241,215,163,0.3)]">
                  {item.label}
                </span>
                {isActive && (
                  <span className="hidden md:block absolute right-3 w-1.5 h-1.5 rounded-full bg-[#E5AD54] animate-pulse" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
