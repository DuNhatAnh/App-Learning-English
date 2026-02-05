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
