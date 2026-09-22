import React from 'react';

export interface HorizonLogoProps {
  size?: number; // Height of the logo in pixels
  color?: string;
  textColor?: string;
  glow?: boolean;
  variant?: 'full' | 'icon' | 'stacked';
  className?: string;
  style?: React.CSSProperties;
}

export default function HorizonLogoIcon({
  size = 38,
  color = '#F59E0B',
  textColor,
  glow = false,
  variant = 'full',
  className = '',
  style = {}
}: HorizonLogoProps) {
  const primaryGold = color;
  const wordmarkColor = textColor || '#FFFFFF';

  // 1. ICON ONLY (Double Chevron Delta Crest)
  if (variant === 'icon') {
    return (
      <span
        className={className}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          ...style
        }}
      >
        {glow && (
          <span
            style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
              filter: 'blur(16px)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        )}
        <svg
          width={size}
          height={Math.round(size * 0.92)}
          viewBox="0 0 160 148"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
        >
          {/* Outer Chevron & Base */}
          <path
            d="M 80,6 L 10,126 L 110,126 L 110,114 L 26,114 L 80,22 L 138,72 L 148,72 Z"
            fill={primaryGold}
          />
          {/* Inner Chevron & Base */}
          <path
            d="M 80,34 L 38,106 L 110,106 L 110,96 L 49,96 L 80,44 L 122,72 L 130,72 Z"
            fill={primaryGold}
          />
        </svg>
      </span>
    );
  }

  // 2. VERTICAL STACKED VARIANT
  if (variant === 'stacked') {
    return (
      <span
        className={className}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          lineHeight: 1,
          ...style
        }}
      >
        <svg
          width={size * 1.2}
          height={size * 1.1}
          viewBox="0 0 160 148"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'inline-block', overflow: 'visible' }}
        >
          <path
            d="M 80,6 L 10,126 L 110,126 L 110,114 L 26,114 L 80,22 L 138,72 L 148,72 Z"
            fill={primaryGold}
          />
          <path
            d="M 80,34 L 38,106 L 110,106 L 110,96 L 49,96 L 80,44 L 122,72 L 130,72 Z"
            fill={primaryGold}
          />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-heading, 'Outfit', 'Inter', system-ui, sans-serif)",
            fontSize: `${Math.round(size * 0.55)}px`,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: wordmarkColor,
            textTransform: 'uppercase'
          }}
        >
          HORIZON
        </span>
      </span>
    );
  }

  // 3. OPTICALLY BALANCED HORIZONTAL LOCKUP (Full Brand Emblem)
  // Width-to-Height ratio: ~4.1:1
  const lockupWidth = Math.round(size * 4.1);

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        ...style
      }}
    >
      {glow && (
        <span
          style={{
            position: 'absolute',
            inset: '-15%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
            filter: 'blur(20px)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
      <svg
        width={lockupWidth}
        height={size}
        viewBox="0 0 380 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
      >
        {/* Outer Chevron & Base */}
        <path
          d="M 52,6 L 8,82 L 96,82 L 96,73 L 22,73 L 52,19 L 126,50 L 136,50 Z"
          fill={primaryGold}
        />
        {/* Inner Chevron & Base */}
        <path
          d="M 52,26 L 28,68 L 96,68 L 96,61 L 36,61 L 52,34 L 114,50 L 121,50 Z"
          fill={primaryGold}
        />
        {/* Bold, Prominent, Professional Wordmark HORIZON */}
        <text
          x="100"
          y="77"
          fill={wordmarkColor}
          fontFamily="var(--font-heading, 'Outfit', 'Inter', -apple-system, system-ui, sans-serif)"
          fontSize="56"
          fontWeight="900"
          letterSpacing="0.06em"
        >
          HORIZON
        </text>
      </svg>
    </span>
  );
}




