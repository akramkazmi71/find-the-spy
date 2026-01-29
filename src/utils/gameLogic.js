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
    const availableWords = wordDatabase.filter(word => !usedWords.includes(word));

    // If all words have been used, reset and use full database
    if (availableWords.length === 0) {
        resetUsedWords();
        const shuffled = shuffleArray(wordDatabase);
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
 * Randomly select a spy from the list of players
 * Uses crypto.getRandomValues for better randomness
 */
export function selectSpy(players) {
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
 * Returns game state with word, spy index, and starting player
 */
export function initializeGame(players) {
    const word = selectRandomWord();
    const spyIndex = selectSpy(players);
    let startingPlayerIndex = selectStartingPlayer(players);

    // Ensure spy doesn't start (if > 1 player)
    if (players.length > 1) {
        // Simple rejection sampling: keep picking until different
        // With small player counts, this is efficient enough
        let safetyCounter = 0;
        while (startingPlayerIndex === spyIndex && safetyCounter < 10) {
            startingPlayerIndex = selectStartingPlayer(players);
            safetyCounter++;
        }

        // Fallback if random fails (unlikely, but safe)
        if (startingPlayerIndex === spyIndex) {
            startingPlayerIndex = (spyIndex + 1) % players.length;
        }
    }

    return {
        word,
        spyIndex,
        startingPlayerIndex,
        players,
        revealedPlayers: []
    };
}
