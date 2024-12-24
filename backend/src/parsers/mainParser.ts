import * as fs from 'fs';
import * as readline from 'readline';
import { parseLogLine, ParsedEvent } from './index';

export const parseLogFile = async (filePath: string): Promise<ParsedEvent[]> => {
    const parsedEvents: ParsedEvent[] = [];

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: stream });

        rl.on('line', (line) => {
            const parsedEvent = parseLogLine(line);
            if (parsedEvent) {
                parsedEvents.push(parsedEvent);
            }
        });

        rl.on('close', () => {
            resolve(parsedEvents);
        });

        rl.on('error', (error) => {
            reject(error);
        });
    });
};
