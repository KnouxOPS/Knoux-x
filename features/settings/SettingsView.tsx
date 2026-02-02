import React, { useEffect, useState } from 'react';
import { NeonPanel } from '../../components/neon/NeonPanel';
import { NeonInput } from '../../components/neon/NeonInput';
import { NeonButton } from '../../components/neon/NeonButton';

export const SettingsView: React.FC = () => {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        window.knouxAPI.settings.get('openRouterApiKey', '').then(setApiKey);
    }, []);

    const handleSave = () => {
        window.knouxAPI.settings.set('openRouterApiKey', apiKey);
        alert('Settings Saved');
    };

    return (
        <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ marginBottom: 30 }}>Settings</h1>
            
            <NeonPanel title="AI Configuration" style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 20 }}>
                    <NeonInput 
                        label="OpenRouter API Key" 
                        value={apiKey} 
                        onChange={e => setApiKey(e.target.value)} 
                        type="password"
                        placeholder="sk-or-..."
                    />
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: 5 }}>Required for AI Assistant functionality.</p>
                </div>
                <NeonButton onClick={handleSave}>Save Changes</NeonButton>
            </NeonPanel>

            <NeonPanel title="Appearance">
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Theme settings coming soon...</p>
            </NeonPanel>
        </div>
    );
};