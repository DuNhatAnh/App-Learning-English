import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const parseLimit = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const DAILY_MAX_CARDS = parseLimit(process.env.AI_DAILY_MAX_CARDS, 200);
const DAILY_MAX_REQUESTS = parseLimit(process.env.AI_DAILY_MAX_REQUESTS, 50);

const usageState = {
    date: '',
    usedCards: 0,
    usedRequests: 0,
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const resetUsageIfNeeded = () => {
    const today = getTodayKey();
    if (usageState.date !== today) {
        usageState.date = today;
        usageState.usedCards = 0;
        usageState.usedRequests = 0;
    }
};

const buildQuota = () => {
    resetUsageIfNeeded();
    const remainingCards = Math.max(DAILY_MAX_CARDS - usageState.usedCards, 0);
    const remainingRequests = Math.max(DAILY_MAX_REQUESTS - usageState.usedRequests, 0);
    return {
        date: usageState.date,
        maxCards: DAILY_MAX_CARDS,
        usedCards: usageState.usedCards,
        remainingCards,
        maxRequests: DAILY_MAX_REQUESTS,
        usedRequests: usageState.usedRequests,
        remainingRequests,
    };
};

const isInvalidApiKey = (apiKey?: string) => {
    if (!apiKey) return true;
    const normalized = apiKey.trim();
    return normalized === 'PLACEHOLDER' || normalized === 'PLACEHOLDER_API_KEY';
};

router.get('/quota', (req, res) => {
    return res.json(buildQuota());
});

// Proxy cho Gemini API
router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (isInvalidApiKey(apiKey)) {
        return res.status(500).json({
            error: 'GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ. Vui lòng đặt biến môi trường GEMINI_API_KEY đúng.',
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'Lỗi khi gọi Gemini API' });
    }
});

// Tạo flashcard bằng AI theo chủ đề
router.post('/generate-flashcards', async (req, res) => {
    const { topic, count } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!topic || !count) {
        return res.status(400).json({ error: 'Vui lòng cung cấp topic và count' });
    }

    if (isInvalidApiKey(apiKey)) {
        return res.status(500).json({
            error: 'GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ. Vui lòng đặt biến môi trường GEMINI_API_KEY đúng.',
        });
    }

    const cardCount = Number(count);
    if (!Number.isFinite(cardCount) || cardCount <= 0) {
        return res.status(400).json({ error: 'count phải là số dương' });
    }

    const quota = buildQuota();
    if (quota.remainingRequests <= 0 || quota.remainingCards < cardCount) {
        return res.status(429).json({
            error: 'Đã vượt giới hạn sử dụng AI trong ngày.',
            quota,
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Bạn là một giáo viên tiếng Anh. Hãy tạo ${count} flashcard từ vựng tiếng Anh theo chủ đề "${topic}".

Trả về ĐÚNG định dạng JSON array như sau (không có markdown, chỉ JSON thuần):
[
  {
    "word": "từ tiếng Anh",
    "phonetic": "phiên âm IPA",
    "meaning": "nghĩa tiếng Việt",
    "hint": "gợi ý ngắn gọn để đoán từ",
    "example": "một câu ví dụ sử dụng từ này",
    "exampleVi": "dịch câu ví dụ sang tiếng Việt",
    "collocations": ["cụm từ 1", "cụm từ 2", "cụm từ 3"]
  }
]

Yêu cầu:
- Mỗi từ phải phổ biến và hữu ích cho người học
- Phiên âm phải chính xác theo IPA
- Ví dụ phải thực tế và dễ hiểu
- Collocations phải là các cụm từ phổ biến đi kèm với từ đó`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON từ response
        let flashcards;
        try {
            // Loại bỏ markdown code block nếu có
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            flashcards = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).json({
                error: 'Lỗi khi parse response từ AI. Vui lòng thử lại.',
                raw: text,
            });
        }

        resetUsageIfNeeded();
        usageState.usedRequests += 1;
        usageState.usedCards += cardCount;

        return res.json({
            flashcards,
            quota: buildQuota(),
        });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'Lỗi khi gọi Gemini API' });
    }
});

export default router;
