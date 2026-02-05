import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Lấy nội dung chi tiết của một bài học
router.get('/:lessonId', async (req, res) => {
    const { lessonId } = req.params;
    const { userId } = req.query;

    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                vocab: true,
                quizzes: true,
                progress: userId ? {
                    where: { userId: userId as string }
                } : false
            }
        });

        if (!lesson) {
            return res.status(404).json({ error: 'Không tìm thấy bài học' });
        }

        res.json({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            vocab: lesson.vocab,
            quizzes: lesson.quizzes,
            tips: lesson.tips,
            progress: lesson.progress?.[0] || null
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy chi tiết bài học' });
    }
});

export default router;
