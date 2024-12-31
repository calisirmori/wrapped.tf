import * as express from 'express';
import * as cors from 'cors';
import { query } from './db';
import mainParser from './routes/parserRoute';
import logProcessingRoute from './routes/logProcessingRoute';
import profileCardRouter from "./routes/profileCardRoute";
import * as path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

//currently not parsing
//app.use('/api', mainParser);
//app.use('/api/process', logProcessingRoute); 

// Register the profile card route
app.use("/api", profileCardRouter);

// Route to get profile data
app.get('/api/profile/:id64', async (req, res) => {
    const id64 = req.params.id64;

    try {
        // Execute all queries in parallel
        const [
            general,
            activity,
            teammates,
            enemies,
            losingEnemies,
            losingTeammates,
            topFiveClasses,
            topFiveMaps,
            winningEnemies,
            winningTeammates,
            dailyActivity,
            percentiles
        ] = await Promise.all([
            query('SELECT * FROM wrapped.general WHERE id64 = $1', [id64]),
            query('SELECT * FROM wrapped.monthly_activity WHERE id64 = $1', [id64]),
            query('SELECT * FROM wrapped.teammates WHERE id64 = $1 ORDER BY matches_played DESC LIMIT 5', [id64]),
            query('SELECT * FROM wrapped.enemy WHERE id64 = $1 ORDER BY matches_played DESC LIMIT 5', [id64]),
            query(`
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.losingenemies
                WHERE id64 = $1
                ORDER BY win_loss_ratio
                LIMIT 5
            `, [id64]),
            query(`
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.losingteammates
                WHERE id64 = $1
                ORDER BY win_loss_ratio
                LIMIT 5
            `, [id64]),
            query('SELECT * FROM wrapped.topfiveclasses WHERE id64 = $1 ORDER BY time_played DESC LIMIT 5', [id64]),
            query('SELECT * FROM wrapped.topfivemaps WHERE id64 = $1 ORDER BY time_played DESC LIMIT 5', [id64]),
            query(`
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.winningenemies
                WHERE id64 = $1
                ORDER BY win_loss_ratio DESC
                LIMIT 5
            `, [id64]),
            query(`
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.winningteammates
                WHERE id64 = $1
                ORDER BY win_loss_ratio DESC
                LIMIT 5
            `, [id64]),
            query('SELECT * FROM wrapped.daily_activity WHERE id64 = $1', [id64]),
            query('SELECT * FROM wrapped.general_percentiles WHERE id64= $1', [id64]),
        ]);

        // Collect all unique id64s
        const collectedId64s = new Set<string>();

        // Add the initial id64
        collectedId64s.add(id64);

        // Extract id64s from the queries
        teammates.rows.forEach((row: any) => collectedId64s.add(row.teammate_id64));
        enemies.rows.forEach((row: any) => collectedId64s.add(row.enemy_id64));
        losingEnemies.rows.forEach((row: any) => collectedId64s.add(row.enemy_id64));
        losingTeammates.rows.forEach((row: any) => collectedId64s.add(row.teammate_id64));
        winningEnemies.rows.forEach((row: any) => collectedId64s.add(row.enemy_id64));
        winningTeammates.rows.forEach((row: any) => collectedId64s.add(row.teammate_id64));

        // Convert Set to Array
        const id64Array = Array.from(collectedId64s);

        // Query steam_info for all collected id64s
        const steamInfoQuery = `
            SELECT *
            FROM steam_info
            WHERE id64 = ANY($1)
        `;
        const steamInfoRows = await query(steamInfoQuery, [id64Array]);

        // Transform steamInfo rows into an object of objects
        const steamInfo = steamInfoRows.rows.reduce((acc: Record<string, any>, row: any) => {
            acc[row.id64] = {
                avatar: row.avatar,
                name: row.name,
                last_updated: row.last_updated,
                rgl_name: row.rgl_name,
            };
            return acc;
        }, {});

        // Combine results into a single response object
        const responseData = {
            general: general.rows,
            activity: activity.rows,
            teammates: teammates.rows,
            enemies: enemies.rows,
            losingEnemies: losingEnemies.rows,
            losingTeammates: losingTeammates.rows,
            topFiveClasses: topFiveClasses.rows,
            topFiveMaps: topFiveMaps.rows,
            winningEnemies: winningEnemies.rows,
            winningTeammates: winningTeammates.rows,
            dailyActivity: dailyActivity.rows,
            percentiles: percentiles.rows,
            steamInfo, // Attach steam_info data as an object of objects
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ error: 'Failed to fetch profile data' });
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));
export default app;