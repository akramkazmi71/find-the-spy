import React from 'react';
import './App.css';
import PlayerSetup from './components/PlayerSetup';
import NameEntry from './components/NameEntry';
import WordReveal from './components/WordReveal';
import GameControls from './components/GameControls';
import MissionControl from './components/MissionControl';
import Debriefing from './components/Debriefing';
import { initializeGame } from './utils/gameLogic';
import { getWordDescription } from './utils/wordDatabase';

const PHASE = {
    LANDING: 'landing',
    SETUP: 'setup',
    NAME_ENTRY: 'name_entry',
    BRIEFING: 'briefing', // Formerly GAME/Reveal
    MISSION: 'mission',   // Active Game
    DEBRIEFING: 'debriefing' // End Game
};

const GAME_STATE_KEY = 'findTheSpyGameState';

function App() {
    // Initialize state from localStorage if available
    const [phase, setPhase] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        return saved ? JSON.parse(saved).phase : PHASE.LANDING;
    });

    const [playerCount, setPlayerCount] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        return saved ? JSON.parse(saved).playerCount : 0;
    });

    const [gameState, setGameState] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        return saved ? JSON.parse(saved).gameState : null;
    });

    const [revealingPlayer, setRevealingPlayer] = React.useState(null);

    // Check if there's a valid saved game to continue
    const hasSavedGame = React.useMemo(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (!saved) return false;
        const parsed = JSON.parse(saved);
        // Allow continuing from any active game phase
        return [PHASE.BRIEFING, PHASE.MISSION, PHASE.DEBRIEFING].includes(parsed.phase) && parsed.gameState !== null;
    }, []);

    // Save state to localStorage whenever it changes
    React.useEffect(() => {
        if (phase !== PHASE.LANDING) {
            const stateToSave = {
                phase,
                playerCount,
                gameState
            };
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
        }
    }, [phase, playerCount, gameState]);

    const handleStartNewGame = () => {
        setPhase(PHASE.SETUP);
        setPlayerCount(0);
        setGameState(null);
    };

    const handleContinueGame = () => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setPlayerCount(parsed.playerCount);
            setGameState(parsed.gameState);
            setPhase(parsed.phase);
        }
    };

    const handlePlayerCountSelected = (count) => {
        setPlayerCount(count);
        setPhase(PHASE.NAME_ENTRY);
    };

    const handleNamesComplete = (names) => {
        const newGame = initializeGame(names);
        setGameState(newGame);
        setPhase(PHASE.BRIEFING);
    };

    const handleRevealWord = (playerIndex) => {
        setRevealingPlayer(playerIndex);
    };

    const handleCloseReveal = () => {
        if (gameState && revealingPlayer !== null) {
            setGameState({
                ...gameState,
                revealedPlayers: [...gameState.revealedPlayers, revealingPlayer]
            });
        }
        setRevealingPlayer(null);
    };

    const handleStartMission = () => {
        setPhase(PHASE.MISSION);
    };

    const handleEndMission = () => {
        setPhase(PHASE.DEBRIEFING);
    };

    const handleNewRound = () => {
        if (gameState) {
            const newGame = initializeGame(gameState.players);
            setGameState(newGame);
            setPhase(PHASE.BRIEFING);
        }
    };

    const handleReset = () => {
        setPhase(PHASE.LANDING);
        setPlayerCount(0);
        setGameState(null);
        setRevealingPlayer(null);
        localStorage.removeItem(GAME_STATE_KEY);
    };

    const allPlayersRevealed = gameState && gameState.revealedPlayers.length === gameState.players.length;

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1 className="title">🕵️ Find the Spy</h1>
                    <p className="subtitle">
                        Can you find the spy among you?
                    </p>
                </header>

                {phase === PHASE.LANDING && (
                    <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                        <h2 className="card-title">Welcome Players!</h2>
                        <div className="btn-group" style={{ flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {hasSavedGame && (
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleContinueGame}
                                    style={{ width: '100%' }}
                                >
                                    ▶️ Continue Game
                                </button>
                            )}
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={handleStartNewGame}
                                style={{ width: '100%' }}
                            >
                                🆕 Start New Game
                            </button>
                        </div>
                    </div>
                )}

                {phase === PHASE.SETUP && (
                    <PlayerSetup onStart={handlePlayerCountSelected} />
                )}

                {phase === PHASE.NAME_ENTRY && (
                    <NameEntry
                        playerCount={playerCount}
                        onComplete={handleNamesComplete}
                    />
                )}

                {phase === PHASE.BRIEFING && gameState && (
                    <>
                        <div className="card">
                            <h2 className="card-title">
                                Word Reveal
                            </h2>
                            <p style={{
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                Each player must tap their card to see the secret word.
                                One of you is the Spy!
                            </p>

                            {allPlayersRevealed && (
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleStartMission}
                                        style={{
                                            fontSize: '1.25rem',
                                            animation: 'pulse 2s ease-in-out infinite'
                                        }}
                                    >
                                        🚀 Start Game
                                    </button>
                                </div>
                            )}

                            <div className="player-grid">
                                {gameState.players.map((playerName, index) => {
                                    const isRevealed = gameState.revealedPlayers.includes(index);

                                    return (
                                        <div
                                            key={index}
                                            className={`player-card ${isRevealed ? 'revealed' : ''}`}
                                            onClick={() => !isRevealed && handleRevealWord(index)}
                                            style={{
                                                cursor: isRevealed ? 'default' : 'pointer'
                                            }}
                                        >
                                            <div className="player-name">{playerName}</div>
                                            <div className="player-status">
                                                {isRevealed ? '✓ Ready' : 'Tap to See'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <GameControls
                            onNewRound={handleNewRound}
                            onReset={handleReset}
                            gameState={gameState}
                        />
                    </>
                )}

                {phase === PHASE.MISSION && gameState && (
                    <MissionControl
                        gameState={gameState}
                        onEndMission={handleEndMission}
                    />
                )}

                {phase === PHASE.DEBRIEFING && gameState && (
                    <Debriefing
                        gameState={gameState}
                        onNewRound={handleNewRound}
                        onNewGame={handleStartNewGame}
                    />
                )}

                {revealingPlayer !== null && gameState && (
                    <WordReveal
                        playerName={gameState.players[revealingPlayer]}
                        word={gameState.word}
                        isSpy={revealingPlayer === gameState.spyIndex}
                        onClose={handleCloseReveal}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
