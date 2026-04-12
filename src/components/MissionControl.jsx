import React from 'react';

export default function MissionControl({ gameState, onEndMission, onBack }) {
    const startingPlayer = gameState.players[gameState.startingPlayerIndex];

    return (
        <div className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease' }}>
            <div className="mission-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    Game On!
                </div>
                <h2 className="title" style={{ marginBottom: 'var(--spacing-sm)' }}>
                    Who is the Spy?
                </h2>
                <p className="subtitle" style={{ marginBottom: 0 }}>
                    Ask questions and find out!
                </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                    The Game Starts With
                </p>
                <div className="start-player-circle">
                    {startingPlayer}
                </div>
            </div>

            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={onEndMission}
                    style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem' }}
                >
                    End Game & Guess Spy
                </button>
                {onBack && (
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg"
                        onClick={onBack}
                        style={{ width: '100%' }}
                    >
                        ← Back to Reveal
                    </button>
                )}
            </div>
        </div>
    );
}
