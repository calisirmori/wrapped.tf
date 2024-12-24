export const parseHeal = (line: string) => {
    const healRegex =
        /"([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" healed "([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" for (\d+) health/;
    const match = line.match(healRegex);

    if (match) {
        const [_, healer, target, healing] = match;
        return {
            type: 'heal',
            data: {
                healer,
                target,
                healing: parseInt(healing, 10),
            },
        };
    }
    return null;
};
