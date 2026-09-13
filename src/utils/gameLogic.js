import { wordDatabase, shuffleArray } from './wordDatabase';

const STORAGE_KEY = 'findTheSpyUsedWords';

/**
 * Get list of used words from localStorage
 */
export function getUsedWords() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading used words:', error);
        return [];
    }
}

/**
 * Get word settings from sessionStorage
 */
export function getWordSettings() {
    try {
        const stored = sessionStorage.getItem('findTheSpyWordSettings');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading word settings:', error);
    }
    return { mode: 'default', customWords: [] };
}

/**
 * Mark a word as used in localStorage
 */
export function markWordAsUsed(word) {
    try {
        const usedWords = getUsedWords();
        if (!usedWords.includes(word)) {
            usedWords.push(word);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usedWords));
        }
    } catch (error) {
        console.error('Error marking word as used:', error);
    }
}

/**
 * Reset used words list
 */
export function resetUsedWords() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
        console.error('Error resetting used words:', error);
    }
}

/**
 * Select a random word that hasn't been used yet
 * If all words have been used, automatically reset and start fresh
 */
export function selectRandomWord() {
    const usedWords = getUsedWords();
    const settings = getWordSettings();
    let currentDatabase = wordDatabase;

    if (settings.mode === 'custom' && settings.customWords.length > 0) {
        currentDatabase = settings.customWords;
    } else if (settings.mode === 'merged' && settings.customWords.length > 0) {
        currentDatabase = [...wordDatabase, ...settings.customWords];
    }

    const availableWords = currentDatabase.filter(word => !usedWords.includes(word));

    // If all words have been used, reset and use full database
    if (availableWords.length === 0) {
        resetUsedWords();
        const shuffled = shuffleArray(currentDatabase);
        const selectedWord = shuffled[0];
        markWordAsUsed(selectedWord);
        return selectedWord;
    }

    // Select random word from available words
    const shuffled = shuffleArray(availableWords);
    const selectedWord = shuffled[0];
    markWordAsUsed(selectedWord);
    return selectedWord;
}

/**
 * Randomly select spies from the list of players
 * Uses crypto.getRandomValues for better randomness
 * Implements a tracking mechanism to avoid back-to-back selection of the same spy
 */
export function selectSpies(players, count = 1) {
    if (!players || players.length === 0) {
        return [];
    }

    // Ensure we don't pick more spies than players
    const actualCount = Math.min(count, players.length);
    const indices = Array.from({ length: players.length }, (_, i) => i);

    // Read last spies from session storage
    let lastSpies = [];
    try {
        const stored = sessionStorage.getItem('findTheSpyLastSpies');
        if (stored) {
            lastSpies = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading last spies', e);
    }

    // Identify which current indices correspond to last round's spies
    const lastSpyIndices = indices.filter(i => lastSpies.includes(players[i]));
    const freshIndices = indices.filter(i => !lastSpyIndices.includes(i));

    let pool = indices;
    // Prevent consecutive selections if we have enough fresh players
    if (freshIndices.length >= actualCount) {
        pool = freshIndices;
    }

    // Shuffle pool and take the first 'count' ones
    const shuffledPool = shuffleArray(pool);
    const selectedIndices = shuffledPool.slice(0, actualCount);

    // Save new spies to session storage
    try {
        const newSpies = selectedIndices.map(i => players[i]);
        sessionStorage.setItem('findTheSpyLastSpies', JSON.stringify(newSpies));
    } catch (e) {
        console.error('Error saving last spies', e);
    }

    return selectedIndices;
}

/**
 * Randomly select a starting player from the list of players.
 * Non-spy players are favored ~90% of the time to prevent spies from starting too frequently,
 * while maintaining a small ~10% chance for a spy to start for occasional surprise.
 */
export function selectStartingPlayer(players, spyIndices = []) {
    if (!players || players.length === 0) {
        return 0;
    }

    const indices = Array.from({ length: players.length }, (_, i) => i);
    const nonSpyIndices = indices.filter(i => !spyIndices.includes(i));

    // Default pool is all players
    let pool = indices;

    if (nonSpyIndices.length > 0) {
        // Roll 0-99 using crypto
        const rollArray = new Uint32Array(1);
        crypto.getRandomValues(rollArray);
        const roll = rollArray[0] % 100;

        // 90% of the time, select strictly from non-spy players
        if (roll < 90) {
            pool = nonSpyIndices;
        }
    }

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomIndexInPool = array[0] % pool.length;
    return pool[randomIndexInPool];
}

/**
 * Determines whether the "Surprise Double Agent" twist should activate.
 * Only triggers when the player chose 1 spy and there are enough players.
 * Probability: ~10% (1 in 10 games).
 * Returns true if the twist should fire.
 */
function shouldActivateSurpriseTwist(players, chosenSpyCount) {
    // Only applies when players opted for exactly 1 spy
    // and there are at least 7 players (so 2 spies doesn't dominate a small group)
    if (chosenSpyCount !== 1 || players.length < 7) return false;

    const roll = new Uint32Array(1);
    crypto.getRandomValues(roll);
    // ~10% chance (0-9 out of 0-99)
    return (roll[0] % 100) < 10;
}

/**
 * Initialize a new game with players.
 * Returns game state with word, spy indices, and starting player.
 * May secretly activate the "Surprise Double Agent" twist (~10% chance when 1 spy chosen).
 */
export function initializeGame(players, spyCount = 1) {
    const word = selectRandomWord();

    // Surprise twist: secretly assign 2 spies even though players chose 1
    const surpriseTwistActive = shouldActivateSurpriseTwist(players, spyCount);
    const effectiveSpyCount = surpriseTwistActive ? 2 : spyCount;

    const spyIndices = selectSpies(players, effectiveSpyCount);
    const startingPlayerIndex = selectStartingPlayer(players, spyIndices);

    return {
        word,
        spyIndices,
        startingPlayerIndex,
        players,
        revealedPlayers: [],
        // Track whether this round was a surprise twist for Debriefing reveal
        surpriseTwistActive,
        // The spy count players originally chose (for context in debriefing)
        chosenSpyCount: spyCount,
    };
}
