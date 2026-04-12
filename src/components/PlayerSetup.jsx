import React from 'react';

export default function PlayerSetup({ onStart, onBack }) {
    const [selectedCount, setSelectedCount] = React.useState(null);
    const [selectedSpyCount, setSelectedSpyCount] = React.useState(1);
    const [spiesKnowEachOther, setSpiesKnowEachOther] = React.useState(false);

    const handleStart = () => {
        if (selectedCount) {
            onStart(selectedCount, selectedSpyCount, spiesKnowEachOther);
        }
    };

    return (
        <div className="card">
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Number of Players</h3>
                <div className="grid-selector">
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                        <button
                            key={num}
                            type="button"
                            className={`grid-btn ${selectedCount === num ? 'selected' : ''}`}
                            onClick={() => setSelectedCount(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Number of Spies</h3>
                    <div className="grid-selector" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {[1, 2, 3].map(num => (
                            <button
                                key={num}
                                type="button"
                                className={`grid-btn ${selectedSpyCount === num ? 'selected' : ''}`}
                                onClick={(e) => {
                                    setSelectedSpyCount(num);
                                    if (num === 1) setSpiesKnowEachOther(false);
                                }}
                                style={{ minWidth: '80px' }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedSpyCount === 3 && (
                    <p style={{
                        color: 'var(--danger)',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem',
                        fontWeight: 600,
                        fontStyle: 'italic'
                    }}>
                        "It's advised to select 3 spies when you have more than 12 players"
                    </p>
                )}

                {selectedSpyCount > 1 && (
                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        border: spiesKnowEachOther ? '2px solid var(--primary)' : '2px solid transparent',
                        transition: 'all 0.2s ease'
                    }}
                        onClick={() => setSpiesKnowEachOther(!spiesKnowEachOther)}
                    >
                        <input
                            type="checkbox"
                            checked={spiesKnowEachOther}
                            onChange={() => { }} // Handled by div onClick
                            style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ fontWeight: 600, color: spiesKnowEachOther ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.1rem' }}>
                            Spies know each other
                        </span>
                    </div>
                )}
            </div>

            <div className="btn-group" style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: '1rem' }}>
                {onBack && (
                    <button
                        className="btn btn-secondary btn-lg"
                        onClick={onBack}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        ← Back
                    </button>
                )}
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStart}
                    disabled={!selectedCount}
                    style={{ opacity: selectedCount ? 1 : 0.5, flex: 1, minWidth: 0 }}
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}
