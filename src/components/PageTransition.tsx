import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  activeKey: string;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ activeKey, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(activeKey);

  useEffect(() => {
    if (activeKey !== currentKey) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentKey(activeKey);
        setIsVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [activeKey, currentKey]);

  return (
    <div
      className={`transition-all duration-350 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
};
