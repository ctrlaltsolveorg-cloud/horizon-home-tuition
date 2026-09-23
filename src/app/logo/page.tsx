'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  Layers,
  Compass,
  Palette,
  Type,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Sun,
  Moon,
  Eye,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Grid
} from 'lucide-react';

export function HorizonLogoMark({
  size = 120,
  fillColor,
  accentColor,
  glow = false,
  className = ''
}: {
  size?: number;
  fillColor?: string;
  accentColor?: string;
  glow?: boolean;
  className?: string;
}) {
  const primaryFill = fillColor || '#F59E0B';
  const rightHookFill = accentColor || primaryFill;
  const height = Math.round(size * 0.86);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      {glow && (
        <div style={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
          filter: 'blur(24px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
      )}
      <svg
        width={size}
        height={height}
        viewBox="60 30 870 750"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'inline-block' }}
      >
        {/* Main Body with interlocking 'H' cutout window and central ascension arrow */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 502,51 L 297,394 L 379,396 L 435,488 L 477,411 L 467,324 L 430,314 L 501,201 L 567,317 L 530,323 L 524,404 L 447,526 L 312,525 L 360,433 L 275,431 L 87,758 L 414,746 L 657,326 Z M 220,680 L 264,602 L 401,601 L 360,682 Z"
          fill={primaryFill}
        />
        {/* Right Hook and Base Diagonal Leg */}
        <path
          d="M 680,357 L 636,433 L 776,680 L 638,682 L 564,561 L 520,629 L 595,758 L 912,757 Z"
          fill={rightHookFill}
        />
      </svg>
    </div>
  );
}

