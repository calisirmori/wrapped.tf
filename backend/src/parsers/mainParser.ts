import * as fs from 'fs';
import * as readline from 'readline';
import { parseLogLine } from './index';
import { resetPlayers, getAllPlayers } from '../utils/playerManager';
import { getKillEvents } from '../utils/killEventManager';
import { getChatEvents } from './chatParser'; // Import the chat event function
import { parseGameOverLine, resetGameOverCount, getCombinedStatus } from './gameOverParser'; // Import game over related functions

/**
 * Reads a log file and processes it line by line.
 * @param filePath The path to the log file.
 * @returns The final aggregated object after processing all lines.
 */
export const parseLogFile = async (filePath: string): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
        // Reset players and other aggregators before parsing
        resetPlayers();

        const rl = readline.createInterface({ input: fs.createReadStream(filePath) });

        rl.on('line', (line) => {
            parseLogLine(line); // Dispatch each line for processing
        });
        
        
        rl.on('close', () => {

            // Final aggregated object
            const finalObject = {
                players: getAllPlayers(),
                killEvents: getKillEvents(),
                chatEvents: getChatEvents(),
                isCombined: getCombinedStatus(),
            };
            resolve(finalObject);
        });

        rl.on('error', (error) => {
            console.error(`Error reading log file: ${error}`);
            reject(error);
        });
    });
};