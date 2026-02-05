import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Lấy danh sách lộ trình bài học cho một user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const lessons = await prisma.lesson.findMany({
            orderBy: { order: 'asc' },
            include: {
                progress: {
                    where: { userId }
                }
            }
        });

        const roadmap = lessons.map((lesson: any) => {
            const userProgress = lesson.progress[0];
            let status = userProgress?.status || 'ACTIVE'; // Mặc định là ACTIVE thay vì LOCKED
            const percentage = userProgress?.percentage || 0;

            // Đảm bảo bài đã có progress nhưng status là ACTIVE thì vẫn giữ ACTIVE
            // Nếu đã COMPLETED thì giữ COMPLETED.

            return {
                id: lesson.id,
                title: lesson.title,
                order: lesson.order,
                status: status,
                progress: percentage,
                description: lesson.tips || 'Khám phá kiến thức mới ngay hôm nay.'
            };
        });

        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy lộ trình' });
    }
});

export default router;
