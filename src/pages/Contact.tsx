import React from 'react';
import { ContactForm } from '../components/ContactForm';
import { Mail, Radio } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 text-center space-y-8 select-none pb-24">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#B9472F]/20 border border-[#B9472F]/50 text-[#E5AD54] text-[11px] font-mono tracking-widest uppercase">
          <Mail className="w-3.5 h-3.5 text-[#B9472F]" />
          <span>VINTAGE CORRESPONDENCE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif tracking-wider text-[#F1D7A3] hand-painted-title">
          LET'S TALK
        </h1>

        <p className="text-base sm:text-lg font-serif italic text-[#F1D7A3]/90 max-w-lg mx-auto leading-relaxed">
          Have a song, memory or idea to share?
        </p>

        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B9472F] to-transparent mx-auto opacity-70 my-2" />
      </div>

      {/* Handwritten Letter Form */}
      <div className="pt-2">
        <ContactForm />
      </div>

      {/* Footer Note Accent */}
      <div className="flex justify-center items-center space-x-2 text-[10px] font-mono text-[#C88A3D]/70 tracking-widest uppercase pt-4">
        <Radio className="w-3 h-3 text-[#B9472F]" />
        <span>NOSTALGIA POSTAL SERVICE • ESTD 1968</span>
      </div>
    </div>
  );
};
