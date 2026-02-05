import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Cập nhật tiến độ học tập
router.post('/update', async (req, res) => {
    const { userId, lessonId, percentage, completed } = req.body;

    try {
        const status = completed ? 'COMPLETED' : 'ACTIVE';

        const progress = await prisma.progress.upsert({
            where: {
                userId_lessonId: { userId, lessonId }
            },
            update: {
                percentage,
                status,
                updatedAt: new Date(),
            },
            create: {
                userId,
                lessonId,
                percentage,
                status,
            }
        });

        // Nếu hoàn thành, cập nhật thời gian học (giả định 10p mỗi bài)
        if (completed) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    totalStudyTime: { increment: 10 },
                    lastStudyDate: new Date(),
                }
            });
        }

        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi cập nhật tiến độ' });
    }
});

// Reset tiến độ học tập của một bài học
router.post('/reset', async (req, res) => {
    const { userId, lessonId } = req.body;

    try {
        await prisma.progress.deleteMany({
            where: {
                userId,
                lessonId
            }
        });

        res.json({ message: 'Đã reset tiến độ bài học' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi reset tiến độ' });
    }
});

export default router;
