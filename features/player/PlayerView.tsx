
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { NeonPanel } from '../../components/neon/NeonPanel';
import { NeonButton } from '../../components/neon/NeonButton';
import { NeonSlider } from '../../components/neon/NeonSlider';
import { usePlayerStore } from '../../store/playerStore';

export const PlayerView: React.FC = () => {
  const { isPlaying, play, pause, volume, setVolume } = usePlayerStore();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Video Placeholder */}
      <div style={{ flex: 1, background: '#000', borderRadius: '16px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: '24px', fontWeight: 800 }}>KNOUX CINEMATIC ENGINE</div>
      </div>

      {/* Controls */}
      <NeonPanel padding="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            <span>0:00</span>
            <NeonSlider value={30} min={0} max={100} onChange={() => {}} />
            <span>4:20</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
               <NeonButton variant="ghost" size="sm"><Shuffle size={16} /></NeonButton>
               <NeonButton variant="ghost" size="sm"><Repeat size={16} /></NeonButton>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <NeonButton variant="ghost"><SkipBack size={20} /></NeonButton>
              <NeonButton 
                variant="primary" 
                style={{ width: 48, height: 48, borderRadius: '50%', padding: 0 }}
                onClick={isPlaying ? pause : play}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </NeonButton>
              <NeonButton variant="ghost"><SkipForward size={20} /></NeonButton>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 150 }}>
              <Volume2 size={16} color="rgba(255,255,255,0.7)" />
              <NeonSlider value={volume * 100} min={0} max={100} onChange={(v) => setVolume(v/100)} height="sm" />
            </div>
          </div>
        </div>
      </NeonPanel>
    </div>
  );
};
