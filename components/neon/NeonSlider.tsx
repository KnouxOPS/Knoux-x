
import React from 'react';

interface NeonSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  glowColor?: string;
  height?: 'sm' | 'md';
  showTooltip?: boolean;
  tooltipFormatter?: (val: number) => string;
}

export const NeonSlider: React.FC<NeonSliderProps> = ({
  value, min, max, step = 1, onChange, glowColor = '#00f0ff', height = 'md'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div style={{ position: 'relative', width: '100%', height: height === 'sm' ? 20 : 30, display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        width: '100%', 
        height: height === 'sm' ? 4 : 6, 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: 4, 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${percentage}%`,
          background: glowColor,
          boxShadow: `0 0 10px ${glowColor}`,
          transition: 'width 0.1s linear'
        }} />
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          cursor: 'pointer',
          width: '100%'
        }}
      />
    </div>
  );
};
