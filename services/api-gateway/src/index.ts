import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

// Service URLs
const LESSON_SERVICE = process.env.LESSON_SERVICE_URL || 'http://lesson-service:5002';
const PROGRESS_SERVICE = process.env.PROGRESS_SERVICE_URL || 'http://progress-service:5003';
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://ai-service:5004';

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API Gateway is running' });
});

// Proxy to Lesson Service (roadmap, lesson, stats, practice)
app.use('/api/roadmap', createProxyMiddleware({
    target: LESSON_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/roadmap': '/api/roadmap' }
}));

app.use('/api/lesson', createProxyMiddleware({
    target: LESSON_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/lesson': '/api/lesson' }
}));

app.use('/api/stats', createProxyMiddleware({
    target: LESSON_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/stats': '/api/stats' }
}));

app.use('/api/practice', createProxyMiddleware({
    target: LESSON_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/practice': '/api/practice' }
}));

// Proxy to Progress Service
app.use('/api/progress', createProxyMiddleware({
    target: PROGRESS_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/progress': '/api/progress' }
}));

// Proxy to AI Service
app.use('/api/ai', createProxyMiddleware({
    target: AI_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/ai': '/api/ai' }
}));

app.listen(port, () => {
    console.log(`🚀 API Gateway running on port ${port}`);
    console.log(`   → Lesson Service: ${LESSON_SERVICE}`);
    console.log(`   → Progress Service: ${PROGRESS_SERVICE}`);
    console.log(`   → AI Service: ${AI_SERVICE}`);
});
