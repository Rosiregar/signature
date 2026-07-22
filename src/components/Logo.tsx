import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
}

export default function Logo({ className = '', size = 'md', showDetails = true }: LogoProps) {
  // Determine dimensions
  const dimensions = {
    sm: { width: 50, height: 50, scale: 0.15 },
    md: { width: 120, height: 120, scale: 0.35 },
    lg: { width: 220, height: 220, scale: 0.65 },
    xl: { width: 340, height: 340, scale: 1 }
  };

  const { scale } = dimensions[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} id="elizabeth-gallery-logo">
      <div 
        style={{ width: dimensions[size].width, height: dimensions[size].height }}
        className="relative flex items-center justify-center select-none overflow-visible"
      >
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle glowing background aura */}
          <defs>
            <radialGradient id="aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff3e0" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#e0f2f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6C29E" />
              <stop offset="50%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#B38150" />
            </linearGradient>

            <linearGradient id="navy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7E9680" />
              <stop offset="100%" stopColor="#5B745C" />
            </linearGradient>
            
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#9c8c70" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background aura circle */}
          <circle cx="250" cy="250" r="230" fill="url(#aura)" />

          {/* Golden and Navy Double Circular Frame (Oval) */}
          <ellipse 
            cx="250" 
            cy="245" 
            rx="195" 
            ry="145" 
            stroke="url(#navy-grad)" 
            strokeWidth="5" 
            filter="url(#shadow)"
          />
          <ellipse 
            cx="250" 
            cy="245" 
            rx="187" 
            ry="137" 
            stroke="url(#gold-grad)" 
            strokeWidth="2" 
          />

          {/* Golden leafy branch accents on top/left and bottom/right boundaries */}
          {/* Top-Left Foliage */}
          <path 
            d="M 90 190 C 80 160, 110 130, 140 120" 
            stroke="url(#gold-grad)" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path d="M 100 165 C 95 155, 85 155, 95 165 Z" fill="url(#gold-grad)" />
          <path d="M 115 145 C 110 135, 100 138, 110 148 Z" fill="url(#gold-grad)" />
          <path d="M 135 130 C 130 120, 122 125, 130 133 Z" fill="url(#gold-grad)" />

          {/* Bottom-Right Foliage */}
          <path 
            d="M 360 300 C 390 310, 410 270, 420 240" 
            stroke="url(#gold-grad)" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path d="M 380 295 C 390 290, 395 280, 385 290 Z" fill="url(#gold-grad)" />
          <path d="M 400 275 C 410 270, 412 260, 403 270 Z" fill="url(#gold-grad)" />
          <path d="M 412 250 C 420 242, 418 235, 410 245 Z" fill="url(#gold-grad)" />

          {/* Five-point Golden Crown in the middle top */}
          <g transform="translate(215, 125) scale(0.14)" fill="url(#gold-grad)">
            {/* Crown Path */}
            <path d="M50,280 L20,100 L140,200 L250,50 L360,200 L480,100 L450,280 Z" />
            <rect x="50" y="280" width="400" height="40" rx="10" />
            {/* Jewels */}
            <circle cx="20" cy="90" r="15" />
            <circle cx="140" cy="190" r="15" />
            <circle cx="250" cy="40" r="18" />
            <circle cx="360" cy="190" r="15" />
            <circle cx="480" cy="90" r="15" />
          </g>

          {/* Stylized Script "Elizabeth" text */}
          <text 
            x="250" 
            y="240" 
            textAnchor="middle" 
            fontFamily="'Playfair Display', 'Georgia', serif" 
            fontWeight="bold" 
            fontSize="78" 
            fill="url(#navy-grad)"
            fontStyle="italic"
            letterSpacing="-1"
          >
            Elizabeth
          </text>

          {/* Subtitle "signature gallery" */}
          <text 
            x="250" 
            y="285" 
            textAnchor="middle" 
            fontFamily="'Inter', 'Arial', sans-serif" 
            fontWeight="600" 
            fontSize="26" 
            fill="url(#gold-grad)"
            letterSpacing="2"
          >
            signature gallery
          </text>

          {/* Details: WhatsApp Number & Instagram handle */}
          <text 
            x="250" 
            y="322" 
            textAnchor="middle" 
            fontFamily="'JetBrains Mono', 'Courier New', monospace" 
            fontWeight="bold" 
            fontSize="18" 
            fill="#44403c"
          >
            081344780652
          </text>
          <text 
            x="250" 
            y="345" 
            textAnchor="middle" 
            fontFamily="'JetBrains Mono', 'Courier New', monospace" 
            fontWeight="500" 
            fontSize="16" 
            fill="#78716c"
          >
            @zelida00
          </text>
        </svg>
      </div>

      {showDetails && size === 'lg' && (
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold text-stone-800">Elizabeth Signature Gallery</p>
          <p className="text-xs text-stone-500">Premium Bouquet Specialist</p>
        </div>
      )}
    </div>
  );
}
