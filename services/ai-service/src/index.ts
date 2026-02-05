import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ai-service' });
});

app.listen(port, () => {
    console.log(`🤖 AI Service running on port ${port}`);
});
