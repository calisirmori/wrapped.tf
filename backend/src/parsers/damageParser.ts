import { ensurePlayer, updatePlayerStat } from '../utils/playerManager';
import { steamID3ToID64 } from '../utils/steamIDConverter';

/**
 * Parses a damage log line and updates the relevant stats.
 * @param line The log line.
 */
export const parseDamageLine = (line: string) => {
    const regex =
        /"([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" triggered "damage" against "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" \(damage "(\d+)"\) \(weapon "([^"]+)"\)/;
    const match = line.match(regex);

    if (match) {
        const attackerName = match[1];
        const attackerID3 = match[2];
        const attackerTeam = match[3];

        const victimName = match[4];
        const victimID3 = match[5];
        const victimTeam = match[6];

        const damage = parseInt(match[7], 10);
        const weapon = match[8];

        const attackerID64 = steamID3ToID64(attackerID3);
        const victimID64 = steamID3ToID64(victimID3);

        // Ensure both attacker and victim exist in the players object
        ensurePlayer(attackerID64, attackerID3, attackerName);
        ensurePlayer(victimID64, victimID3, victimName);

        // Update the attacker's stats
        updatePlayerStat(attackerID64, 'damageDealt', damage);

        const attacker = ensurePlayer(attackerID64, attackerID3, attackerName);
        if (!attacker.stats.damageToPlayers) {
            attacker.stats.damageToPlayers = {};
        }
        if (!attacker.stats.damageToPlayers[victimID64]) {
            attacker.stats.damageToPlayers[victimID64] = 0;
        }
        attacker.stats.damageToPlayers[victimID64] += damage;

        if (!attacker.stats.damageByWeapon) {
            attacker.stats.damageByWeapon = {};
        }
        if (!attacker.stats.damageByWeapon[weapon]) {
            attacker.stats.damageByWeapon[weapon] = 0;
        }
        attacker.stats.damageByWeapon[weapon] += damage;

        // Update the victim's stats
        const victim = ensurePlayer(victimID64, victimID3, victimName);
        if (!victim.stats.damagedByPlayers) {
            victim.stats.damagedByPlayers = {};
        }
        if (!victim.stats.damagedByPlayers[attackerID64]) {
            victim.stats.damagedByPlayers[attackerID64] = 0;
        }
        victim.stats.damagedByPlayers[attackerID64] += damage;

        if (!victim.stats.damagedByWeapon) {
            victim.stats.damagedByWeapon = {};
        }
        if (!victim.stats.damagedByWeapon[weapon]) {
            victim.stats.damagedByWeapon[weapon] = 0;
        }
        victim.stats.damagedByWeapon[weapon] += damage;

        //console.log(`Player ${attackerName} (${attackerID64}) dealt ${damage} damage to ${victimName} (${victimID64}) using ${weapon}`);
    }
};
