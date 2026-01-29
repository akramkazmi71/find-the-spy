import React from 'react';
import { getUsedWords, resetUsedWords } from '../utils/gameLogic';
import { wordDatabase } from '../utils/wordDatabase';

export default function GameControls({ onNewRound, onReset, gameState }) {
    const [usedWordsCount, setUsedWordsCount] = React.useState(getUsedWords().length);
    const totalWords = wordDatabase.length;
    const remainingWords = totalWords - usedWordsCount;

    // Update word count whenever game state changes (new round)
    React.useEffect(() => {
        setUsedWordsCount(getUsedWords().length);
    }, [gameState]);

    // Also listen for storage events in case of multiple tabs (robustness)
    React.useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'findTheSpyUsedWords') {
                setUsedWordsCount(getUsedWords().length);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleResetWords = () => {
        resetUsedWords(); // clears localStorage
        setUsedWordsCount(0); // update UI immediately
    };


    return (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <div className="stats">
                <div className="stat-card">
                    <span className="stat-value">{usedWordsCount}</span>
                    <span className="stat-label">Words Used</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{remainingWords}</span>
                    <span className="stat-label">Words Remaining</span>
                </div>
            </div>

            <div className="btn-group" style={{ flexDirection: 'column', gap: '1rem', display: 'flex' }}>
                <button className="btn btn-primary btn-lg" onClick={onNewRound}>
                    🎲 New Round
                </button>
                <button className="btn btn-secondary btn-lg" onClick={onReset}>
                    🔄 New Game
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleResetWords} style={{ marginTop: '0.5rem' }}>
                    Reset Word History
                </button>
            </div>
        </div>
    );
}
