import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import './neon-styles.css';

export interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  glowColor?: 'cyan' | 'magenta' | 'green' | 'purple' | 'yellow' | 'red';
  icon?: React.ReactNode;
}

const colorMap = {
  cyan: '#00f0ff',
  magenta: '#ff00f0',
  green: '#32ff64',
  purple: '#aa00ff',
  yellow: '#ffaa00',
  red: '#ff3232',
};

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, glowColor = 'cyan', icon, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const color = colorMap[glowColor];

    return (
      <div className={`neon-input-wrapper ${className}`}>
        {label && (
          <label style={{ color: isFocused ? color : 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{label}</label>
        )}
        
        <div className="neon-input-container">
          {icon && <span style={{ marginRight: 10, color: isFocused ? color : 'rgba(255,255,255,0.5)' }}>{icon}</span>}
          <input
            ref={ref}
            className="neon-input"
            onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
            {...props}
          />
          <motion.div
            className="neon-input-border"
            initial={false}
            animate={{
              scaleX: isFocused ? 1 : 0,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {error && <span style={{ color: '#ff3232', fontSize: '0.75rem' }}>{error}</span>}
      </div>
    );
  }
);
NeonInput.displayName = 'NeonInput';