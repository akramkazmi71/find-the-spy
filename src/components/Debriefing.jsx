import React from 'react';
import { getWordDescription } from '../utils/wordDatabase';

export default function Debriefing({ gameState, onNewRound, onNewGame, onEditTeam }) {
    // Migration safety: support both old 'spyIndex' and new 'spyIndices'
    const indices = gameState.spyIndices || (gameState.spyIndex !== undefined ? [gameState.spyIndex] : []);
    const spyNames = indices.map(index => gameState.players[index]).join(', ');
    const spyCount = indices.length;
    const word = gameState.word;
    const description = getWordDescription(word);

    return (
        <div className="card debriefing" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease' }}>
            <div className="mission-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
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
                    Game Over
                </div>
                <h2 className="title" style={{ marginBottom: 'var(--spacing-sm)' }}>
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
                    background: 'var(--bg-app)',
                    border: '2px solid var(--danger)',
                    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        {spyCount > 1 ? 'The Spies' : 'The Spy'}
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: 'var(--danger)',
                        lineHeight: 1.2,
                        textShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
                    }}>
                        {spyNames}
                    </div>
                </div>

                {/* Word Reveal */}
                <div className="card-result" style={{
                    background: 'var(--bg-app)',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 8px 20px rgba(56, 189, 248, 0.15)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        Secret Word
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: 'var(--primary)',
                        lineHeight: 1.2,
                        textTransform: 'capitalize',
                        textShadow: '0 0 10px rgba(56, 189, 248, 0.3)'
                    }}>
                        {word}
                    </div>
                </div>
            </div>

            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={onNewRound}
                >
                    Play Again
                </button>
                <div style={{ display: 'flex', gap: '1rem', width: '100%', flexDirection: 'row' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onEditTeam}
                        style={{ flex: 1 }}
                    >
                        Edit Team
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onNewGame}
                        style={{ flex: 1 }}
                    >
                        New Match
                    </button>
                </div>
            </div>
        </div>
    );
}
