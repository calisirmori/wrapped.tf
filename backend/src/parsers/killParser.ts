export const parseKill = (line: string) => {
    const killRegex =
        /"([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" killed "([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" with "([^"]+)"/;
    const match = line.match(killRegex);

    if (match) {
        const [_, attacker, victim, weapon] = match;
        return {
            type: 'kill',
            data: { attacker, victim, weapon },
        };
    }
    return null;
};
