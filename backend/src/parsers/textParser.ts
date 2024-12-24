import * as fs from 'fs';
import * as readline from 'readline';

/**
 * Parses a text file line by line to extract unique player names.
 * @param filePath Path to the log file
 * @returns Promise resolving to an array of unique player names
 */
export const parseTextFile = async (filePath: string): Promise<string[]> => {
    const players = new Set<string>(); // Use a Set to store unique names
    const playerRegex = /"([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>"/;

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: stream });

        rl.on('line', (line) => {
            const match = line.match(playerRegex);
            if (match) {
                players.add(match[1]); // Add player name to the Set
            }
        });

        rl.on('close', () => {
            resolve(Array.from(players)); // Convert Set to Array
        });

        rl.on('error', (error) => {
            reject(error);
        });
    });
};