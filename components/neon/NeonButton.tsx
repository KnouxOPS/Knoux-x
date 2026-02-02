
import React from 'react';
import { motion } from 'framer-motion';

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  fullWidth,
  isLoading,
  style,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    ...style
  };

  const variants = {
    primary: {
      background: 'rgba(0, 240, 255, 0.1)',
      color: '#00f0ff',
      border: '1px solid rgba(0, 240, 255, 0.5)',
      boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)',
    },
    secondary: {
      background: 'rgba(168, 85, 247, 0.1)',
      color: '#a855f7',
      border: '1px solid rgba(168, 85, 247, 0.5)',
      boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.5)',
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.7)',
      border: '1px solid transparent',
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '11px' },
    md: { padding: '10px 20px', fontSize: '13px' },
    lg: { padding: '14px 28px', fontSize: '15px' },
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, filter: 'brightness(1.2)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{ ...baseStyles, ...variants[variant], ...sizes[size] }}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <div style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      ) : leftIcon}
      {children}
    </motion.button>
  );
};
