import React from 'react';
import { HeroScene } from '../components/HeroScene';

interface HomeProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="w-full min-h-screen bg-[#24150F] overflow-x-hidden">
      <HeroScene activeTab={activeTab} onSelectTab={onSelectTab} />
    </div>
  );
};
