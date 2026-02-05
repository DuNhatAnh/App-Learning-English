import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Lấy thống kê của một user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: { progress: { where: { status: 'COMPLETED' } } }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        // Mock kỹ năng dựa trên số bài đã học
        const completedCount = user._count.progress;
        const stats = {
            completedLessons: completedCount,
            streak: user.streak,
            totalMinutes: user.totalStudyTime,
            skills: [
                { name: 'Listening', value: Math.min(100, 20 + completedCount * 15) },
                { name: 'Speaking', value: Math.min(100, 10 + completedCount * 10) },
                { name: 'Reading', value: Math.min(100, 25 + completedCount * 12) },
                { name: 'Vocabulary', value: Math.min(100, 30 + completedCount * 20) },
            ]
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy thống kê' });
    }
});

export default router;
