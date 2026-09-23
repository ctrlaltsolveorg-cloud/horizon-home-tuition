'use client';

import React from 'react';
import HorizonLogoIcon from './HorizonLogoSvg';

interface HorizonBrandHeaderProps {
  logoSize?: number;
  titleSize?: string;
  subtitleSize?: string;
  reportTitle?: string;
  reportSubtitle?: string;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function HorizonBrandHeader({
  logoSize = 54,
  titleSize = '1.65rem',
  subtitleSize = '0.74rem',
  reportTitle = 'MONTHLY PROGRESS REPORT',
  reportSubtitle = 'Single-Page Comprehensive Audit',
  compact = false,
  className = '',
  style = {}
}: HorizonBrandHeaderProps) {
  return (
    <div
      className={`horizon-brand-header ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: compact ? '0.75rem' : '1.25rem',
        borderBottom: '2px solid #0F172A',
        ...style
      }}
    >
      {/* Left: Dynamic Logo & Brand Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ flexShrink: 0 }}>
          <HorizonLogoIcon size={logoSize} color="#F59E0B" accentColor="#3B82F6" glow={false} />
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: titleSize,
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#0F172A',
              fontFamily: "'Inter', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: 1.1
            }}
          >
            HORIZON HOME TUITION
          </h1>
          <div
            style={{
              marginTop: '4px',
              fontSize: subtitleSize,
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#0284C7',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            PERSONALIZED ACADEMIC MENTORSHIP &amp; HOLISTIC STUDENT DEVELOPMENT
          </div>
        </div>
      </div>

      {/* Right: Report Title & Type Header */}
      {reportTitle && (
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: '#0F172A',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {reportTitle}
          </div>
          {reportSubtitle && (
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0284C7',
                marginTop: '2px'
              }}
            >
              {reportSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
