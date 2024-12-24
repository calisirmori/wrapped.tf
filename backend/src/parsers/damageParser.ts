export const parseDamage = (line: string) => {
    const damageRegex =
        /"([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" damaged "([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" for (\d+) damage/;
    const match = line.match(damageRegex);

    if (match) {
        const [_, attacker, victim, damage] = match;
        return {
            type: 'damage',
            data: { attacker, victim, damage: parseInt(damage, 10) },
        };
    }
    return null;
};
