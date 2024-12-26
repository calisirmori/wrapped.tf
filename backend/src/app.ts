import * as express from 'express';
import * as cors from 'cors';
import { query } from './db';
import mainParser from './routes/parserRoute';
import logProcessingRoute from './routes/logProcessingRoute';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', mainParser);
app.use('/api/process', logProcessingRoute); 

app.listen(5000, () => console.log('Server running on port 5000'));
export default app;
