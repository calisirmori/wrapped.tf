import { ensurePlayer } from '../utils/playerManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses an item pickup log line and updates relevant stats.
 * @param line The log line.
 */
export const parseItemPickupLine = (line: string) => {
    const regex =
        /L (\d+\/\d+\/\d+ - \d+:\d+:\d+): "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" picked up item "([^"]+)"(?: \(healing "(\d+)"\))?/;
    const match = line.match(regex);

    if (match) {
        const timeString = match[1];
        const username = match[2];
        const steamID3 = match[3];
        const team = match[4];
        const itemType = match[5];
        const healingAmount = match[6] ? parseInt(match[6], 10) : 0;

        const steamID64 = steamID3ToID64(steamID3);

        // Ensure the player exists
        const player = ensurePlayer(steamID64, username, team);

        // Update item pickups
        if (!player.stats.itemsPickedUp[itemType]) {
            player.stats.itemsPickedUp[itemType] = 0;
        }
        player.stats.itemsPickedUp[itemType]++;

        // Update healing from items
        if (healingAmount > 0) {
            player.stats.healingFromItems += healingAmount;
        }

        //console.log(`Player ${username} (${steamID64}) picked up item ${itemType}${healingAmount > 0 ? ` (healing ${healingAmount})` : ''}`);
    }
};
