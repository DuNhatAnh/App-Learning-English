import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Lấy 10 câu hỏi ngẫu nhiên từ ngân hàng 150 câu
router.get('/random-quiz', async (req, res) => {
    try {
        // Lấy tất cả quiz questions (có khoảng 150 câu dựa trên seed)
        const allQuestions = await prisma.quizQuestion.findMany();

        // Shuffle và lấy 10 câu đầu tiên
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        res.json(selected);
    } catch (error) {
        console.error('Lỗi khi lấy quiz ngẫu nhiên:', error);
        res.status(500).json({ error: 'Lỗi khi lấy bộ câu hỏi' });
    }
});

// Lấy lịch sử thử thách của user
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const history = await prisma.challengeRecord.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10 // Chỉ lấy 10 bản ghi gần nhất
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy lịch sử' });
    }
});

// Lưu kết quả thử thách
router.post('/save', async (req, res) => {
    const { userId, title, score, total } = req.body;
    try {
        const record = await prisma.challengeRecord.create({
            data: {
                userId,
                title,
                score,
                total
            }
        });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lưu kết quả' });
    }
});

export default router;
