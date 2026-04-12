import React, { useState } from 'react';

export default function SpyGuessing({ gameState, onComplete, onBack }) {
    const [guessStatus, setGuessStatus] = useState({}); // { [index]: 'correct' | 'incorrect' }
    const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });

    const spyIndices = gameState.spyIndices || (gameState.spyIndex !== undefined ? [gameState.spyIndex] : []);
    const totalSpies = spyIndices.length;

    const handleGuess = (playerIndex) => {
        if (guessStatus[playerIndex]) return; // Already guessed

        const playerName = gameState.players[playerIndex];
        const isSpy = spyIndices.includes(playerIndex);

        setGuessStatus(prev => ({
            ...prev,
            [playerIndex]: isSpy ? 'correct' : 'incorrect'
        }));

        if (isSpy) {
            const correctGuessesSoFar = Object.entries(guessStatus).filter(([idx, status]) => status === 'correct').length + 1;
            let message = `🎯 ${playerName} was the spy!`;
            if (correctGuessesSoFar < totalSpies) {
                message += " More spies are still present.";
            } else {
                if (totalSpies > 1) {
                    message += " You found all the spies!";
                }
                setTimeout(() => {
                    onComplete();
                }, 2000);
            }
            setFeedbackMessage({ text: message, type: 'success' });
        } else {
            setFeedbackMessage({ text: `❌ ${playerName} was not the spy.`, type: 'error' });
        }
    };

    return (
        <div className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease' }}>
            <h2 className="title">Guess the Spy!</h2>
            <p className="subtitle">
                Tap the players you suspect.
            </p>

            {feedbackMessage.text && (
                <div style={{
                    marginBottom: 'var(--spacing-lg)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: feedbackMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `2px solid ${feedbackMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                    color: feedbackMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 'bold',
                    animation: 'pulse 1s ease'
                }}>
                    {feedbackMessage.text}
                </div>
            )}

            <div className="player-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                {gameState.players.map((playerName, index) => {
                    const status = guessStatus[index];
                    let cardStyle = { cursor: 'pointer', transition: 'all 0.3s ease' };
                    let statusText = 'Tap to Guess';

                    if (status === 'correct') {
                        cardStyle.borderColor = 'var(--danger)';
                        cardStyle.color = 'var(--danger)';
                        statusText = 'SPY!';
                    } else if (status === 'incorrect') {
                        cardStyle.borderColor = 'var(--border-color)';
                        cardStyle.opacity = 0.5;
                        statusText = 'Innocent';
                        cardStyle.cursor = 'default';
                    }

                    return (
                        <div
                            key={index}
                            className={`player-card ${status ? (status === 'correct' ? 'stamp-correct' : 'stamp-incorrect') : 'tappable'}`}
                            onClick={() => !status && handleGuess(index)}
                            style={cardStyle}
                        >
                            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{playerName}</span>
                            <span style={{
                                fontSize: '0.875rem',
                                color: status === 'correct' ? 'var(--danger)' : 'var(--text-muted)',
                                fontWeight: status ? 800 : 400
                            }}>
                                {statusText}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-secondary btn-lg"
                    onClick={onComplete}
                    style={{ width: '100%' }}
                >
                    Continue to Debriefing
                </button>
                {onBack && (
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg"
                        onClick={onBack}
                        style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)' }}
                    >
                        ← Back to Game
                    </button>
                )}
            </div>
        </div>
    );
}
