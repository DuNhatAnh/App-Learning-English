import React, { useState, useEffect } from 'react';
import { fetchPractice } from '../api';
import PrimaryButton from '../components/PrimaryButton';

interface FlashcardData {
  word: string;
  type: string;
  phonetic: string;
  meaning: string;
  description: string;
  example: string;
  exampleVi: string;
  collocations: string[];
  imageUrl: string;
  icon: string;
}

const PracticeScreen: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchPractice();
        setCards(data);
      } catch (error) {
        console.error('Lỗi khi tải thẻ ghi nhớ:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, []);

  if (loading || cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const card = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-1">
            <span className="material-symbols-outlined text-[16px]">chat</span>
            Giao Tiếp Hằng Ngày
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Thẻ Ghi Nhớ Đời Sống
          </h1>
          <p className="text-slate-500 font-medium mt-1">Học từ vựng qua các tình huống thực tế sinh động.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ hôm nay</p>
            <p className="text-sm font-black text-slate-700">{currentIndex + 1} / {cards.length} từ</p>
          </div>
          <div className="size-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined filled">star</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[600px] flex flex-col gap-6 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden flex flex-col transition-all duration-500">
          <div className="h-64 w-full bg-slate-100 relative group overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${card.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Thẻ hình ảnh
              </span>
            </div>
          </div>

          <div className="p-8 md:p-10 flex flex-col items-center text-center gap-4 relative">
            <div className="absolute top-4 right-4 text-slate-50 opacity-10">
              <span className="material-symbols-outlined text-[120px]">{card.icon}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-primary bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2">{card.type}</span>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{card.word}</h3>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <p className="text-lg font-serif italic">{card.phonetic}</p>
                <button className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90">
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </div>
            </div>

            <div className="w-16 h-1.5 bg-blue-100 rounded-full my-1" />

            {!isFlipped ? (
              <div className="flex flex-col items-center gap-4 py-4 min-h-[140px] justify-center">
                <p className="text-xl leading-relaxed text-slate-700 max-w-md font-medium">
                  {card.description}
                </p>
                <div className="mt-4 flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-full border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsFlipped(true)}>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">touch_app</span>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Xem ý nghĩa</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-fade-in w-full z-10 py-2 min-h-[140px]">
                <div>
                  <p className="text-2xl font-black text-primary">{card.meaning}</p>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      Ví dụ giao tiếp:
                    </p>
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-sm font-bold text-slate-800 italic leading-relaxed">
                        "{card.example}"
                      </p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        {card.exampleVi}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[16px]">link</span>
                      Cụm từ liên quan:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.collocations.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-200">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-blue-50 bg-slate-50 flex gap-4">
            <PrimaryButton
              label="Lật thẻ"
              onClick={() => setIsFlipped(!isFlipped)}
              variant="outline"
              icon={isFlipped ? 'visibility_off' : 'sync_alt'}
              className="flex-1"
            />
            <PrimaryButton
              label="Tiếp theo"
              onClick={handleNext}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeScreen;
