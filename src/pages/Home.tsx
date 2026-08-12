import React from 'react';
import { HeroScene } from '../components/HeroScene';

export const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#24150F] overflow-x-hidden">
      <HeroScene />
    </div>
  );
};
