import { Router } from 'express';
import { parseLogFile } from '../parsers/mainParser';
import { aggregateKills, aggregateDamage, aggregateHealing, aggregateUbers } from '../utils/aggregators';

const router = Router();

router.get('/parse-log', async (req, res) => {
    try {
        const filePath = './log_3554555_text.log'; // Replace with your log file path
        const events = await parseLogFile(filePath);

        const killStats = aggregateKills(events);
        const damageStats = aggregateDamage(events);
        const healingStats = aggregateHealing(events);
        const uberStats = aggregateUbers(events);

        res.status(200).json({
            stats: {
                kills: killStats,
                damage: damageStats,
                healing: healingStats,
                ubers: uberStats,
            },
        });
    } catch (error) {
        console.error('Error parsing log file:', error);
        res.status(500).json({ message: 'Error parsing log file' });
    }
});

export default router;
