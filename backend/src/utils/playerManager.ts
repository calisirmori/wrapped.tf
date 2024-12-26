export interface PlayerStats {
    // Damage statistics
    damageDealt: number; // Total damage dealt by the player
    damageToPlayers: Record<string, number>; // Damage dealt to specific players by SteamID64
    damageByWeapon: Record<string, number>; // Damage dealt by specific weapons

    damagedByPlayers: Record<string, number>; // Damage received from specific players by SteamID64
    damagedByWeapon: Record<string, number>; // Damage received from specific weapons

    // Kill and death statistics
    kills: number; // Total kills by the player
    killsByPlayers: Record<string, number>; // Kills against specific players by SteamID64
    killsByWeapon: Record<string, number>; // Kills by specific weapons

    deaths: number; // Total deaths of the player
    deathsByPlayers: Record<string, number>; // Deaths caused by specific players by SteamID64
    deathsByWeapon: Record<string, number>; // Deaths caused by specific weapons

    // Shot statistics
    shots: Record<string, { fired: number; hit: number }>; // Shots fired and hit by weapon

    healingGiven: number; // Total healing given by the player
    healingToPlayers: Record<string, number>; // Healing given to specific players by SteamID64

    healingReceived: number; // Total healing received by the player
    healingFromPlayers: Record<string, number>; // Healing received from specific players by SteamID64

    itemsPickedUp: Record<string, number>; // Number of items picked up by type
    healingFromItems: number;

    // Future-proofing
    [key: string]: any; // Allow dynamic additions to stats for other events
}


export interface Player {
    username: string;
    steamID3: string;
    team: string;
    currentClass: string;
    stats: PlayerStats;
}

const players: Record<string, Player> = {};

/**
 * Resets the players object to start fresh.
 */
export const resetPlayers = () => {
    for (const key in players) {
        delete players[key]; // Remove all keys
    }
};

/**
 * Retrieves the entire players object.
 * @returns The players object.
 */
export const getAllPlayers = (): Record<string, Player> => {
    return players;
};

/**
 * Ensures a player object exists in the `players` map.
 * @param steamID64 The SteamID64 of the player.
 * @param steamID3 The SteamID3 of the player.
 * @param username The player's username.
 */
export const ensurePlayer = (steamID64: string, steamID3: string, username: string): Player => {
    if (!players[steamID64]) {
        players[steamID64] = {
            username,
            steamID3,
            currentClass: 'Unknown',
            team: 'Unknown',
            stats: {
                damageDealt: 0,
                damageToPlayers: {},
                damageByWeapon: {},
                damagedByPlayers: {},
                damagedByWeapon: {},
                kills: 0,
                killsByPlayers: {},
                killsByWeapon: {},
                deaths: 0,
                deathsByPlayers: {},
                deathsByWeapon: {},
                shots: {},
                healingGiven: 0,
                healingToPlayers: {},
                healingReceived: 0,
                healingFromPlayers: {},
                itemsPickedUp: {},
                healingFromItems: 0,
            },
        };
    }
    return players[steamID64];
};

/**
 * Updates a player's stats.
 * @param steamID64 The SteamID64 of the player.
 * @param stat The stat to update (e.g., "damageDealt", "kills").
 * @param value The value to add to the stat.
 */
export const updatePlayerStat = (
    steamID64: string,
    stat: keyof Player['stats'], // Restrict to valid keys in stats
    value: number
) => {
    const player = players[steamID64];
    if (player) {
        // Assert that stat is a valid key of stats
        if (typeof player.stats[stat] === 'number') {
            (player.stats[stat] as number) += value; // Use type assertion to avoid "never" issue
        } else {
            console.error(`Stat ${stat} is not a valid number for player ${steamID64}`);
        }
    } else {
        console.error(`Player ${steamID64} does not exist`);
    }
};

export const updatePlayerTeamAndClass = (
    steamID64: string,
    team: string,
    currentClass: string
) => {
    const player = players[steamID64];
    if (player) {
        player.team = team;
        player.currentClass = currentClass;
    } else {
        console.error(`Player ${steamID64} does not exist`);
    }
};

/**
 * Updates a player's shots data.
 * @param steamID64 SteamID64 of the player.
 * @param weapon The weapon used.
 * @param type The type of event ("fired" or "hit").
 */
export const updatePlayerShots = (steamID64: string, weapon: string, type: 'fired' | 'hit') => {
    const player = ensurePlayer(steamID64, '', 'Unknown');

    if (!player.stats.shots) {
        player.stats.shots = {};
    }

    if (!player.stats.shots[weapon]) {
        player.stats.shots[weapon] = { fired: 0, hit: 0 };
    }

    if (type === 'fired') {
        player.stats.shots[weapon].fired++;
    } else if (type === 'hit') {
        player.stats.shots[weapon].hit++;
    }
};

