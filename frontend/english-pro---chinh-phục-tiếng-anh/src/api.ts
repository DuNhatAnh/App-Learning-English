import { Lesson, LessonContent, LessonStatus } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const MOCK_USER_ID = 'user-1'; // Dành cho demo nhanh

export const fetchRoadmap = async (): Promise<Lesson[]> => {
    const response = await fetch(`${API_BASE_URL}/roadmap/${MOCK_USER_ID}`);
    if (!response.ok) throw new Error('Không thể lấy lộ trình');
    return response.json();
};

export const fetchLessonDetail = async (lessonId: string): Promise<LessonContent> => {
    const response = await fetch(`${API_BASE_URL}/lesson/${lessonId}?userId=${MOCK_USER_ID}`);
    if (!response.ok) throw new Error('Không thể lấy chi tiết bài học');
    return response.json();
};

export const resetProgress = async (lessonId: string) => {
    const response = await fetch(`${API_BASE_URL}/progress/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: MOCK_USER_ID, lessonId }),
    });
    if (!response.ok) throw new Error('Không thể reset tiến độ');
    return response.json();
};

export const updateProgress = async (lessonId: string, percentage: number, completed: boolean) => {
    const response = await fetch(`${API_BASE_URL}/progress/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: MOCK_USER_ID, lessonId, percentage, completed }),
    });
    if (!response.ok) throw new Error('Không thể cập nhật tiến độ');
    return response.json();
};

export const askGemini = async (prompt: string): Promise<{ text: string }> => {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error('Lỗi từ AI Proxy');
    return response.json();
};

export const fetchStats = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/stats/${MOCK_USER_ID}`);
    if (!response.ok) throw new Error('Không thể lấy thống kê');
    return response.json();
};

export const fetchPractice = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/practice`);
    if (!response.ok) throw new Error('Không thể lấy dữ liệu luyện tập');
    return response.json();
};

export const fetchRandomQuiz = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/challenge/random-quiz`);
    if (!response.ok) throw new Error('Không thể lấy bộ câu hỏi thử thách');
    return response.json();
};

export const fetchChallengeHistory = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/challenge/history/${MOCK_USER_ID}`);
    if (!response.ok) throw new Error('Không thể lấy lịch sử thử thách');
    return response.json();
};

export const saveChallengeResult = async (title: string, score: number, total: number) => {
    const response = await fetch(`${API_BASE_URL}/challenge/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: MOCK_USER_ID, title, score, total }),
    });
    if (!response.ok) throw new Error('Không thể lưu kết quả thử thách');
    return response.json();
};

export interface AIFlashcard {
    word: string;
    phonetic: string;
    meaning: string;
    hint: string;
    example: string;
    exampleVi: string;
    collocations: string[];
}

export interface AIQuotaInfo {
    date: string;
    maxCards: number;
    usedCards: number;
    remainingCards: number;
    maxRequests: number;
    usedRequests: number;
    remainingRequests: number;
}

export interface AIFlashcardResponse {
    flashcards: AIFlashcard[];
    quota: AIQuotaInfo;
}

export const generateAIFlashcards = async (topic: string, count: number): Promise<AIFlashcardResponse> => {
    const response = await fetch(`${API_BASE_URL}/ai/generate-flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count }),
    });
    if (!response.ok) {
        let errorMessage = 'Không thể tạo flashcard từ AI';
        try {
            const payload = await response.json();
            if (payload?.error) errorMessage = payload.error;
        } catch {
            // ignore parse errors
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const fetchAIQuota = async (): Promise<AIQuotaInfo> => {
    const response = await fetch(`${API_BASE_URL}/ai/quota`);
    if (!response.ok) throw new Error('Không thể tải quota AI');
    return response.json();
};
