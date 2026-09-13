import React from 'react';
import { getWordDescription } from '../utils/wordDatabase';

export default function Debriefing({ gameState, onNewRound, onNewGame, onEditTeam }) {
    // Migration safety: support both old 'spyIndex' and new 'spyIndices'
    const indices = gameState.spyIndices || (gameState.spyIndex !== undefined ? [gameState.spyIndex] : []);
    const spyNames = indices.map(index => gameState.players[index]).join(', ');
    const spyCount = indices.length;
    const word = gameState.word;
    const isSurpriseTwist = gameState.surpriseTwistActive === true;

    return (
        <div className="card debriefing" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease' }}>

            {/* Surprise Double Agent Twist Banner */}
            {isSurpriseTwist && (
                <div style={{
                    marginBottom: 'var(--spacing-lg)',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(239, 68, 68, 0.15))',
                    border: '2px solid #fbbf24',
                    borderRadius: 'var(--radius-lg)',
                    animation: 'pulse 2s ease-in-out 3',
                }}>
                    <div style={{
                        fontSize: '2rem',
                        marginBottom: '0.25rem',
                        lineHeight: 1,
                    }}>
                        🎭
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: '#fbbf24',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '0.35rem',
                    }}>
                        SURPRISE TWIST!
                    </div>
                    <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        lineHeight: 1.5,
                    }}>
                        You thought there was <strong style={{ color: 'var(--text-main)' }}>1 spy</strong> — but this round secretly had{' '}
                        <strong style={{ color: '#fbbf24' }}>2 Double Agents</strong>! 🕵️🕵️
                    </div>
                </div>
            )}

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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, max-content))',
                    justifyContent: 'center',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-xl)',
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                }}
            >
                {/* Spy Reveal */}
                <div className="card-result" style={{
                    background: 'var(--bg-app)',
                    border: `2px solid ${isSurpriseTwist ? '#fbbf24' : 'var(--danger)'}`,
                    boxShadow: isSurpriseTwist
                        ? '0 8px 20px rgba(251, 191, 36, 0.2)'
                        : '0 8px 20px rgba(239, 68, 68, 0.15)',
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
                        {spyCount > 1 ? (isSurpriseTwist ? '🎭 The Double Agents' : 'The Spies') : 'The Spy'}
                    </div>
                    <div style={{
                        fontSize: spyCount > 1 ? '1.9rem' : '2.5rem',
                        fontWeight: 900,
                        color: isSurpriseTwist ? '#fbbf24' : 'var(--danger)',
                        lineHeight: 1.3,
                        textShadow: isSurpriseTwist
                            ? '0 0 10px rgba(251, 191, 36, 0.4)'
                            : '0 0 10px rgba(239, 68, 68, 0.3)'
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

            <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={onNewRound}
                    style={{ width: '100%', fontSize: '1.2rem' }}
                >
                    🎲 Play Next Round (Same Players)
                </button>
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg"
                        onClick={onEditTeam}
                        style={{ flex: 1, borderColor: 'var(--primary)', color: 'var(--primary-light)', padding: '0.75rem 0.5rem', fontSize: '0.95rem' }}
                    >
                        👥 Manage Players
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg"
                        onClick={onNewGame}
                        style={{ flex: 1, padding: '0.75rem 0.5rem', fontSize: '0.95rem' }}
                    >
                        🚀 New Match
                    </button>
                </div>
            </div>
        </div>
    );
}
