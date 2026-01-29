import React from 'react';
import { getWordDescription } from '../utils/wordDatabase';

export default function Debriefing({ gameState, onNewRound, onNewGame }) {
    const spyName = gameState.players[gameState.spyIndex];
    const word = gameState.word;
    const description = getWordDescription(word);

    return (
        <div className="card debriefing" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease' }}>
            <div className="mission-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid var(--success)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--success)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    ✓ Game Over
                </div>
                <h2 className="card-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                    Game Results
                </h2>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, max-content))', // shrink to content
                    justifyContent: 'center',  // center the grid in the viewport
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-xl)',
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                }}
                >
                {/* Spy Reveal */}
                <div className="card-result" style={{
                    background: '#FEF2F2',
                    border: '4px solid var(--danger)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: 'var(--danger)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        The Spy Was
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: 'var(--text-main)',
                        lineHeight: 1.2
                    }}>
                        {spyName}
                    </div>
                </div>

                {/* Word Reveal */}
                <div className="card-result" style={{
                    background: '#F3F4F6',
                    border: '4px solid var(--primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        The Secret Word
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: 'var(--text-main)',
                        lineHeight: 1.2
                    }}>
                        {word}
                    </div>
                </div>
            </div>

            <div className="btn-group" style={{ flexDirection: 'column', gap: '1.5rem', display: 'flex' }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={onNewRound}
                >
                    🔄 Play Again
                </button>
                <button
                    className="btn btn-secondary btn-lg"
                    onClick={onNewGame}
                >
                    🆕 New Game (New Team)
                </button>
            </div>
        </div>
    );
}
