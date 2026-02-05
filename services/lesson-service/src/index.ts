import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roadmapRoutes from './routes/roadmap';
import lessonRoutes from './routes/lesson';
import statsRoutes from './routes/stats';
import practiceRoutes from './routes/practice';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.use('/api/roadmap', roadmapRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/practice', practiceRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'lesson-service' });
});

app.listen(port, () => {
    console.log(`📚 Lesson Service running on port ${port}`);
});
