import * as express from 'express';
import * as cors from 'cors';
import { query } from './db';
import logParserRoute from './routes/parserRoute';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

app.get('/api/stats/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const stats = await query('SELECT * FROM match_stats WHERE user_id = $1', [userId]);
        res.json(stats.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving stats');
    }
});

app.post('/api/stats', async (req, res) => {
    const { user_id, match_id, total_damage, total_healing, total_time_played } = req.body;

    try {
        const result = await query(
            'INSERT INTO match_stats (user_id, match_id, total_damage, total_healing, total_time_played) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, match_id, total_damage, total_healing, total_time_played]
        );

        res.status(201).json({ message: 'Data inserted successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
});

app.use('/api', logParserRoute);

app.listen(5000, () => console.log('Server running on port 5000'));
export default app;