export default function LogoTheoryPage() {
  const [logoVariant, setLogoVariant] = useState<'primary' | 'monogram' | 'badge' | 'stacked'>('primary');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'gold' | 'emerald'>('dark');
  const [logoSize, setLogoSize] = useState<number>(200);
  const [glowEnabled, setGlowEnabled] = useState<boolean>(true);
  const [animationMode, setAnimationMode] = useState<'shimmer' | 'float' | 'pulse' | 'none'>('shimmer');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  // Generate Exact SVG Code string for export
  const getRawSvg = () => {
    const fill = themeMode === 'light' ? '#0F172A' : themeMode === 'gold' ? '#F59E0B' : themeMode === 'emerald' ? '#10B981' : '#FFFFFF';
    const accent = themeMode === 'gold' ? '#FBBF24' : themeMode === 'emerald' ? '#34D399' : '#F59E0B';
    return `<svg width="${logoSize}" height="${Math.round(logoSize * 0.86)}" viewBox="60 30 870 750" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Exact Interlocking 'H' + Central Ascension Arrow + Cutout Window -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="M 502,51 L 297,394 L 379,396 L 435,488 L 477,411 L 467,324 L 430,314 L 501,201 L 567,317 L 530,323 L 524,404 L 447,526 L 312,525 L 360,433 L 275,431 L 87,758 L 414,746 L 657,326 Z M 220,680 L 264,602 L 401,601 L 360,682 Z" fill="${fill}" />
  <!-- Right Hook & Diagonal Leg Contour -->
  <path d="M 680,357 L 636,433 L 776,680 L 638,682 L 564,561 L 520,629 L 595,758 L 912,757 Z" fill="${accent}" />
</svg>`;
  };

  const handleDownloadSvg = () => {
    const svgBlob = new Blob([getRawSvg()], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HORIZON-Emblem-${logoVariant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Active Fill
  const activeFill = themeMode === 'light' 
    ? '#0F172A' 
    : themeMode === 'gold' 
    ? '#F59E0B' 
    : themeMode === 'emerald' 
    ? '#10B981' 
    : '#FFFFFF';

  const activeArrow = themeMode === 'gold' 
    ? '#FDE68A' 
    : themeMode === 'emerald' 
    ? '#6EE7B7' 
    : '#F59E0B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar />

      {/* 1. HERO SECTION — EXACT LANDING PAGE AMBIENT THEME */}
      <section style={{
        background: 'radial-gradient(circle at 75% 30%, rgba(245, 158, 11, 0.14) 0%, rgba(15, 23, 42, 0) 55%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.12) 0%, rgba(0,0,0,0) 60%), var(--bg-main)',
        color: 'var(--text-primary)',
        paddingTop: '4.5rem',
        paddingBottom: '5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background 0.3s ease'
      }}>
        {/* Ambient Dot Grid matching Landing Page */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Badge Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'var(--accent-gold-light)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '0.45rem 1.1rem',
            borderRadius: '30px',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <Sparkles size={16} color="#F59E0B" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              OFFICIAL HORIZON EMBLEM & SACRED GEOMETRY
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            The Geometry of{' '}
            <span style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontWeight: 400,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingRight: '0.2rem'
            }}>
              Ascension.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto'
          }}>
            An interlocking fusion of the letter <strong>‘H’</strong>, the <strong>Ascending Growth Arrow</strong>, and the <strong>Equilateral Pyramid Apex</strong> — embodying structured home-tuition mastery.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#interactive-visualizer"
              className="btn btn-primary"
              style={{
                fontSize: '0.98rem',
                padding: '0.85rem 1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
            >
              <Eye size={18} /> Interactive Logo Studio
            </a>
            <a
              href="#logo-theory"
              className="btn btn-outline"
              style={{
                fontSize: '0.98rem',
                padding: '0.85rem 1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
            >
              <BookOpen size={18} /> Read Design Theory
            </a>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE LOGO STUDIO (REAL-TIME VECTOR CANVAS) */}
      <section id="interactive-visualizer" style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            VECTOR STUDIO
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Interactive Emblem Studio
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: '650px', margin: '0 auto' }}>
            Inspect the custom mathematical vector paths across various lockups, themes, and dynamic scales.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '2rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)'
        }}>

          {/* Canvas Display Viewport */}
          <div style={{
            position: 'relative',
            minHeight: '440px',
            borderRadius: '12px',
            background: themeMode === 'light' ? '#FFFFFF' : themeMode === 'gold' ? '#0F1117' : themeMode === 'emerald' ? '#064E3B' : '#0B0C0E',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '2rem',
            transition: 'background 0.3s ease'
          }}>

            {/* Ambient Background Glow Effect */}
            {glowEnabled && (
              <div style={{
                position: 'absolute',
                width: `${logoSize * 1.5}px`,
                height: `${logoSize * 1.5}px`,
                background: themeMode === 'gold' 
                  ? 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)'
                  : themeMode === 'emerald'
                  ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)'
                  : themeMode === 'light'
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(16, 185, 129, 0.12) 40%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                animation: animationMode === 'pulse' ? 'pulseGlow 3s infinite alternate' : 'none'
              }} />
            )}

            {/* THE LIVE CSS/SVG LOGO */}
            <div style={{
              display: 'flex',
              flexDirection: logoVariant === 'stacked' ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: logoVariant === 'stacked' ? '1.25rem' : '1.75rem',
              transform: `scale(${logoSize / 200})`,
              transition: 'transform 0.2s ease',
              animation: animationMode === 'float' ? 'floatLogo 4s ease-in-out infinite' : 'none'
            }}>

              {/* RENDER THE ACCURATE VECTOR ICON */}
              <HorizonLogoMark
                size={140}
                fillColor={activeFill}
                accentColor={activeArrow}
                glow={glowEnabled && animationMode === 'shimmer'}
              />

              {/* TYPOGRAPHY LOCKUP */}
              {logoVariant !== 'monogram' && (
                <div style={{ textAlign: logoVariant === 'stacked' ? 'center' : 'left' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: themeMode === 'light' ? '#0F172A' : '#FFFFFF',
                    lineHeight: 1
                  }}>
                    HORIZON
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: logoVariant === 'stacked' ? 'center' : 'flex-start',
                    gap: '0.5rem',
                    marginTop: '0.45rem'
                  }}>
                    <span style={{
                      background: themeMode === 'emerald' ? 'rgba(52, 211, 153, 0.2)' : 'var(--accent-gold-light)',
                      color: themeMode === 'emerald' ? '#34D399' : 'var(--accent-gold)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.18rem 0.6rem',
                      borderRadius: '12px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      MANAGED
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                      Home Tuition Platform
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Export Bar */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              display: 'flex',
              gap: '0.5rem',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <button
                onClick={() => copyToClipboard(getRawSvg(), 'svg')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedCode === 'svg' ? '#10B981' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {copiedCode === 'svg' ? <Check size={14} /> : <Copy size={14} />}
                {copiedCode === 'svg' ? 'SVG Copied!' : 'Copy Vector SVG'}
              </button>

              <span style={{ color: 'var(--border-color)' }}>|</span>

              <button
                onClick={handleDownloadSvg}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Download size={14} /> Download .svg
              </button>
            </div>

          </div>

          {/* Control Sidebar */}
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            
            {/* Variant Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Logo Lockup Variant
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {[
                  { id: 'primary', label: 'Primary Lockup' },
                  { id: 'monogram', label: 'Monogram Only' },
                  { id: 'stacked', label: 'Vertical Stack' },
                  { id: 'badge', label: 'Emblem Seal' }
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setLogoVariant(v.id as any)}
                    style={{
                      padding: '0.5rem',
                      background: logoVariant === v.id ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                      color: logoVariant === v.id ? '#0B0C0E' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Canvas Palette */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Color Environment
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {[
                  { id: 'dark', label: '🌌 Obsidian Dark' },
                  { id: 'light', label: '☀️ Pure White' },
                  { id: 'gold', label: '👑 Luxury Gold' },
                  { id: 'emerald', label: '🌿 Emerald Rich' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeMode(t.id as any)}
                    style={{
                      padding: '0.5rem',
                      background: themeMode === t.id ? 'var(--text-primary)' : 'var(--bg-secondary)',
                      color: themeMode === t.id ? 'var(--bg-main)' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Scale Dimension</span>
                <span style={{ color: 'var(--accent-gold)' }}>{logoSize}px</span>
              </div>
              <input
                type="range"
                min="120"
                max="320"
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>

            {/* Animation Dynamic */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Dynamic Motion
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {[
                  { id: 'shimmer', label: '✨ Shimmer' },
                  { id: 'float', label: '🌊 Floating' },
                  { id: 'pulse', label: '💫 Pulse Aura' },
                  { id: 'none', label: '⏹ Static' }
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAnimationMode(a.id as any)}
                    style={{
                      padding: '0.45rem',
                      background: animationMode === a.id ? 'var(--accent-green)' : 'var(--bg-secondary)',
                      color: animationMode === a.id ? '#FFFFFF' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Atmospheric Aura</span>
              <button
                onClick={() => setGlowEnabled(!glowEnabled)}
                style={{
                  background: glowEnabled ? 'var(--accent-green)' : 'var(--border-color)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {glowEnabled ? 'ENABLED' : 'OFF'}
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 3. LOGO THEORY & PHILOSOPHY OF THE ATTACHED EMBLEM */}
      <section id="logo-theory" style={{
        padding: '5rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SYMBOLIC ANATOMY
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
              The 4 Theoretical Pillars of the Emblem
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0.5rem auto 0 auto', lineHeight: 1.7, fontSize: '1.02rem' }}>
              Detailed geometric breakdown of the interlocking ‘H’ monogram, the upward ascension vector, and the delta triangle crest.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            
            {/* Card 1: The 'H' Foundation */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid var(--accent-gold)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'var(--accent-gold-light)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Layers size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                1. The Interlocking ‘H’ (Horizon)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The left diagonal beam weaves with the lower window to form an architectural <strong>‘H’</strong>. It represents the foundational academic bedrock (Classes 5 to 12) built through verified home tutoring.
              </p>
            </div>

            {/* Card 2: The Upward Ascension Vector */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid var(--accent-green)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                2. The Ascension Arrow (Growth)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Emerging from the center is a vertical arrow pointing directly toward the peak. It embodies continuous score elevation, goal orientation, and rapid academic acceleration.
              </p>
            </div>

            {/* Card 3: The Delta Pyramid Apex */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid var(--primary-blue)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                3. The Delta Triangle (Peak Merit)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The equilateral triangle is the most geometrically stable polygon in physics. It symbolizes maximum stability, structural discipline, and reaching the top percentile in board exams.
              </p>
            </div>

            {/* Card 4: The Closed Loop Synergy */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid #8B5CF6',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                4. The Interlocking Synergy (Trust)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The right hook closes the perimeter to represent the 3-way partnership: <strong>Student + Educator + Parent</strong>, fortified by Horizon’s verified academic oversight.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SACRED GEOMETRY & PROPORTIONS MATRIX */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            GOLDEN RATIO BLUEPRINT
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            Mathematical Construction
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem' }}>
            Engineered with strict 60° triangular angles and balanced negative space channels.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Grid Blueprint Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              height: '240px',
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--primary-blue)',
              background: 'var(--bg-main)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <HorizonLogoMark size={100} fillColor="var(--accent-gold)" accentColor="#FFFFFF" />
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 700, marginTop: '0.5rem' }}>
                  60° ISOMETRIC TRIANGLE ALIGNMENT
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>• Clear Space Margin: <strong style={{ color: 'var(--text-primary)' }}>1.5x</strong></span>
              <span>• Minimum Display: <strong style={{ color: 'var(--text-primary)' }}>16px</strong></span>
              <span>• Grid Base: <strong style={{ color: 'var(--text-primary)' }}>8pt System</strong></span>
            </div>
          </div>

          {/* Geometry Specifications List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                📐 60° Delta Trajectory
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                The side strokes follow precise 60-degree angles corresponding to an equilateral triangle, creating optical equilibrium.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                🛡️ Channel Negative Space
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Uniform 8px negative space channels separate the 'H' stroke, the arrow head, and the right leg, guaranteeing maximum legibility even down to favicon resolutions.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                🔤 Outfit Geometric Wordmark
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                The accompanying typography uses <strong>Outfit</strong> with wide <code>letter-spacing: 0.12em</code>, pairing bold presence with modern technological precision.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 70%), var(--bg-main)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Experience the HORIZON Platform
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Book a diagnostic assessment for your child or join our accredited educator network.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/"
              className="btn btn-primary"
              style={{
                fontSize: '0.98rem',
                padding: '0.85rem 1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
            >
              Explore Home Page <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="btn btn-outline"
              style={{
                fontSize: '0.98rem',
                padding: '0.85rem 1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
            >
              Access Academic Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px) scale(${logoSize / 200}); }
          50% { transform: translateY(-10px) scale(${logoSize / 200}); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
