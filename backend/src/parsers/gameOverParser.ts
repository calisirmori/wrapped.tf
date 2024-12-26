let gameOverCount = 0;  // Track the number of "Game_Over" events

/**
 * Parses a "Game_Over" event in the log file.
 * @param line The log line to parse.
 * @returns The game over data, including the reason and isCombined status.
 */
export const parseGameOverLine = (line: string) => {
    const regex = /triggered "Game_Over" reason "([A-Za-z ]+)"/;
    const match = line.match(regex);

    if (match) {
        gameOverCount++;  // Increment the "Game_Over" event count
        return {
            isCombined: gameOverCount > 1,  // Set isCombined if more than one Game_Over event is found
            reason: match[1],  // Extract and return the reason for the game over
        };
    }

    return null;  // If no match is found, return null
};

/**
 * Resets the count of "Game_Over" events, to be called at the start of processing a new log file.
 */
export const resetGameOverCount = () => {
    gameOverCount = 0;  // Reset the count to 0 for new log files
};

/**
 * Gets the combined status (true if the game is combined based on multiple "Game_Over" events).
 * @returns Whether the game is combined or not.
 */
export const getCombinedStatus = (): boolean => {
    return gameOverCount > 1;  // Return true if multiple "Game_Over" events were found
};
