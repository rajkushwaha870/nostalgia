import React from 'react';
import { Home as HomeIcon, Disc3, Heart, Info, Mail } from 'lucide-react';

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
    { label: 'PLAYLISTS', icon: Disc3 },
    { label: 'FAVOURITES', icon: Heart },
    { label: 'ABOUT', icon: Info },
    { label: 'CONTACT', icon: Mail },
  ];

  const handleNavClick = (label: string) => {
    if (onSelectTab) onSelectTab(label);
  };

  return (
    <nav className="z-30 select-none">
      <ul className="flex flex-col space-y-2.5 items-end">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;

          return (
            <li key={item.label} className="w-full max-w-[210px]">
              <button
                onClick={() => handleNavClick(item.label)}
                className={`group relative flex items-center space-x-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 w-full text-left rounded cursor-pointer ${
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
  );
};

