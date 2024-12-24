import { parseKill } from './killParser';
import { parseDamage } from './damageParser';
import { parseHeal } from './healParser';
import { parseUber } from './uberParser';

export interface ParsedEvent {
    type: string;
    data: any;
}

export const parseLogLine = (line: string): ParsedEvent | null => {
    if (line.includes('killed')) {
        return parseKill(line);
    } else if (line.includes('damaged')) {
        return parseDamage(line);
    } else if (line.includes('healed')) {
        return parseHeal(line);
    } else if (line.includes('ubercharge') || line.includes('dropped')) {
        return parseUber(line);
    }
    return null;
};
