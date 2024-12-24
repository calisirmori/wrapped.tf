export const aggregateKills = (events: any[]) => {
    const killEvents = events.filter((event) => event.type === 'kill');
    const killCounts: { [key: string]: number } = {};

    killEvents.forEach(({ data }: any) => {
        const attacker = data.attacker;
        killCounts[attacker] = (killCounts[attacker] || 0) + 1;
    });

    return killCounts;
};

export const aggregateDamage = (events: any[]) => {
    const damageEvents = events.filter((event) => event.type === 'damage');
    const damageTotals: { [key: string]: number } = {};

    damageEvents.forEach(({ data }: any) => {
        const attacker = data.attacker;
        damageTotals[attacker] = (damageTotals[attacker] || 0) + data.damage;
    });

    return damageTotals;
};

export const aggregateHealing = (events: any[]) => {
    const healEvents = events.filter((event) => event.type === 'heal');
    const healingTotals: { [key: string]: number } = {};

    healEvents.forEach(({ data }: any) => {
        const healer = data.healer;
        healingTotals[healer] = (healingTotals[healer] || 0) + data.healing;
    });

    return healingTotals;
};


export const aggregateUbers = (events: any[]) => {
    const uberActivations = events.filter((event) => event.type === 'uber_activation');
    const uberDrops = events.filter((event) => event.type === 'uber_drop');

    const medicStats: { [key: string]: { activations: number; drops: number } } = {};

    uberActivations.forEach(({ data }: any) => {
        const medic = data.medic;
        if (!medicStats[medic]) {
            medicStats[medic] = { activations: 0, drops: 0 };
        }
        medicStats[medic].activations++;
    });

    uberDrops.forEach(({ data }: any) => {
        const medic = data.medic;
        if (!medicStats[medic]) {
            medicStats[medic] = { activations: 0, drops: 0 };
        }
        medicStats[medic].drops++;
    });

    return medicStats;
};
