import React from 'react';

export interface HorizonLogoProps {
  size?: number;
  color?: string;
  accentColor?: string;
  glow?: boolean;
  variant?: 'icon' | 'full';
  className?: string;
  style?: React.CSSProperties;
}

export default function HorizonLogoIcon({
  size = 48,
  color = '#F59E0B',
  accentColor,
  glow = false,
  variant = 'icon',
  className = '',
  style = {}
}: HorizonLogoProps) {
  const primaryFill = color;
  const secondaryFill = accentColor || color;

  if (variant === 'full') {
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
          width={size * 1.6}
          height={Math.round(size * 0.95)}
          viewBox="150 15 760 490"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
        >
          {/* Outer Chevron & Base */}
          <path
            d="M 482,20 L 165,495 L 390,494 L 390,476 L 203,475 L 481,58 L 630,280 L 656,281 Z"
            fill={primaryFill}
          />
          {/* Inner Chevron & Base */}
          <path
            d="M 482,93 L 239,457 L 390,457 L 390,443 L 268,441 L 481,122 L 587,279 L 607,281 Z"
            fill={secondaryFill}
          />
          {/* Wordmark HORIZON */}
          <text
            x="420"
            y="426"
            fill={primaryFill}
            fontFamily="var(--font-heading, 'Outfit', 'Inter', system-ui, sans-serif)"
            fontSize="88"
            fontWeight="900"
            letterSpacing="0.04em"
          >
            HORIZON
          </text>
        </svg>
      </span>
    );
  }

  // Icon only (the double chevron delta crest)
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
        height={Math.round(size * 0.96)}
        viewBox="160 15 500 485"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
      >
        {/* Outer Chevron & Base */}
        <path
          d="M 482,20 L 165,495 L 390,494 L 390,476 L 203,475 L 481,58 L 630,280 L 656,281 Z"
          fill={primaryFill}
        />
        {/* Inner Chevron & Base */}
        <path
          d="M 482,93 L 239,457 L 390,457 L 390,443 L 268,441 L 481,122 L 587,279 L 607,281 Z"
          fill={secondaryFill}
        />
      </svg>
    </span>
  );
}


