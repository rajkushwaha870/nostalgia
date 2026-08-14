import React from 'react';
import { Radio, Coffee, Sparkles } from 'lucide-react';

export interface MemoryCardProps {
  id: 'radio' | 'chai' | 'childhood';
  title: string;
  lines: string[];
  rotation: string; // e.g. "-rotate-2", "rotate-1", "-rotate-1" or style object
  stampLabel?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  id,
  title,
  lines,
  rotation,
  stampLabel = '1975 ARCHIVE',
}) => {
  const getIcon = () => {
    switch (id) {
      case 'radio':
        return <Radio className="w-5 h-5 text-[#B9472F]" />;
      case 'chai':
        return <Coffee className="w-5 h-5 text-[#B9472F]" />;
      case 'childhood':
        return <Sparkles className="w-5 h-5 text-[#B9472F]" />;
      default:
        return <Radio className="w-5 h-5 text-[#B9472F]" />;
    }
  };

  return (
    <div
      className={`relative group p-6 sm:p-7 rounded-sm bg-[#F3E5CA] text-[#24150F] shadow-xl border border-[#C88A3D]/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${rotation}`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(225, 205, 170, 0.6) 100%), linear-gradient(135deg, rgba(200, 138, 61, 0.05), rgba(185, 71, 47, 0.05))`,
      }}
    >
      {/* Decorative vintage paper corner tape / corner mount */}
      <div className="absolute -top-2 left-6 w-12 h-4 bg-[#E0CFB3]/80 border-l border-r border-[#C88A3D]/30 rotate-[-4deg] shadow-xs pointer-events-none opacity-80" />
      <div className="absolute -bottom-2 right-6 w-12 h-4 bg-[#E0CFB3]/80 border-l border-r border-[#C88A3D]/30 rotate-[3deg] shadow-xs pointer-events-none opacity-80" />

      {/* Decorative Stamp / Postage Mark */}
      <div className="absolute top-4 right-4 border border-[#B9472F]/50 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest text-[#8F3025] uppercase opacity-75 rotate-[6deg]">
        {stampLabel}
      </div>

      {/* Inner decorative border */}
      <div className="border border-dashed border-[#B9472F]/30 p-4 sm:p-5 h-full flex flex-col justify-between rounded-xs">
        {/* Header with Icon */}
        <div className="flex items-center space-x-3 mb-4 border-b border-[#C88A3D]/25 pb-3">
          <div className="p-1.5 bg-[#E8D4B4] rounded-full border border-[#B9472F]/20">
            {getIcon()}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#3A2116] uppercase">
            {title}
          </h3>
        </div>

        {/* Content Quote */}
        <div className="my-2 flex-1 flex flex-col justify-center">
          {lines.map((line, index) => (
            <p
              key={index}
              className="font-serif italic text-base sm:text-lg text-[#3A2116]/90 leading-relaxed font-medium"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Vintage Footer motif */}
        <div className="mt-4 pt-2 border-t border-[#C88A3D]/20 flex justify-between items-center text-[10px] font-mono text-[#8F3025]/70 tracking-widest">
          <span>AIR VIVID RETRO</span>
          <span>• • •</span>
        </div>
      </div>
    </div>
  );
};
