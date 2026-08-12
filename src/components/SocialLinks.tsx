import React from 'react';

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 z-30">
      <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C88A3D]/70 mr-1 hidden sm:inline">
        CONNECT
      </span>

      {/* Spotify Icon */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        title="Spotify"
        className="group relative p-2 rounded-full bg-[#24150F]/80 border border-[#C88A3D]/30 text-[#F1D7A3]/80 hover:text-[#E5AD54] hover:border-[#E5AD54] hover:bg-[#3A2116] transition-all duration-300 shadow-md backdrop-blur-xs"
      >
        <svg className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.48-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.281 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.5 0z"/>
        </svg>
        <span className="sr-only">Spotify</span>
      </a>

      {/* Instagram Icon */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        title="Instagram"
        className="group relative p-2 rounded-full bg-[#24150F]/80 border border-[#C88A3D]/30 text-[#F1D7A3]/80 hover:text-[#E5AD54] hover:border-[#E5AD54] hover:bg-[#3A2116] transition-all duration-300 shadow-md backdrop-blur-xs"
      >
        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
        <span className="sr-only">Instagram</span>
      </a>

      {/* YouTube Icon */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        title="YouTube"
        className="group relative p-2 rounded-full bg-[#24150F]/80 border border-[#C88A3D]/30 text-[#F1D7A3]/80 hover:text-[#E5AD54] hover:border-[#E5AD54] hover:bg-[#3A2116] transition-all duration-300 shadow-md backdrop-blur-xs"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span className="sr-only">YouTube</span>
      </a>
    </div>
  );
};
