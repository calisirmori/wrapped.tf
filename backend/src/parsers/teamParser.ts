import { ensurePlayer, updatePlayerTeamAndClass } from '../utils/playerManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses a "joined team" log line and updates the player's team.
 * @param line The log line.
 */
export const parseTeamJoin = (line: string) => {
    const regex = /"([^"]+)<\d+><(\[U:\d+:\d+\])><[^>]+>" joined team "([^"]+)"/;
    const match = line.match(regex);

    if (match) {
        const username = match[1]; // Extract username
        const steamID3 = match[2]; // Extract SteamID3
        const team = match[3]; // Extract team (Spectator, Red, Blue, etc.)
        const steamID64 = steamID3ToID64(steamID3); // Convert SteamID3 to SteamID64

        // Ensure the player's object exists
        ensurePlayer(steamID64, steamID3, username);

        // Update the player's team
        updatePlayerTeamAndClass(steamID64, team, 'Unknown'); // Class remains "Unknown" until specified

        //console.log(`Player ${username} (${steamID64}) joined team ${team}`);
    }
};
