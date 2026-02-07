import React, { useEffect, useState } from 'react';
import { generateAIFlashcards, AIFlashcard, AIQuotaInfo, fetchAIQuota } from '../api';
import PrimaryButton from '../components/PrimaryButton';

type Step = 'topic' | 'count' | 'learning';

const AIFlashcardScreen: React.FC = () => {
    const [step, setStep] = useState<Step>('topic');
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [cards, setCards] = useState<AIFlashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quota, setQuota] = useState<AIQuotaInfo | null>(null);
    const [quotaError, setQuotaError] = useState('');

    useEffect(() => {
        const loadQuota = async () => {
            try {
                const data = await fetchAIQuota();
                setQuota(data);
            } catch (err) {
                setQuotaError('Không thể tải quota AI');
            }
        };
        loadQuota();
    }, []);

    const speakWord = (word: string) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    };

    const handleTopicSubmit = () => {
        if (!topic.trim()) {
            setError('Vui lòng nhập chủ đề!');
            return;
        }
        setError('');
        setStep('count');
    };

    const handleCountSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await generateAIFlashcards(topic, count);
            setCards(result.flashcards);
            setQuota(result.quota);
            setStep('learning');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo flashcard. Vui lòng thử lại!';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleReset = () => {
        setStep('topic');
        setTopic('');
        setCards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    // Bước 1: Nhập chủ đề
    if (step === 'topic') {
        return (
            <div className="max-w-[600px] mx-auto px-4 py-12 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20">
                    <span className="material-symbols-outlined text-white text-4xl">auto_awesome</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">Flashcard AI</h1>
                <p className="text-slate-500 text-center mb-8">AI sẽ tạo flashcard theo chủ đề bạn muốn học</p>

                <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 block">
                        Bạn muốn học chủ đề gì?
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ví dụ: Du lịch, Công nghệ, Ẩm thực..."
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none text-lg font-medium transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && handleTopicSubmit()}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <PrimaryButton
                        label="Tiếp tục"
                        onClick={handleTopicSubmit}
                        className="w-full mt-6"
                        icon="arrow_forward"
                    />
                </div>
            </div>
        );
    }

    // Bước 2: Chọn số lượng
    if (step === 'count') {
        return (
            <div className="max-w-[600px] mx-auto px-4 py-12 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20">
                    <span className="material-symbols-outlined text-white text-4xl">format_list_numbered</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">Chủ đề: {topic}</h1>
                <p className="text-slate-500 text-center mb-8">Bạn muốn học bao nhiêu từ?</p>

                <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 block">
                        Số lượng flashcard
                    </label>
                    <div className="flex gap-3 flex-wrap mb-6">
                        {[3, 5, 10, 15, 20].map((num) => (
                            <button
                                key={num}
                                onClick={() => setCount(num)}
                                className={`px-6 py-3 rounded-2xl font-black text-lg transition-all ${count === num
                                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-5">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">info</span>
                            Bảng điều kiện hôm nay
                        </p>
                        {quota ? (
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-slate-600">
                                        <tr>
                                            <th className="px-3 py-2 font-black uppercase text-[10px] tracking-widest">Hạng mục</th>
                                            <th className="px-3 py-2 font-black uppercase text-[10px] tracking-widest">Tổng</th>
                                            <th className="px-3 py-2 font-black uppercase text-[10px] tracking-widest">Đã dùng</th>
                                            <th className="px-3 py-2 font-black uppercase text-[10px] tracking-widest">Còn lại</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-slate-100">
                                            <td className="px-3 py-2 font-semibold text-slate-700">Flashcard</td>
                                            <td className="px-3 py-2">{quota.maxCards}</td>
                                            <td className="px-3 py-2">{quota.usedCards}</td>
                                            <td className="px-3 py-2 font-black text-emerald-600">{quota.remainingCards}</td>
                                        </tr>
                                        <tr className="border-t border-slate-100">
                                            <td className="px-3 py-2 font-semibold text-slate-700">Lượt hỏi</td>
                                            <td className="px-3 py-2">{quota.maxRequests}</td>
                                            <td className="px-3 py-2">{quota.usedRequests}</td>
                                            <td className="px-3 py-2 font-black text-emerald-600">{quota.remainingRequests}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">{quotaError || 'Đang tải quota...'}</p>
                        )}
                        {quota && (
                            <p className="text-[11px] text-slate-400 mt-2">Áp dụng theo ngày: {quota.date}</p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <PrimaryButton
                            label="Quay lại"
                            onClick={() => setStep('topic')}
                            variant="outline"
                            icon="arrow_back"
                            className="flex-1"
                        />
                        <PrimaryButton
                            label={loading ? 'Đang tạo...' : 'Tạo Flashcard'}
                            onClick={handleCountSubmit}
                            className="flex-1"
                            icon="auto_awesome"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Bước 3: Học flashcard
    const card = cards[currentIndex];
    if (!card) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-slate-500">Không có flashcard nào.</p>
                <PrimaryButton label="Thử lại" onClick={handleReset} className="mt-4" />
            </div>
        );
    }

    return (
        <div className="max-w-[700px] mx-auto px-4 py-8 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="font-medium">Đổi chủ đề</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full">
                    <span className="material-symbols-outlined text-violet-600 text-sm">style</span>
                    <span className="text-sm font-black text-violet-600">{currentIndex + 1} / {cards.length}</span>
                </div>
            </div>

            {/* Flashcard */}
            <div
                className={`w-full bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden cursor-pointer transition-all duration-500 ${isFlipped ? 'ring-2 ring-violet-500' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {!isFlipped ? (
                    // Mặt trước
                    <div className="p-10 flex flex-col items-center text-center min-h-[400px] justify-center relative">
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-black uppercase">Mặt trước</span>
                        </div>

                        <h2 className="text-5xl font-black text-slate-900 mb-3">{card.word}</h2>
                        <div className="flex items-center gap-3 mb-6">
                            <p className="text-xl text-slate-500 font-serif italic">{card.phonetic}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); speakWord(card.word); }}
                                className="size-10 rounded-full bg-violet-100 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-all active:scale-90"
                            >
                                <span className="material-symbols-outlined">volume_up</span>
                            </button>
                        </div>

                        <div className="w-16 h-1 bg-slate-200 rounded-full my-4" />

                        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 max-w-md">
                            <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">lightbulb</span>
                                Gợi ý
                            </p>
                            <p className="text-amber-800 font-medium">{card.hint}</p>
                        </div>

                        <p className="text-slate-400 text-sm mt-8 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">touch_app</span>
                            Nhấn để xem nghĩa
                        </p>
                    </div>
                ) : (
                    // Mặt sau
                    <div className="p-10 flex flex-col min-h-[400px] relative">
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-black uppercase">Mặt sau</span>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-4xl font-black text-slate-900 mb-1">{card.word}</h2>
                            <p className="text-2xl font-bold text-violet-600">{card.meaning}</p>
                        </div>

                        <div className="space-y-5 flex-1">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">menu_book</span>
                                    Ví dụ
                                </p>
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                    <p className="text-slate-800 font-medium italic">"{card.example}"</p>
                                    <p className="text-slate-500 text-sm mt-2">{card.exampleVi}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">link</span>
                                    Cụm từ liên quan
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {card.collocations.map((col, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 border border-slate-200">
                                            {col}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm mt-6 text-center flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">touch_app</span>
                            Nhấn để xem mặt trước
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="w-full flex gap-4 mt-6">
                <PrimaryButton
                    label="Trước"
                    onClick={handlePrevious}
                    variant="outline"
                    icon="arrow_back"
                    className="flex-1"
                    disabled={currentIndex === 0}
                />
                <PrimaryButton
                    label="Lật thẻ"
                    onClick={() => setIsFlipped(!isFlipped)}
                    variant="outline"
                    icon="sync_alt"
                    className="flex-1"
                />
                <PrimaryButton
                    label="Tiếp"
                    onClick={handleNext}
                    icon="arrow_forward"
                    className="flex-1"
                    disabled={currentIndex === cards.length - 1}
                />
            </div>
        </div>
    );
};

export default AIFlashcardScreen;
