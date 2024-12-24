export const parseUber = (line: string) => {
    // Regex for Uber activation
    const uberActivationRegex =
        /"([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" triggered "ubercharge" on "([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>"/;

    // Regex for Uber drop
    const uberDropRegex =
        /"([^"]+)<\d+><\[U:\d+:\d+\]><[^>]+>" triggered "ubercharge_dropped"/;

    if (line.includes('triggered "ubercharge"')) {
        const match = line.match(uberActivationRegex);
        if (match) {
            const [_, medic, target] = match;
            return {
                type: 'uber_activation',
                data: { medic, target },
            };
        }
    } else if (line.includes('triggered "ubercharge_dropped"')) {
        const match = line.match(uberDropRegex);
        if (match) {
            const [_, medic] = match;
            return {
                type: 'uber_drop',
                data: { medic },
            };
        }
    }

    return null; // Not an Uber event
};
