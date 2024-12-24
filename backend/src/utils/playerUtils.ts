export const getUniquePlayers = (players: { id: string; name: string }[]) => {
    const uniquePlayers = new Map<string, string>(); // Map to ensure unique players by ID

    players.forEach((player) => {
        if (!uniquePlayers.has(player.id)) {
            uniquePlayers.set(player.id, player.name);
        }
    });

    return Array.from(uniquePlayers.entries()).map(([id, name]) => ({ id, name }));
};