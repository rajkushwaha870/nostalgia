import React, { useState, useRef, useEffect } from 'react';
import { Home as HomeIcon, Heart, Info, Mail, Menu, X, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'HOME',
  onSelectTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'HOME', icon: HomeIcon },
    { label: 'FAVOURITES', icon: Heart },
    { label: 'ABOUT', icon: Info },
    { label: 'CONTACT', icon: Mail },
  ];

  // Close menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNavClick = (label: string) => {
    if (onSelectTab) {
      onSelectTab(label);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left select-none z-40" ref={menuRef}>
      {/* Compact MENU Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Main Navigation Menu"
        title="Open Navigation Menu"
        className={`group flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium tracking-wider backdrop-blur-md border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E5AD54] ${
          isOpen
            ? 'bg-[#3A2116]/90 text-[#F1D7A3] border-[#E5AD54] shadow-[0_0_12px_rgba(229,173,84,0.3)]'
            : 'bg-[#1E110C]/85 text-[#F1D7A3]/90 hover:text-[#F1D7A3] hover:bg-[#3A2116]/70 border-[#C88A3D]/40 hover:border-[#E5AD54]/60 shadow-[0_2px_10px_rgba(0,0,0,0.4)]'
        }`}
      >
        {isOpen ? (
          <X className="w-3.5 h-3.5 text-[#E5AD54] transition-transform duration-200" />
        ) : (
          <Menu className="w-3.5 h-3.5 text-[#E5AD54] transition-transform duration-200 group-hover:scale-110" />
        )}
        <span className="hidden sm:inline font-semibold uppercase tracking-widest text-[10px] sm:text-[11px] text-[#F1D7A3]">
          MENU
        </span>
      </button>

      {/* Popover / Dropdown Navigation Menu */}
      {isOpen && (
        <nav
          role="menu"
          aria-orientation="vertical"
          aria-label="Site pages"
          className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#1E110C]/95 backdrop-blur-xl border border-[#C88A3D]/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)] py-1.5 z-50 animate-fade-in divide-y divide-[#C88A3D]/15 focus:outline-none"
        >
          <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-[#E5AD54]/70 flex items-center space-x-1">
            <Compass className="w-2.5 h-2.5" />
            <span>Navigate</span>
          </div>

          <div className="py-1 space-y-0.5 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;

              return (
                <button
                  key={item.label}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavClick(item.label)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#B9472F] text-[#F1D7A3] font-semibold shadow-[0_2px_8px_rgba(185,71,47,0.4)] border border-[#F1D7A3]/30'
                      : 'text-[#F1D7A3]/80 hover:text-[#F1D7A3] hover:bg-[#3A2116]/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? 'text-[#F1D7A3]'
                          : 'text-[#C88A3D]'
                      }`}
                    />
                    <span className="font-semibold">{item.label}</span>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F1D7A3] shadow-[0_0_6px_rgba(241,215,163,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
