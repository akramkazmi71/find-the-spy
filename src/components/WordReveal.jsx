import React from 'react';

export default function WordReveal({ playerName, word, description, isSpy, onClose, spiesKnowEachOther, otherSpyNames }) {
    const [isRevealed, setIsRevealed] = React.useState(false);

    const handleReveal = () => {
        setIsRevealed(true);
    };

    const handleClose = () => {
        setIsRevealed(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className="secret-overlay" onClick={handleClose}>
            <div
                className={`secret-content ${isRevealed && isSpy ? 'spy-mode' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--text-primary)'
                }}>
                    {playerName}'s Turn
                </h2>

                {!isRevealed ? (
                    <>
                        <p style={{
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            Click the button below to reveal your word.
                            <br />
                            <strong style={{ color: 'var(--warning)' }}>
                                Make sure others can't see your screen!
                            </strong>
                        </p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleReveal}
                            style={{ fontSize: '1.25rem' }}
                        >
                            🔒 Reveal My Word
                        </button>
                    </>
                ) : (
                    <>
                        {isSpy ? (
                            <>
                                <div style={{
                                    fontSize: '3rem',
                                    margin: 'var(--spacing-lg) 0',
                                    padding: 'var(--spacing-lg)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '2px solid var(--danger)',
                                    color: 'var(--danger)',
                                    fontWeight: 700,
                                    animation: 'pulse 2s ease-in-out infinite'
                                }}>
                                    🕵️ YOU ARE THE SPY! 🕵️
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    marginBottom: 'var(--spacing-lg)',
                                    fontSize: '1.125rem'
                                }}>
                                    Try to figure out the word from others' descriptions!
                                </p>

                                {spiesKnowEachOther && otherSpyNames && otherSpyNames.length > 0 && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1.25rem',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        border: '2px dashed var(--primary)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            fontWeight: 800,
                                            color: 'var(--primary)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            🤝 Your fellow spies
                                        </p>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 900,
                                            color: 'var(--text-main)'
                                        }}>
                                            {otherSpyNames.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    Your Word
                                </p>
                                <div style={{
                                    fontSize: '3rem',
                                    margin: 'var(--spacing-lg) 0',
                                    padding: 'var(--spacing-lg)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '2px solid var(--accent-primary)',
                                    color: 'var(--accent-primary)',
                                    fontWeight: 700,
                                    animation: 'pulse 2s ease-in-out infinite'
                                }}>
                                    {word}
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    marginBottom: 'var(--spacing-lg)',
                                    fontSize: '1.125rem'
                                }}>
                                    Describe this word without saying it directly!
                                </p>
                            </>
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={handleClose}
                        >
                            ✓ Got it, hide this
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
