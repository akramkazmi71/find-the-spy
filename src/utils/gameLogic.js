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
 * Randomly select a starting player from the list of players
 */
export function selectStartingPlayer(players) {
    if (!players || players.length === 0) {
        return null;
    }
    // Use crypto for better randomness
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomIndex = array[0] % players.length;
    return randomIndex;
}

/**
 * Initialize a new game with players
 * Returns game state with word, spy indices, and starting player
 */
export function initializeGame(players, spyCount = 1) {
    const word = selectRandomWord();
    const spyIndices = selectSpies(players, spyCount);
    const startingPlayerIndex = selectStartingPlayer(players);

    // Note: Spy starting restriction removed as per user request to make it unpredictable.

    return {
        word,
        spyIndices,
        startingPlayerIndex,
        players,
        revealedPlayers: []
    };
}
