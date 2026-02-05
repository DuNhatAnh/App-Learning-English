import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Lấy danh sách flashcards (từ vựng) để luyện tập
router.get('/', async (req, res) => {
    try {
        const vocab = await prisma.vocabulary.findMany({
            take: 10,
            orderBy: { id: 'asc' }
        });

        // Chuyển đổi sang định dạng FlashcardData của Frontend
        const flashcards = vocab.map((v, index) => ({
            word: v.word,
            type: 'Vocabulary',
            phonetic: v.phonetic || '',
            meaning: v.meaning,
            description: `Một thuật ngữ quan trọng trong bài học.`,
            example: `Ví dụ về từ ${v.word}.`,
            exampleVi: `Ví dụ tiếng Việt.`,
            collocations: ['Practice makes perfect'],
            imageUrl: `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800`,
            icon: 'school'
        }));

        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy từ vựng luyện tập' });
    }
});

export default router;
