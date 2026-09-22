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
  Award,
  CheckCircle2,
  Grid
} from 'lucide-react';

export default function LogoTheoryPage() {
  // Interactive Canvas State
  const [logoVariant, setLogoVariant] = useState<'primary' | 'monogram' | 'badge' | 'stacked'>('primary');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'gold' | 'monochrome'>('dark');
  const [logoSize, setLogoSize] = useState<number>(220);
  const [glowEnabled, setGlowEnabled] = useState<boolean>(true);
  const [animationMode, setAnimationMode] = useState<'shimmer' | 'float' | 'pulse' | 'none'>('shimmer');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  // Raw SVG string generator
  const getRawSvg = () => {
    return `<svg width="${logoSize}" height="${Math.round(logoSize * 0.8)}" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="horizonGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="horizonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Base Horizon Curve -->
  <path d="M 20 120 Q 100 70 180 120" stroke="url(#horizonEmerald)" stroke-width="6" stroke-linecap="round" fill="none" />
  
  <!-- Left Ascension Pillar (Classes 5-8) -->
  <rect x="52" y="42" width="14" height="66" rx="7" fill="url(#horizonGold)" />

  <!-- Right Ascension Pillar (Classes 9-12) -->
  <rect x="134" y="42" width="14" height="66" rx="7" fill="url(#horizonGold)" />

  <!-- Central Horizon Bridge (The H Crossbar) -->
  <path d="M 56 75 C 80 65, 120 65, 144 75" stroke="url(#horizonGold)" stroke-width="10" stroke-linecap="round" fill="none" />

  <!-- The Rising Sun / Diamond Core -->
  <circle cx="100" cy="55" r="12" fill="#FBBF24" />
  <path d="M 100 35 L 104 50 L 118 55 L 104 60 L 100 75 L 96 60 L 82 55 L 96 50 Z" fill="#FFFFFF" />
</svg>`;
  };

  const handleDownloadSvg = () => {
    const svgBlob = new Blob([getRawSvg()], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HORIZON-Logo-${logoVariant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              BRAND ARCHITECTURE & SACRED GEOMETRY
            </span>
          </div>

          {/* Headline matching Landing Page typography */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            The Anatomy of{' '}
            <span style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontWeight: 400,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingRight: '0.2rem'
            }}>
              HORIZON.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto'
          }}>
            The visual philosophy, mathematical proportions, and cognitive symbolism behind India’s premier managed home-tuition mark.
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
              <BookOpen size={18} /> Read Brand Philosophy
            </a>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE LOGO STUDIO (EXACT CARD & BORDER THEME) */}
      <section id="interactive-visualizer" style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            LIVE ENGINE
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Interactive Brand Canvas
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', maxWidth: '650px', margin: '0 auto' }}>
            Experiment with logo variants, chromatic palettes, glow intensity, and motion dynamics rendered in pure vector code.
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
            background: themeMode === 'light' ? '#FFFFFF' : themeMode === 'gold' ? '#0F1117' : themeMode === 'monochrome' ? '#000000' : '#0B0C0E',
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
                  : themeMode === 'light'
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(245, 158, 11, 0.16) 40%, transparent 70%)',
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
              gap: logoVariant === 'stacked' ? '1rem' : '1.5rem',
              transform: `scale(${logoSize / 200})`,
              transition: 'transform 0.2s ease',
              animation: animationMode === 'float' ? 'floatLogo 4s ease-in-out infinite' : 'none'
            }}>

              {/* LOGO ICON / EMBLEM SVG */}
              <div style={{ position: 'relative' }}>
                <svg width="140" height="112" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="canvasHorizonGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={themeMode === 'monochrome' ? '#FFFFFF' : '#F59E0B'} />
                      <stop offset="100%" stopColor={themeMode === 'monochrome' ? '#94A3B8' : '#D97706'} />
                    </linearGradient>
                    <linearGradient id="canvasHorizonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={themeMode === 'monochrome' ? '#E2E8F0' : '#34D399'} />
                      <stop offset="100%" stopColor={themeMode === 'monochrome' ? '#64748B' : '#059669'} />
                    </linearGradient>
                  </defs>

                  {/* Horizon Arc */}
                  <path
                    d="M 20 120 Q 100 70 180 120"
                    stroke="url(#canvasHorizonEmerald)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Left Column (Class 5-8 Foundation) */}
                  <rect x="52" y="42" width="14" height="66" rx="7" fill="url(#canvasHorizonGold)" />

                  {/* Right Column (Class 9-12 Mastery) */}
                  <rect x="134" y="42" width="14" height="66" rx="7" fill="url(#canvasHorizonGold)" />

                  {/* Cross Horizon Bridge (Tutor Connection) */}
                  <path
                    d="M 56 75 C 80 65, 120 65, 144 75"
                    stroke="url(#canvasHorizonGold)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Rising Sun Diamond Star */}
                  <circle cx="100" cy="55" r="13" fill={themeMode === 'monochrome' ? '#FFFFFF' : '#FBBF24'} />
                  <path
                    d="M 100 32 L 105 50 L 123 55 L 105 60 L 100 78 L 95 60 L 77 55 L 95 50 Z"
                    fill={themeMode === 'light' ? '#0F172A' : '#FFFFFF'}
                  />

                  {/* Circular Shield Outline for 'Badge' Variant */}
                  {logoVariant === 'badge' && (
                    <circle cx="100" cy="80" r="74" stroke="url(#canvasHorizonGold)" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                  )}
                </svg>
              </div>

              {/* LOGO TYPOGRAPHY LOCKUP (Except for Monogram only) */}
              {logoVariant !== 'monogram' && (
                <div style={{ textAlign: logoVariant === 'stacked' ? 'center' : 'left' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.4rem',
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
                    marginTop: '0.4rem'
                  }}>
                    <span style={{
                      background: themeMode === 'monochrome' ? '#334155' : 'var(--accent-gold-light)',
                      color: themeMode === 'monochrome' ? '#FFFFFF' : 'var(--accent-gold)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '12px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      MANAGED
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                      Home Tuition Platform
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Export Bar at bottom of canvas */}
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
                {copiedCode === 'svg' ? 'SVG Copied!' : 'Copy Raw SVG'}
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
                  { id: 'badge', label: 'Managed Crest' }
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
                  { id: 'light', label: '☀️ Pristine Light' },
                  { id: 'gold', label: '👑 Luxury Gold' },
                  { id: 'monochrome', label: '⚪ Monochrome' }
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

      {/* 3. LOGO THEORY & PHILOSOPHY (EXACT 4 CARDS DESIGN) */}
      <section id="logo-theory" style={{
        padding: '5rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              DESIGN PHILOSOPHY
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
              The 4 Core Elements of HORIZON
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0.5rem auto 0 auto', lineHeight: 1.7, fontSize: '1.02rem' }}>
              Every coordinate, curve, and proportional ratio in the HORIZON logo is calibrated to reflect academic excellence, student empowerment, and parental confidence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            
            {/* Card 1 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid var(--accent-green)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
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
                <Compass size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                1. The Ascending Horizon (क्षितिज)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The upward-curving green arc reflects the infinite horizon line. In classical Sanskrit philosophy, <em>Kshitij</em> represents the infinite sphere of student potential when supported by individual mentorship.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid var(--accent-gold)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
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
                2. The Twin Pillars of Mastery
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The geometric vertical gold bars form the iconic letter <strong>‘H’</strong>. The left pillar represents foundational learning (Classes 5–8), while the right represents board exam mastery (Classes 9–12).
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid var(--primary-blue)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
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
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                3. The Diamond Core Spark
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Positioned at the apex is the 8-point golden diamond star. It captures the moment of "Eureka!" — when dedicated 1-on-1 tuition turns confusion into crystal clear conceptual understanding.
              </p>
            </div>

            {/* Card 4 */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.25rem 1.75rem',
              borderTop: '4px solid #8B5CF6',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
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
                4. The Managed Crest (Assurance)
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The surrounding protective contour represents peace of mind for parents — background verification, monthly progress cards, and structured academic alignment.
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
            Engineered with the divine Golden Ratio (φ = 1.618) and a calibrated 8px grid hierarchy.
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
                <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--primary-blue)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  1 : 1.618 GOLDEN PROPORTION
                </div>
                <div style={{ width: '130px', height: '80px', border: '2px solid var(--accent-gold)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 800 }}>EMBLEM BOX</span>
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
                📐 Quadratic Parabola Curves
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                The horizon curve is rendered using quadratic Bézier curves <code>(Q 100 70 180 120)</code>, providing aerodynamic upward lift.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                🛡️ Protective Safe Zone
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                A mandatory exclusion boundary equivalent to the height of the letter ‘H’ isolates the logo from conflicting typography or graphics.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                🔤 Outfit Geometric Typography
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                The wordmark is set in <strong>Outfit</strong> with wide tracking <code>letter-spacing: 0.12em</code>, giving it instant authority across digital portals and print banners.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. COLOR PALETTE MATRIX & PSYCHOLOGY */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CHROMATIC IDENTITY
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
              Brand Color Palette
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Click any color swatch below to copy its HEX value.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            
            {/* Color 1: Solar Amber */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ height: '110px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                  PRIMARY GOLD
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Solar Amber</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Embodies academic intellect, student ambition, and gold-standard merit.
                </p>
                <button
                  onClick={() => copyToClipboard('#F59E0B', 'hex1')}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>HEX: #F59E0B</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{copiedCode === 'hex1' ? '✓ Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Color 2: Emerald Vitality */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ height: '110px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                  ACCENT GROWTH
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Emerald Growth</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Represents structured score improvement, peace of mind, and vitality.
                </p>
                <button
                  onClick={() => copyToClipboard('#10B981', 'hex2')}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>HEX: #10B981</span>
                  <span style={{ color: 'var(--accent-green)' }}>{copiedCode === 'hex2' ? '✓ Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Color 3: Deep Obsidian Navy */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ height: '110px', background: 'linear-gradient(135deg, #1E293B 0%, #0B0C0E 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                  BASE CANVAS
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Obsidian Midnight</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Reflects deep institutional discipline, security, and focused quiet study.
                </p>
                <button
                  onClick={() => copyToClipboard('#0B0C0E', 'hex3')}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>HEX: #0B0C0E</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{copiedCode === 'hex3' ? '✓ Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Color 4: Pure Horizon Ice */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ height: '110px', background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                <span style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                  CLARITY WHITE
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Horizon Crisp White</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Reflects absolute transparency, conceptual precision, and unclouded logic.
                </p>
                <button
                  onClick={() => copyToClipboard('#FFFFFF', 'hex4')}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>HEX: #FFFFFF</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{copiedCode === 'hex4' ? '✓ Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION: BACK TO HOME */}
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

      {/* Global CSS Keyframes for Logo Studio Animations */}
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
