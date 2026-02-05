import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roadmapRoutes from './routes/roadmap';
import lessonRoutes from './routes/lesson';
import progressRoutes from './routes/progress';
import aiRoutes from './routes/ai';
import statsRoutes from './routes/stats';
import practiceRoutes from './routes/practice';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/roadmap', roadmapRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/practice', practiceRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
    console.log(`Server là running trên port ${port}`);
});
