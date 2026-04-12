import React from 'react';

export default function WordReveal({ playerName, word, description, isSpy, onClose, spiesKnowEachOther, otherSpyNames }) {
    const [isRevealed, setIsRevealed] = React.useState(false);

    const [isClosing, setIsClosing] = React.useState(false);

    const handleReveal = () => setIsRevealed(true);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);
        setIsRevealed(false);
        setTimeout(onClose, 600);
    };

    return (
        <div className="secret-overlay" onClick={handleClose}>
            <div className="flip-card-container" onClick={e => e.stopPropagation()}>
                <div className={`flip-card ${isRevealed ? 'flipped' : ''}`}>

                    {/* FRONT OF CARD */}
                    <div className="flip-card-front">
                        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', textAlign: 'center' }}>
                            [ {playerName} ]
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.1rem' }}>
                            Ready to see your word?
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={handleReveal}
                            disabled={isRevealed}
                            style={{ zIndex: 10 }}
                        >
                            Reveal My Word
                        </button>
                    </div>

                    {/* BACK OF CARD */}
                    <div className={`flip-card-back ${isSpy ? 'is-spy' : ''}`}>
                        {isSpy ? (
                            <>
                                <div style={{
                                    background: 'var(--danger)',
                                    color: 'white',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    fontWeight: 900,
                                    fontSize: '1.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    You Are The Spy
                                </div>
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                                    Maintain your cover and try to figure out the secret word!
                                </p>

                                {spiesKnowEachOther && otherSpyNames && otherSpyNames.length > 0 && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(0, 229, 255, 0.05)',
                                        border: '1px solid var(--primary)',
                                        borderRadius: 'var(--radius-md)',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                            The Other Spies
                                        </div>
                                        <div style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
                                            {otherSpyNames.join(' // ')}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0', fontWeight: 600, fontSize: '1.1rem' }}>
                                    The secret word is:
                                </p>
                                <div className="word-message" style={{
                                    margin: '0.5rem 0 1.5rem',
                                    width: '100%',
                                    textAlign: 'center',
                                    color: 'var(--primary)',
                                    fontSize: '3rem',
                                    fontWeight: 900,
                                    textTransform: 'capitalize',
                                    textShadow: '0 4px 10px rgba(56, 189, 248, 0.3)'
                                }}>
                                    {word}
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center' }}>
                                    Try to find out who the Spy is!
                                </p>
                            </>
                        )}

                        <button
                            type="button"
                            className="btn btn-secondary btn-lg"
                            onClick={handleClose}
                            disabled={isClosing}
                            style={{ marginTop: 'auto', width: '100%' }}
                        >
                            Got it, hide this
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
