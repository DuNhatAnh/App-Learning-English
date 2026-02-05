import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import progressRoutes from './routes/progress';

dotenv.config();

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.use('/api/progress', progressRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'progress-service' });
});

app.listen(port, () => {
    console.log(`📊 Progress Service running on port ${port}`);
});
