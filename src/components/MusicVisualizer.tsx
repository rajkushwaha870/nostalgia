import React from 'react';

interface MusicVisualizerProps {
  isPlaying: boolean;
}

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying }) => {
  return (
    <div className="flex items-end space-x-1 h-3.5 px-1 select-none" title={isPlaying ? "Radio signal active" : "Radio signal paused"}>
      {[0, 1, 2, 3].map((barIndex) => (
        <span
          key={barIndex}
          className={`w-0.5 rounded-full transition-all duration-300 ${
            barIndex % 2 === 0 ? 'bg-[#F1D7A3]' : 'bg-[#B9472F]'
          } ${
            isPlaying ? 'animate-radio-signal-bar' : 'h-1 opacity-50'
          }`}
          style={
            isPlaying
              ? {
                  animationDelay: `${barIndex * 0.18}s`,
                  animationDuration: `${0.8 + barIndex * 0.25}s`,
                }
              : {}
          }
        />
      ))}
    </div>
  );
};
