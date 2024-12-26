import { updatePlayerShots } from '../utils/playerManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses a shot event log line and updates the relevant stats.
 * @param line The log line.
 */
export const parseShotLine = (line: string) => {
    const regex =
        /L (\d+\/\d+\/\d+ - \d+:\d+:\d+): "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" triggered "(shot_fired|shot_hit)" \(weapon "([^"]+)"\)/;
    const match = line.match(regex);

    if (match) {
        const timeString = match[1];
        const username = match[2];
        const steamID3 = match[3];
        const team = match[4];
        const eventType = match[5]; // "shot_fired" or "shot_hit"
        const weapon = match[6];

        const steamID64 = steamID3ToID64(steamID3);

        // Determine the type of event and update player stats
        if (eventType === 'shot_fired') {
            updatePlayerShots(steamID64, weapon, 'fired');
        } else if (eventType === 'shot_hit') {
            updatePlayerShots(steamID64, weapon, 'hit');
        }

        //console.log(`Player ${username} (${steamID64}) ${eventType.replace('shot_', '')} a shot with ${weapon}`);
    }
};
