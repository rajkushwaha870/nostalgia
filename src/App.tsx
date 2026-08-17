import React, { useState } from 'react';
import { Home } from './pages/Home';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { SceneModeProvider } from './context/SceneModeContext';
import { LoadingScreen } from './components/LoadingScreen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('HOME');

  return (
    <SceneModeProvider>
      <MusicPlayerProvider>
        <LoadingScreen />
        <Home activeTab={activeTab} onSelectTab={setActiveTab} />
      </MusicPlayerProvider>
    </SceneModeProvider>
  );
};

export default App;

