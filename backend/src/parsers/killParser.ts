import { addKillEvent } from '../utils/killEventManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses a kill log line and updates relevant stats.
 * @param line The log line.
 */
export const parseKillLine = (line: string) => {
    const regex =
        /L (\d+\/\d+\/\d+ - \d+:\d+:\d+): "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" killed "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" with "([^"]+)" \(attacker_position "([^"]+)"\) \(victim_position "([^"]+)"(?: \(crit "([^"]+)"\))?(?: \(headshot "([^"]+)"\))?/;
    const match = line.match(regex);

    if (match) {
        const timeString = match[1];
        const attackerName = match[2];
        const attackerID3 = match[3];
        const attackerTeam = match[4];
        const victimName = match[5];
        const victimID3 = match[6];
        const victimTeam = match[7];
        const weapon = match[8];
        const attackerPositionString = match[9];
        const victimPositionString = match[10];
        const crit = match[11] === "1"; // Parse crit as boolean
        const headshot = match[12] === "1"; // Parse headshot as boolean

        const attackerID64 = steamID3ToID64(attackerID3);
        const victimID64 = steamID3ToID64(victimID3);

        // Convert time to epoch
        const parseLogTime = (timeString: string): number => {
            const [datePart, timePart] = timeString.split(' - ');
            const [month, day, year] = datePart.split('/').map((num) => parseInt(num, 10));
            const [hours, minutes, seconds] = timePart.split(':').map((num) => parseInt(num, 10));

            return Date.UTC(year, month - 1, day, hours, minutes, seconds);
        };

        const time = parseLogTime(timeString);

        // Parse positions
        const parsePosition = (position: string) => {
            const [x, y, z] = position.split(' ').map((coord) => parseFloat(coord));
            return { x, y, z };
        };

        const attackerPosition = parsePosition(attackerPositionString);
        const victimPosition = parsePosition(victimPositionString);

        // Add the kill event
        addKillEvent(
            time,
            attackerID64,
            victimID64,
            weapon,
            attackerPosition,
            victimPosition,
            crit,
            headshot
        );
    }
};
