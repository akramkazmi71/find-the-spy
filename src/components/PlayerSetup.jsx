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
            <h2 className="card-title">Number of Players</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                Select total players (3-20)
            </p>

            <div className="number-selector">
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                    <button
                        key={num}
                        className={`number-btn ${selectedCount === num ? 'selected' : ''}`}
                        onClick={() => setSelectedCount(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <h2 className="card-title">Number of Spies</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                    How many spies are in the game?
                </p>
                <div className="number-selector" style={{ justifyContent: 'center' }}>
                    {[1, 2, 3].map(num => (
                        <button
                            key={num}
                            className={`number-btn ${selectedSpyCount === num ? 'selected' : ''}`}
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
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: spiesKnowEachOther ? 'var(--primary)' : 'var(--text-main)'
                        }}>
                            🤝 Spies know each other
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
