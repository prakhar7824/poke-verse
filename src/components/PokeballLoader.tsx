import React from 'react';
import { cn } from '@/lib/utils';

interface PokeballLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PokeballLoader: React.FC<PokeballLoaderProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'relative',
        sizeClasses[size],
        'animate-pokeball-spin'
      )}>
        {/* Pokeball SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top half - red */}
          <path
            d="M50 0C77.614 0 100 22.386 100 50H50V0Z"
            fill="#ef4444"
            className="animate-glow"
          />
          {/* Bottom half - white */}
          <path
            d="M50 50H100C100 77.614 77.614 100 50 100C22.386 100 0 77.614 0 50H50Z"
            fill="#f8fafc"
          />
          {/* Top half left - red */}
          <path
            d="M0 50C0 22.386 22.386 0 50 0V50H0Z"
            fill="#dc2626"
          />
          {/* Center line */}
          <rect
            x="0"
            y="47"
            width="100"
            height="6"
            fill="#1f2937"
          />
          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="#1f2937"
            stroke="#f8fafc"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </div>
  );
};

export const PokeballLoadingText: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  text = 'Loading...', 
  size = 'md' 
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <PokeballLoader size={size} />
      <p className="text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};