import { ensurePlayer } from '../utils/playerManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses a heal log line and updates relevant stats.
 * @param line The log line.
 */
export const parseHealLine = (line: string) => {
    const regex =
        /L (\d+\/\d+\/\d+ - \d+:\d+:\d+): "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" triggered "healed" against "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" \(healing "(\d+)"\)/;
    const match = line.match(regex);

    if (match) {
        const timeString = match[1];
        const healerName = match[2];
        const healerID3 = match[3];
        const healerTeam = match[4];
        const healedName = match[5];
        const healedID3 = match[6];
        const healedTeam = match[7];
        const healingAmount = parseInt(match[8], 10);

        const healerID64 = steamID3ToID64(healerID3);
        const healedID64 = steamID3ToID64(healedID3);

        // Ensure players exist
        const healer = ensurePlayer(healerID64, healerName, healerTeam);
        const healed = ensurePlayer(healedID64, healedName, healedTeam);

        // Update healer stats
        healer.stats.healingGiven += healingAmount;
        if (!healer.stats.healingToPlayers[healedID64]) {
            healer.stats.healingToPlayers[healedID64] = 0;
        }
        healer.stats.healingToPlayers[healedID64] += healingAmount;

        // Update healed stats
        healed.stats.healingReceived += healingAmount;
        if (!healed.stats.healingFromPlayers[healerID64]) {
            healed.stats.healingFromPlayers[healerID64] = 0;
        }
        healed.stats.healingFromPlayers[healerID64] += healingAmount;

        //console.log(`Healer ${healerName} (${healerID64}) healed ${healedName} (${healedID64}) for ${healingAmount} HP`);
    }
};
