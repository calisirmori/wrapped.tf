import { parsePlayerConnection } from './playerParser';
import { parsePlayerInitialization } from './playerParser';
import { parseDamageLine } from './damageParser';
import { parseTeamJoin } from './teamParser';
import { parseKillLine } from './killParser';
import { parseShotLine } from './shotParser';
import { parseHealLine } from './healParser';
import { parseItemPickupLine } from './itemPickupParser';
import { parseChatLine } from './chatParser';
import { parseGameOverLine } from './gameOverParser';

/**
 * Dispatches a log line to the appropriate parser.
 * @param line The log line.
 */
export const parseLogLine = (line: string) => {
    if (line.includes('connected')) {
        parsePlayerConnection(line);
    } else if (line.includes('changed role to')) {
        parsePlayerInitialization(line);
    } else if (line.includes('joined team')) {
        parseTeamJoin(line);
    } else if (line.includes('triggered "damage"')) {
        parseDamageLine(line);
    } else if (line.includes('killed')) {
        parseKillLine(line);
    } else if (line.includes('triggered "shot_fired"') || line.includes('triggered "shot_hit"')) {
        parseShotLine(line);
    } else if (line.includes('triggered "healed"')) {
        parseHealLine(line);
    } else if (line.includes('picked up item')) {
        parseItemPickupLine(line);
    } else if (line.includes('say') || line.includes('say_team')) {
        parseChatLine(line); 
    } else if (line.includes('triggered "Game_Over"')) { 
        parseGameOverLine(line);
    }
};
