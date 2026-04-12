import React from 'react';
import './App.css';
import PlayerSetup from './components/PlayerSetup';
import NameEntry from './components/NameEntry';
import WordReveal from './components/WordReveal';
import GameControls from './components/GameControls';
import MissionControl from './components/MissionControl';
import SpyGuessing from './components/SpyGuessing';
import Debriefing from './components/Debriefing';
import TeamManagement from './components/TeamManagement';
import WordListSetup from './components/WordListSetup';
import { initializeGame } from './utils/gameLogic';
import { getWordDescription } from './utils/wordDatabase';

const PHASE = {
    LANDING: 'landing',
    WORD_SETUP: 'word_setup',
    SETUP: 'setup',
    NAME_ENTRY: 'name_entry',
    BRIEFING: 'briefing', // Formerly GAME/Reveal
    MISSION: 'mission',   // Active Game
    SPY_GUESSING: 'spy_guessing', // Guess who is spy
    DEBRIEFING: 'debriefing', // End Game
    TEAM_MANAGEMENT: 'team_management' // Post-game edit team
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

    const [spyCount, setSpyCount] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        return saved ? JSON.parse(saved).spyCount : 1;
    });

    const [spiesKnowEachOther, setSpiesKnowEachOther] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        return saved ? JSON.parse(saved).spiesKnowEachOther || false : false;
    });

    const [gameState, setGameState] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        return saved ? JSON.parse(saved).gameState : null;
    });

    const [names, setNames] = React.useState(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.gameState && parsed.gameState.players) return parsed.gameState.players;
        }
        return [];
    });

    const [revealingPlayer, setRevealingPlayer] = React.useState(null);

    // Check if there's a valid saved game to continue
    const hasSavedGame = React.useMemo(() => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (!saved) return false;
        const parsed = JSON.parse(saved);
        // Allow continuing from any active game phase
        return [PHASE.BRIEFING, PHASE.MISSION, PHASE.SPY_GUESSING, PHASE.DEBRIEFING].includes(parsed.phase) && parsed.gameState !== null;
    }, []);

    // Save state to localStorage whenever it changes
    React.useEffect(() => {
        if (phase !== PHASE.LANDING) {
            // Ensure gameState is migrated if it exists
            const migratedGameState = gameState && !gameState.spyIndices && gameState.spyIndex !== undefined
                ? { ...gameState, spyIndices: [gameState.spyIndex] }
                : gameState;

            const stateToSave = {
                phase,
                playerCount,
                spyCount,
                spiesKnowEachOther,
                gameState: migratedGameState,
                names // Preserve names even if game not started
            };
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
        }
    }, [phase, playerCount, spyCount, gameState]);

    const handleStartNewGame = () => {
        setPhase(PHASE.SETUP);
        setPlayerCount(0);
        setGameState(null);
        setNames([]);
    };

    const handleContinueGame = () => {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setPlayerCount(parsed.playerCount);
            setGameState(parsed.gameState);
            setPhase(parsed.phase);
            if (parsed.names) setNames(parsed.names);
        }
    };

    const handlePlayerCountSelected = (count, spies, knowEachOther) => {
        setPlayerCount(count);
        setSpyCount(spies);
        setSpiesKnowEachOther(knowEachOther);
        // Initialize names array if count changed
        if (names.length !== count) {
            setNames(Array(count).fill(''));
        }
        setPhase(PHASE.NAME_ENTRY);
    };

    const handleNamesComplete = (names) => {
        const newGame = initializeGame(names, spyCount);
        // Include cooperation flag in game state for easy access in components
        const gameWithCooperation = { ...newGame, spiesKnowEachOther };
        setGameState(gameWithCooperation);
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
        setPhase(PHASE.SPY_GUESSING);
    };

    const handleEndGuessing = () => {
        setPhase(PHASE.DEBRIEFING);
    };

    const handleNewRound = () => {
        if (gameState) {
            const newGame = initializeGame(gameState.players, spyCount);
            const gameWithCooperation = { ...newGame, spiesKnowEachOther };
            setGameState(gameWithCooperation);
            setPhase(PHASE.BRIEFING);
        }
    };

    const handleEditTeam = () => {
        setPhase(PHASE.TEAM_MANAGEMENT);
    };

    const handleStartManagedTeam = (players, newSpyCount, newSpiesKnowEachOther) => {
        setPlayerCount(players.length);
        setSpyCount(newSpyCount);
        setSpiesKnowEachOther(newSpiesKnowEachOther);
        const newGame = initializeGame(players, newSpyCount);
        const gameWithCooperation = { ...newGame, spiesKnowEachOther: newSpiesKnowEachOther };
        setGameState(gameWithCooperation);
        setPhase(PHASE.BRIEFING);
    };

    const handleReset = () => {
        setPhase(PHASE.LANDING);
        setPlayerCount(0);
        setSpyCount(1);
        setSpiesKnowEachOther(false);
        setGameState(null);
        setRevealingPlayer(null);
        localStorage.removeItem(GAME_STATE_KEY);
    };

    const allPlayersRevealed = gameState && gameState.revealedPlayers.length === gameState.players.length;

    return (
        <div className="app">
            <div className="container">
                <header className="header" style={{ position: 'relative' }}>
                    <h1 className="title">🕵️ Find the Spy</h1>
                    <p className="subtitle">
                        Can you find the spy among you?
                    </p>
                    {phase !== PHASE.WORD_SETUP && (
                        <button
                            onClick={() => setPhase(PHASE.WORD_SETUP)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }}
                            title="Word Settings"
                        >
                            ⚙️
                        </button>
                    )}
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
                                className="btn btn-primary btn-lg"
                                onClick={handleStartNewGame}
                                style={{ width: '100%' }}
                            >
                                🚀 Start New Game
                            </button>
                        </div>
                    </div>
                )}

                {phase === PHASE.WORD_SETUP && (
                    <WordListSetup onBack={() => setPhase(PHASE.LANDING)} />
                )}

                {phase === PHASE.SETUP && (
                    <PlayerSetup
                        onStart={handlePlayerCountSelected}
                        onBack={() => setPhase(PHASE.LANDING)}
                    />
                )}

                {phase === PHASE.NAME_ENTRY && (
                    <NameEntry
                        playerCount={playerCount}
                        onComplete={handleNamesComplete}
                        onBack={() => setPhase(PHASE.SETUP)}
                        names={names}
                        setNames={setNames}
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

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                {allPlayersRevealed ? (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleStartMission}
                                        style={{
                                            fontSize: '1.25rem',
                                            animation: 'pulse 2s ease-in-out infinite',
                                            flex: 2
                                        }}
                                    >
                                        🚀 Start Game
                                    </button>
                                ) : null}
                                <button
                                    className="btn btn-secondary btn-lg"
                                    onClick={() => setPhase(PHASE.NAME_ENTRY)}
                                    style={{ flex: 1 }}
                                >
                                    ← Back
                                </button>
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
                        onBack={() => setPhase(PHASE.BRIEFING)}
                    />
                )}

                {phase === PHASE.SPY_GUESSING && gameState && (
                    <SpyGuessing
                        gameState={gameState}
                        onComplete={handleEndGuessing}
                        onBack={() => setPhase(PHASE.MISSION)}
                    />
                )}

                {phase === PHASE.DEBRIEFING && gameState && (
                    <Debriefing
                        gameState={gameState}
                        onNewRound={handleNewRound}
                        onNewGame={handleStartNewGame}
                        onEditTeam={handleEditTeam}
                    />
                )}

                {phase === PHASE.TEAM_MANAGEMENT && gameState && (
                    <TeamManagement
                        initialPlayers={gameState.players}
                        initialSpyCount={spyCount}
                        initialSpiesKnowEachOther={spiesKnowEachOther}
                        onStart={handleStartManagedTeam}
                        onCancel={() => setPhase(PHASE.DEBRIEFING)}
                    />
                )}

                {revealingPlayer !== null && gameState && (
                    <WordReveal
                        playerName={gameState.players[revealingPlayer]}
                        word={gameState.word}
                        isSpy={(gameState.spyIndices || (gameState.spyIndex !== undefined ? [gameState.spyIndex] : [])).includes(revealingPlayer)}
                        spiesKnowEachOther={gameState.spiesKnowEachOther}
                        otherSpyNames={
                            gameState.spyIndices
                                ? gameState.spyIndices
                                    .filter(idx => idx !== revealingPlayer)
                                    .map(idx => gameState.players[idx])
                                : []
                        }
                        onClose={handleCloseReveal}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
