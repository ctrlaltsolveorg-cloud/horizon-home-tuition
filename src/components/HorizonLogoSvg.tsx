import React from 'react';

export interface HorizonLogoProps {
  size?: number;
  color?: string;
  accentColor?: string;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function HorizonLogoIcon({
  size = 48,
  color = '#F59E0B',
  accentColor,
  glow = false,
  className = '',
  style = {}
}: HorizonLogoProps) {
  const height = Math.round(size * 0.86);
  const mainFill = color;
  const secondaryFill = accentColor || color;

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
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
            filter: 'blur(16px)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
      <svg
        width={size}
        height={height}
        viewBox="60 30 870 750"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
      >
        {/* Main Body with cutout window and ascension arrow */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 502,51 L 297,394 L 379,396 L 435,488 L 477,411 L 467,324 L 430,314 L 501,201 L 567,317 L 530,323 L 524,404 L 447,526 L 312,525 L 360,433 L 275,431 L 87,758 L 414,746 L 657,326 Z M 220,680 L 264,602 L 401,601 L 360,682 Z"
          fill={mainFill}
        />
        {/* Right Hook and Base Leg */}
        <path
          d="M 680,357 L 636,433 L 776,680 L 638,682 L 564,561 L 520,629 L 595,758 L 912,757 Z"
          fill={secondaryFill}
        />
      </svg>
    </span>
  );
}

