import React, { useState, useEffect } from 'react';

export default function WordListSetup({ onBack }) {
    const [mode, setMode] = useState('default');
    const [customWordsText, setCustomWordsText] = useState('');

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('findTheSpyWordSettings');
            if (stored) {
                const settings = JSON.parse(stored);
                setMode(settings.mode || 'default');
                setCustomWordsText((settings.customWords || []).join('\n'));
            }
        } catch (e) {
            console.error('Error reading word settings', e);
        }
    }, []);

    const handleSave = () => {
        const customWords = customWordsText
            .split(/[\n,]/)
            .map(w => w.trim())
            .filter(w => w.length > 0);

        const settings = {
            mode,
            customWords
        };
        sessionStorage.setItem('findTheSpyWordSettings', JSON.stringify(settings));
        onBack();
    };

    return (
        <div className="card" style={{ animation: 'fadeInUp 0.6s ease' }}>
            <h2 className="card-title">Word Settings</h2>

            <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'left' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                    Word List Mode
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.125rem' }}>
                        <input type="radio" value="default" checked={mode === 'default'} onChange={() => setMode('default')} style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        <span>Default (500+ Words)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.125rem' }}>
                        <input type="radio" value="custom" checked={mode === 'custom'} onChange={() => setMode('custom')} style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        <span>Custom Words Only</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.125rem' }}>
                        <input type="radio" value="merged" checked={mode === 'merged'} onChange={() => setMode('merged')} style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                        <span>Merged (Default + Custom)</span>
                    </label>
                </div>
            </div>

            {(mode === 'custom' || mode === 'merged') && (
                <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'left' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Custom Words (separated by comma or new line)
                    </p>
                    <textarea
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            minHeight: '150px',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--border-color)',
                            fontSize: '1rem',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                        value={customWordsText}
                        onChange={(e) => setCustomWordsText(e.target.value)}
                        placeholder="Apple, Banana&#10;Orange&#10;Cat, Dog"
                    />
                </div>
            )}

            <div className="btn-group" style={{ flexDirection: 'column', gap: '1rem' }}>
                <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ width: '100%' }}>
                    💾 Save Settings
                </button>
                <button className="btn btn-secondary btn-lg" onClick={onBack} style={{ width: '100%' }}>
                    ❌ Cancel
                </button>
            </div>
        </div>
    );
}
