'use client';

import React, { useState, useEffect } from 'react';

// Helper: Parse numerical score from string like "7.50 / 10.00" or number
export const parseNumericScore = (val?: string | number): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const match = String(val).match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// Helper: Format score as 2-decimal float with leading zero if single digit (e.g. "05.30", "10.00", "08.50", "04.10")
export const formatScoreFloat = (val?: number | string): string => {
  if (val === undefined || val === null || val === '') return '00.00';
  const num = typeof val === 'number' ? (isNaN(val) ? 0 : val) : parseNumericScore(val);
  const clamped = Math.max(0, num);
  const fixed = clamped.toFixed(2);
  return clamped < 10 ? `0${fixed}` : fixed;
};

interface FormattedScoreInputProps {
  value: number | string;
  onChange: (val: string) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export function FormattedScoreInput({
  value,
  onChange,
  max = 10,
  min = 0,
  step = 0.1,
  className = 'live-score-num-input',
  style,
  placeholder = '00.00'
}: FormattedScoreInputProps) {
  const numericVal = typeof value === 'number' ? value : parseNumericScore(value);
  const [localText, setLocalText] = useState<string>(formatScoreFloat(numericVal));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalText(formatScoreFloat(numericVal));
    }
  }, [numericVal, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalText(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(String(clamped));
    } else if (raw === '') {
      onChange('0');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // When focusing, keep the formatted text or select all
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(localText);
    const finalVal = isNaN(parsed) ? min : Math.max(min, Math.min(max, parsed));
    const formatted = formatScoreFloat(finalVal);
    setLocalText(formatted);
    onChange(String(finalVal));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = parseFloat(localText) || 0;
      const next = Math.min(max, parseFloat((current + step).toFixed(2)));
      const formatted = formatScoreFloat(next);
      setLocalText(formatted);
      onChange(String(next));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = parseFloat(localText) || 0;
      const next = Math.max(min, parseFloat((current - step).toFixed(2)));
      const formatted = formatScoreFloat(next);
      setLocalText(formatted);
      onChange(String(next));
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      className={className}
      value={isFocused ? localText : formatScoreFloat(numericVal)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
      placeholder={placeholder}
    />
  );
}
