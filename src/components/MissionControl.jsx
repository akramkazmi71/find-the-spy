import React from 'react';

export default function MissionControl({ gameState, onEndMission }) {
    const startingPlayer = gameState.players[gameState.startingPlayerIndex];

    return (
        <div className="card mission-control" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease' }}>
            <div className="mission-tag">
                ● Game On!
            </div>
            <h2 className="card-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                Who is the Spy?
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
                Let the game begin!
            </p>

            <div className="starting-player-section" style={{
                marginBottom: 'var(--spacing-xl)',
                textAlign: 'center'
            }}>
                <p style={{
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 700
                }}>
                    The Game Starts With
                </p>
                <div style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    color: 'var(--text-main)',
                    lineHeight: 1.2,
                    textTransform: 'uppercase'
                }}>
                    {startingPlayer}
                </div>
            </div>

            <p style={{
                color: 'var(--text-secondary)',
                marginTop: 'var(--spacing-md)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                fontWeight: 600
            }}>
                "{startingPlayer}, tell something related to the word!"
            </p>

            <button
                className="btn btn-danger btn-lg"
                onClick={onEndMission}
                style={{
                    minWidth: '250px',
                    fontSize: '1.25rem',
                    padding: '1.25rem 3rem'
                }}
            >
                🛑 End Game & Reveal Spy
            </button>
        </div>
    );
}
