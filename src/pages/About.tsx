import React from 'react';
import { MemoryCard, type MemoryCardProps } from '../components/MemoryCard';
import { Radio, Disc, Sparkles, Compass } from 'lucide-react';

interface AboutProps {
  onSelectTab?: (tab: string) => void;
}

export const About: React.FC<AboutProps> = ({ onSelectTab }) => {
  const cards: MemoryCardProps[] = [
    {
      id: 'radio',
      title: 'THE OLD RADIO',
      lines: ['Before playlists,', 'there was the radio.'],
      rotation: '-rotate-2',
      stampLabel: '1965 RADIOGRAM',
    },
    {
      id: 'chai',
      title: 'EVENING CHAI',
      lines: ['A cup of chai,', 'a fading sunset,', 'and one more song.'],
      rotation: 'rotate-1',
      stampLabel: 'TEA STALL 1978',
    },
    {
      id: 'childhood',
      title: 'CHILDHOOD',
      lines: ['Some songs still', 'sound like childhood.'],
      rotation: '-rotate-1',
      stampLabel: 'GOLDEN MEMORY',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 space-y-12 sm:space-y-16 text-center select-none pb-24">
      {/* ================= 1. ABOUT HERO ================= */}
      <section className="relative p-6 sm:p-12 rounded-sm bg-[#24150F]/85 border border-[#C88A3D]/40 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Film grain and vintage texture layer */}
        <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />
        <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none" />

        {/* Vintage corner flourishes */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C88A3D]/60 pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C88A3D]/60 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C88A3D]/60 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C88A3D]/60 pointer-events-none" />

        {/* Decorative Badge Header */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#B9472F]/20 border border-[#B9472F]/50 text-[#E5AD54] text-[11px] font-mono tracking-widest uppercase mb-6">
          <Radio className="w-3.5 h-3.5 text-[#B9472F]" />
          <span>VINTAGE INDIAN AUDIO ARCHIVE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif tracking-wider text-[#F1D7A3] hand-painted-title mb-6">
          NOSTALGIA
        </h1>

        {/* Subheadings: Devanagari & English */}
        <div className="max-w-2xl mx-auto space-y-3 pt-2 pb-4">
          <p className="text-xl sm:text-2xl font-serif text-[#F3DCAC] italic font-semibold leading-relaxed tracking-wide drop-shadow-md">
            "कुछ गाने सिर्फ बजते नहीं...
            <br />
            वो आपको वापस ले जाते हैं।"
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B9472F] to-transparent mx-auto my-3 opacity-80" />
          <p className="text-base sm:text-lg font-serif italic text-[#F1D7A3]/80 leading-relaxed">
            "Some songs don't just play.
            <br />
            They take you back."
          </p>
        </div>

        {/* Small Cassette / Radio Dial Icon Accent */}
        <div className="flex items-center justify-center space-x-3 text-[#C88A3D]/60 pt-4">
          <Disc className="w-4 h-4 animate-spin-slow" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#C88A3D]">
            AIR VIVID FREQUENCY 102.4 FM
          </span>
          <Sparkles className="w-4 h-4 text-[#E5AD54]" />
        </div>
      </section>

      {/* ================= 2. ABOUT STORY ================= */}
      <section className="relative max-w-3xl mx-auto p-6 sm:p-10 rounded-sm bg-[#3A2116]/80 border border-[#B9472F]/30 shadow-xl backdrop-blur-xs text-left space-y-5">
        <div className="flex items-center space-x-3 border-b border-[#C88A3D]/30 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B9472F]" />
          <h2 className="font-serif text-lg sm:text-xl font-bold tracking-widest text-[#F1D7A3] uppercase">
            OUR STORY & PURPOSE
          </h2>
        </div>

        <p className="font-serif text-base sm:text-lg text-[#F1D7A3]/90 leading-relaxed font-normal">
          NOSTALGIA is a digital space inspired by the simple moments of old India — evening radio, village roads, chai, childhood games, dusty sunsets and songs that stayed with us.
        </p>

        <p className="font-serif text-base sm:text-lg text-[#F1D7A3]/90 leading-relaxed font-normal">
          The purpose is not to recreate another modern music streaming service.
        </p>

        <p className="font-serif italic text-base sm:text-lg text-[#E5AD54] leading-relaxed font-medium pt-1 border-l-2 border-[#B9472F] pl-4">
          It is to recreate the feeling of sitting somewhere quiet and letting a song take you somewhere else.
        </p>
      </section>

      {/* ================= 3. MEMORY CARDS ================= */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#F1D7A3] uppercase">
            FRAGMENTS OF MEMORY
          </h2>
          <p className="text-xs font-mono text-[#C88A3D] uppercase tracking-widest">
            VINTAGE PAPER POSTERS & RADIO FRAGMENTS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4 items-stretch">
          {cards.map((card) => (
            <MemoryCard key={card.id} {...card} />
          ))}
        </div>
      </section>

      {/* ================= 4. EXPLORE ACTION ================= */}
      {onSelectTab && (
        <div className="pt-6">
          <button
            onClick={() => onSelectTab('PLAYLISTS')}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#B9472F] hover:bg-[#C94B32] active:bg-[#8F3025] text-[#F1D7A3] font-mono text-xs tracking-widest uppercase font-bold rounded-xs transition-all shadow-lg hover:shadow-xl border border-[#F1D7A3]/30 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>EXPLORE MUSIC ARCHIVE</span>
          </button>
        </div>
      )}
    </div>
  );
};
