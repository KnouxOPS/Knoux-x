
import React from 'react';
import { motion } from 'framer-motion';

export interface NeonPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderGlow?: boolean;
  glowIntensity?: string;
}

export const NeonPanel: React.FC<NeonPanelProps> = ({
  children,
  variant = 'dark',
  padding = 'md',
  borderGlow = true,
  glowIntensity,
  style,
  className = '',
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    background: variant === 'glass' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(10, 14, 26, 0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    position: 'relative',
    ...style
  };

  const paddings = {
    none: 0,
    sm: '12px',
    md: '20px',
    lg: '32px',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...baseStyles, padding: paddings[padding] }}
      className={className}
      {...props}
    >
      {borderGlow && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          background: 'radial-gradient(circle at top left, rgba(0, 240, 255, 0.05), transparent 40%)',
          pointerEvents: 'none'
        }} />
      )}
      {children}
    </motion.div>
  );
};