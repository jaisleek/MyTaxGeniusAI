import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className}
    >
      <defs>
        <linearGradient id="primaryGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#103783" />
          <stop offset="50%" stopColor="#184890" />
          <stop offset="100%" stopColor="#48d5cb" />
        </linearGradient>
        <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#48d5cb" />
          <stop offset="100%" stopColor="#184890" />
        </linearGradient>
        <mask id="boltMask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <path d="M 50 34 L 41 47 L 48 47 L 44 57 L 55 44 L 48 44 Z" fill="black" />
        </mask>
      </defs>

      {/* Lightbulb Group */}
      <g mask="url(#boltMask)">
        {/* Bulb body */}
        <path 
          d="M 36 44 A 12 12 0 1 1 60 44 C 60 54 54 58 54 62 L 42 62 C 42 58 36 54 36 44 Z" 
          fill="url(#bulbGrad)" 
        />
        {/* Bulb base */}
        <rect x="44" y="64" width="8" height="3" fill="url(#primaryGrad)" rx="1" />
        <polygon points="45,68 51,68 48,71" fill="url(#primaryGrad)" />
      </g>

      {/* Light Rays */}
      <path 
        d="M 28 44 L 20 44 M 34 32 L 26 24 M 48 26 L 48 18 M 62 32 L 70 24" 
        stroke="url(#bulbGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />

      {/* M + Arrow Base */}
      <g fill="none" stroke="url(#primaryGrad)" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Main sweeping path */}
        <path d="M 20 76 L 35 52 L 48 68 L 76 30" />
        
        {/* Arrow Head */}
        <path d="M 63 30 L 76 30 L 76 43" />
        
        {/* Right Foot */}
        <path d="M 56 56 L 68 76" />
      </g>
    </svg>
  );
};
