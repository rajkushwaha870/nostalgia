import React, { useState } from 'react';
import { Home } from './pages/Home';
import { MusicPlayerProvider } from './context/MusicPlayerContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('HOME');

  return (
    <MusicPlayerProvider>
      <Home activeTab={activeTab} onSelectTab={setActiveTab} />
    </MusicPlayerProvider>
  );
};

export default App;
