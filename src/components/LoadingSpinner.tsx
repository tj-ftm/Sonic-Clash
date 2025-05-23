import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-16 h-16';
      case 'md':
      default: return 'w-10 h-10';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${getSize()}`}>
        {/* Outer Circle */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-neon-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Circle */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full border-4 border-neon-pink"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Pixel */}
        <div className="absolute top-[calc(50%-2px)] left-[calc(50%-2px)] w-1 h-1 bg-neon-yellow" />
      </div>
      
      {message && (
        <p className="mt-4 text-xs font-pixel text-white pixelated">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;