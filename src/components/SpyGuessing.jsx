import React, { useState } from 'react';

export default function SpyGuessing({ gameState, onComplete }) {
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
            <h2 className="card-title">Guess the Spy!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                Tap on the players you suspect.
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
                        cardStyle.background = '#FEF2F2';
                        cardStyle.borderColor = 'var(--danger)';
                        cardStyle.color = 'var(--danger)';
                        statusText = 'SPY!';
                    } else if (status === 'incorrect') {
                        cardStyle.background = 'rgba(156, 163, 175, 0.1)';
                        cardStyle.borderColor = 'transparent';
                        cardStyle.opacity = 0.6;
                        statusText = 'Innocent';
                        cardStyle.cursor = 'default';
                    }

                    return (
                        <div
                            key={index}
                            className={`player-card ${status ? 'revealed' : ''}`}
                            onClick={() => !status && handleGuess(index)}
                            style={cardStyle}
                        >
                            <div className="player-name">{playerName}</div>
                            <div className="player-status" style={{
                                color: status === 'correct' ? 'var(--danger)' : 'var(--text-muted)'
                            }}>
                                {statusText}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="btn-group">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={onComplete}
                    style={{ width: '100%' }}
                >
                    ➡️ Continue to Debriefing
                </button>
            </div>
        </div>
    );
}
