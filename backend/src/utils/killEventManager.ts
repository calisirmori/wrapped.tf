import { updatePlayerStat } from '../utils/playerManager';
import { ensurePlayer } from '../utils/playerManager';

interface Position {
    x: number;
    y: number;
    z: number;
}

interface KillEvent {
    time: number; // Epoch time
    attacker: {
        id64: string;
        position: Position;
    };
    victim: {
        id64: string;
        position: Position;
    };
    crit: boolean;
    headshot: boolean;
    weapon: string;
}

const killEvents: KillEvent[] = [];

/**
 * Adds a new kill event.
 * @param time The time the kill occurred (epoch).
 * @param attackerID64 The Steam64 ID of the attacker.
 * @param victimID64 The Steam64 ID of the victim.
 * @param weapon The weapon used.
 * @param crit Whether the kill was a critical hit.
 * @param headshot Whether the kill was a headshot.
 */
export const addKillEvent = (
    time: number,
    attackerID64: string,
    victimID64: string,
    weapon: string,
    attackerPosition: { x: number, y: number, z: number }, // Position object with x, y, z
    victimPosition: { x: number, y: number, z: number },   // Position object with x, y, z
    crit: boolean,
    headshot: boolean
) => {
    killEvents.push({
        time,
        attacker: {
            id64: attackerID64,
            position: attackerPosition, // Position is an object here
        },
        victim: {
            id64: victimID64,
            position: victimPosition,   // Position is an object here
        },
        weapon,
        crit,
        headshot,
    });

    // Update attacker stats
    const attacker = ensurePlayer(attackerID64, '', 'Unknown');
    attacker.stats.kills++;
    if (!attacker.stats.killsByPlayers[victimID64]) {
        attacker.stats.killsByPlayers[victimID64] = 0;
    }
    attacker.stats.killsByPlayers[victimID64]++;
    if (!attacker.stats.killsByWeapon[weapon]) {
        attacker.stats.killsByWeapon[weapon] = 0;
    }
    attacker.stats.killsByWeapon[weapon]++;

    // Update victim stats
    const victim = ensurePlayer(victimID64, '', 'Unknown');
    victim.stats.deaths++;
    if (!victim.stats.deathsByPlayers[attackerID64]) {
        victim.stats.deathsByPlayers[attackerID64] = 0;
    }
    victim.stats.deathsByPlayers[attackerID64]++;
    if (!victim.stats.deathsByWeapon[weapon]) {
        victim.stats.deathsByWeapon[weapon] = 0;
    }
    victim.stats.deathsByWeapon[weapon]++;
};

/**
 * Retrieves all kill events.
 * @returns All stored kill events.
 */
export const getKillEvents = (): KillEvent[] => {
    return killEvents;
};
