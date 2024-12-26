import { ensurePlayer, updatePlayerTeamAndClass } from '../utils/playerManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses a player connection line and ensures their object exists.
 * @param line The log line.
 */
export const parsePlayerConnection = (line: string) => {
    const regex = /"([^"]+)<\d+><(\[U:\d+:\d+\])><[^>]*>" connected, address "([^"]+)"/;
    const match = line.match(regex);

    if (match) {
        const username = match[1];
        const steamID3 = match[2];
        const steamID64 = steamID3ToID64(steamID3);

        // Ensure the player exists in the players object
        ensurePlayer(steamID64, steamID3, username);

        // Optionally: Store the IP address or log it (if needed)
        //console.log(`Player ${username} connected from address`);
    }
};

/**
 * Parses a player initialization line (e.g., "changed role to").
 * Ensures the player's object is created and updates team/class.
 * @param line The log line.
 */
export const parsePlayerInitialization = (line: string) => {
    const regex = /"([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" changed role to "([^"]+)"/;
    const match = line.match(regex);

    if (match) {
        const username = match[1]; // Extract username
        const steamID3 = match[2]; // Extract SteamID3
        const team = match[3]; // Extract current team (Red, Blue, etc.)
        const currentClass = match[4]; // Extract current class (e.g., demoman)
        const steamID64 = steamID3ToID64(steamID3); // Convert SteamID3 to SteamID64

        // Ensure the player exists and update team/class
        ensurePlayer(steamID64, steamID3, username);
        updatePlayerTeamAndClass(steamID64, team, currentClass);

        //console.log(`Initialized player: ${username} (${steamID64}) as ${currentClass} on ${team}`);
    }
};