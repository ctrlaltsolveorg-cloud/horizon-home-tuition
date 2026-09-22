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
  Sliders,
  Maximize2,
  Eye,
  Zap,
  BookOpen,
  GraduationCap,
  Award,
  ArrowRight
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

  // Generate SVG Code string for export
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
    <linearGradient id="skyBeam" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <!-- Base Horizon Curve -->
  <path d="M 20 120 Q 100 70 180 120" stroke="url(#horizonEmerald)" stroke-width="6" stroke-linecap="round" fill="none" />
  
  <!-- Left Ascension Pillar -->
  <rect x="52" y="42" width="14" height="66" rx="7" fill="url(#horizonGold)" />

  <!-- Right Ascension Pillar -->
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
    link.download = `HORIZON-Brand-Logo-${logoVariant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 1.5rem 3.5rem 1.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)',
        background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 80%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#F59E0B',
            padding: '0.4rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '1.25rem',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={15} /> HORIZON Brand Identity & Sacred Geometry
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F59E0B 50%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            The Anatomy of HORIZON
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto'
          }}>
            The visual philosophy, geometric construction, and psychological symbolism behind India’s premier managed home-tuition crest.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#interactive-visualizer"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Eye size={18} /> Interactive Logo Studio
            </a>
            <a
              href="#logo-theory"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BookOpen size={18} /> Read Brand Theory
            </a>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE LOGO STUDIO (THE LIVE VISUALIZER) */}
      <section id="interactive-visualizer" style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Interactive Brand Canvas
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Inspect the HORIZON insignia across different variants, theme palettes, and animation dynamics.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '2rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)'
        }}>

          {/* Canvas Display Viewport */}
          <div style={{
            position: 'relative',
            minHeight: '440px',
            borderRadius: '16px',
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
                  : 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 70%)',
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
                      <stop offset="0%" stop-color={themeMode === 'monochrome' ? '#FFFFFF' : '#F59E0B'} />
                      <stop offset="100%" stop-color={themeMode === 'monochrome' ? '#94A3B8' : '#D97706'} />
                    </linearGradient>
                    <linearGradient id="canvasHorizonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color={themeMode === 'monochrome' ? '#E2E8F0' : '#34D399'} />
                      <stop offset="100%" stop-color={themeMode === 'monochrome' ? '#64748B' : '#059669'} />
                    </linearGradient>
                    <linearGradient id="glowRays" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.8" />
                      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
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
                      background: themeMode === 'monochrome' ? '#334155' : 'rgba(245, 158, 11, 0.2)',
                      color: themeMode === 'monochrome' ? '#FFFFFF' : '#F59E0B',
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: themeMode === 'light' ? '#64748B' : '#94A3B8', letterSpacing: '0.04em' }}>
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
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 0.75rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button
                onClick={() => copyToClipboard(getRawSvg(), 'svg')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedCode === 'svg' ? '#34D399' : '#CBD5E1',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copiedCode === 'svg' ? <Check size={13} /> : <Copy size={13} />}
                {copiedCode === 'svg' ? 'SVG Copied!' : 'Copy SVG'}
              </button>

              <span style={{ color: '#475569' }}>|</span>

              <button
                onClick={handleDownloadSvg}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#CBD5E1',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Download size={13} /> Download .svg
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
                      color: logoVariant === v.id ? '#0F172A' : 'var(--text-primary)',
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
                <span>Scale Size</span>
                <span>{logoSize}px</span>
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
                Motion State
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {[
                  { id: 'shimmer', label: '✨ Shimmer' },
                  { id: 'float', label: '🌊 Floating' },
                  { id: 'pulse', label: '💫 Pulse Glow' },
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
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Ambient Aura Glow</span>
              <button
                onClick={() => setGlowEnabled(!glowEnabled)}
                style={{
                  background: glowEnabled ? '#10B981' : '#475569',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {glowEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 3. LOGO THEORY & PHILOSOPHY (THE 4 SACRED PILLARS) */}
      <section id="logo-theory" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Conceptual Architecture
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900 }}>
            The 4 Sacred Pillars of the HORIZON Insignia
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0.5rem auto 0 auto', lineHeight: 1.6 }}>
            Every curve, angle, and coordinate in the HORIZON logo is deliberately calibrated to represent academic rigor, individual potential, and parental reassurance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
          
          {/* Pillar 1 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem',
            borderTop: '4px solid #10B981',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              1. The Ascending Horizon (क्षितिज)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The dynamic upward-curving green arc represents the infinite horizon line. In Sanskrit philosophy, <em>Kshitij</em> marks the boundary where earth meets sky — embodying a student’s limitless growth when backed by individual mentorship.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem',
            borderTop: '4px solid #F59E0B',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#FBBF24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              2. The Twin Pillars of Mastery
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The geometric vertical gold bars form the iconic letter <strong>‘H’</strong>. The left pillar represents foundational skill building (Classes 5–8), while the right represents board mastery and competitive triumph (Classes 9–12).
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem',
            borderTop: '4px solid #3B82F6',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              3. The Core Diamond Spark
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Sitting at the exact focal apex is the 8-point golden diamond star. It captures the moment of "Eureka!" — when personalized 1-on-1 tuition transforms a complex concept into permanent mental clarity.
            </p>
          </div>

          {/* Pillar 4 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem',
            borderTop: '4px solid #8B5CF6',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#C084FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              4. The Managed Crest (Assurance)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The enclosing circular perimeter acts as a badge of institutional trust. It signifies verified educator background checks, structured monthly progress reports, and parent transparency.
            </p>
          </div>

        </div>

      </section>

      {/* 4. SACRED GEOMETRY & PROPORTIONS MATRIX */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
              Sacred Geometry & Ratio Blueprint
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Constructed using the Golden Ratio (φ = 1.618) and a calibrated 8px modular grid.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            
            {/* Grid Blueprint Card */}
            <div style={{
              background: '#0B0C0E',
              border: '1px solid #242731',
              borderRadius: '16px',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              {/* Geometric Grid Background */}
              <div style={{
                height: '240px',
                backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #3B82F6'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#60A5FA', marginBottom: '0.5rem' }}>
                    1 : 1.618 GOLDEN RATIO
                  </div>
                  <div style={{ width: '120px', height: '80px', border: '2px solid #F59E0B', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700 }}>EMBLEM BOX</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94A3B8' }}>
                <span>• Clear Space Margin: <strong>1.5x</strong></span>
                <span>• Minimum Icon Display: <strong>16px</strong></span>
                <span>• Grid Base: <strong>8pt System</strong></span>
              </div>
            </div>

            {/* Geometry Specifications List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  📐 Optical Balance & Curvature
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  The horizon arc is rendered via quadratic Bézier curves <code>(Q 100 70 180 120)</code>, creating an ascending parabola that draws the human eye upward.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  🛡️ Safe Exclusion Zones
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  A mandatory protective clear space equivalent to the height of the letter ‘H’ must surround the logo on all promotional, web, and print flyer formats.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  🔤 Typographic Kerning
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  The wordmark is set in <strong>Outfit Geometric Sans</strong> with customized <code>letter-spacing: 0.12em</code>, giving it commanding presence across billboards, tutor badges, and mobile screens.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. COLOR PALETTE MATRIX & PSYCHOLOGY */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Color Psychology
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900 }}>
            The Chromatic DNA of HORIZON
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Click any color code below to copy it instantly to your clipboard.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          {/* Color 1: Solar Amber */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ height: '110px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                PRIMARY GOLD
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>Solar Amber</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Symbolizes intellect, enlightenment, academic ambition, and high merit.
              </p>
              <button
                onClick={() => copyToClipboard('#F59E0B', 'hex1')}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>HEX: #F59E0B</span>
                <span>{copiedCode === 'hex1' ? '✓ Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Color 2: Emerald Vitality */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ height: '110px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                ACCENT GROWTH
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>Emerald Vitality</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Represents structured student progression, vitality, peace of mind, and continuous growth.
              </p>
              <button
                onClick={() => copyToClipboard('#059669', 'hex2')}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>HEX: #059669</span>
                <span>{copiedCode === 'hex2' ? '✓ Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Color 3: Deep Obsidian Navy */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ height: '110px', background: 'linear-gradient(135deg, #1E293B 0%, #0B0C0E 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                BASE CANVAS
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>Obsidian Midnight</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Embodies academic authority, institutional discipline, security, and focus.
              </p>
              <button
                onClick={() => copyToClipboard('#0B0C0E', 'hex3')}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>HEX: #0B0C0E</span>
                <span>{copiedCode === 'hex3' ? '✓ Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Color 4: Pure Horizon Ice */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ height: '110px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                CLARITY ACCENT
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>Horizon Crisp White</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Reflects absolute transparency, conceptual precision, and unclouded logic.
              </p>
              <button
                onClick={() => copyToClipboard('#FFFFFF', 'hex4')}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>HEX: #FFFFFF</span>
                <span>{copiedCode === 'hex4' ? '✓ Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* 6. CALL TO ACTION: BACK TO MAIN APP */}
      <section style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Experience the HORIZON Platform
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Join our verified tutor network or enroll your child for personalized, structured home tuition.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}
            >
              Explore Home Page <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
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
          50% { transform: translateY(-12px) scale(${logoSize / 200}); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
