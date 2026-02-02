import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NeonPanel } from '../../components/neon/NeonPanel';
import { NeonButton } from '../../components/neon/NeonButton';
import { Music, Film, FolderOpen, Play, Heart } from 'lucide-react';

export const LibraryView: React.FC = () => {
    const [media, setMedia] = useState<any[]>([]);

    useEffect(() => {
        window.knouxAPI.library.getMedia().then(setMedia);
    }, []);

    const handlePlay = (path: string) => {
        window.knouxAPI.player.load(path);
        window.knouxAPI.player.play();
    };

    return (
        <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Library</h1>
                <NeonButton leftIcon={<FolderOpen size={16} />} onClick={() => window.knouxAPI.file.openDirectory()}>Scan Folder</NeonButton>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, overflowY: 'auto' }}>
                {media.map((item) => (
                    <NeonPanel key={item.id} padding="none" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => handlePlay(item.path)}>
                        <div style={{ height: 120, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.type === 'video' ? <Film size={40} color="rgba(255,255,255,0.3)" /> : <Music size={40} color="rgba(255,255,255,0.3)" />}
                        </div>
                        <div style={{ padding: 15 }}>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{item.artist}</p>
                        </div>
                    </NeonPanel>
                ))}
            </div>
        </div>
    );
};