
import React, { useState, useEffect } from 'react';
import { LESSON_DETAILS, MOCK_LESSONS } from '../constants';

interface LessonDetailProps {
  lessonId: number;
  onBack: () => void;
  onComplete: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lessonId, onBack, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [lessonId]);

  const detail = LESSON_DETAILS[lessonId];
  const basicInfo = MOCK_LESSONS.find(l => l.id === lessonId);

  if (!detail || !basicInfo) {
    return <div className="p-10 text-center font-bold">Đang tải bài học...</div>;
  }

  const handleCheck = () => {
    if (selectedAnswer) setShowFeedback(true);
  };

  // Generate progress based on whether answered
  const lessonProgress = showFeedback ? 100 : 30;

  return (
    <div className="min-h-screen bg-[#E6F2FF] flex flex-col pb-24 animate-fade-in">
      <div className="fixed top-0 left-0 w-full z-[60]">
        <div className="w-full h-1.5 bg-slate-200">
          <div className="h-full bg-primary rounded-r-full transition-all duration-700" style={{ width: `${lessonProgress}%` }} />
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 h-16 shadow-sm mt-1.5">
        <div className="max-w-[1100px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1" />
            <h1 className="text-slate-900 text-lg font-black tracking-tight truncate">{basicInfo.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span className="text-xs font-black">{basicInfo.duration} phút</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center w-full px-4 py-8">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8 md:p-12 relative">
              <div className="mb-10 border-b border-slate-50 pb-6">
                <h2 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Kiến thức chuyên ngành</h2>
                <h3 className="text-3xl font-black text-primary">{detail.sectionTitle}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {detail.vocab.map((item, i) => (
                  <div key={i} className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group cursor-pointer">
                    <button className="size-12 rounded-full bg-white text-primary shadow-sm flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">volume_up</span>
                    </button>
                    <div>
                      <p className="text-xl font-black text-slate-900">{item.word}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 font-serif italic">{item.phonetic}</p>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.meaning}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-2xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 font-black shadow-inner border border-blue-100">?</div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800">{detail.quizQuestion}</h4>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Chọn đáp án đúng nhất.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {detail.quizOptions.map((ans) => (
                    <button 
                      key={ans}
                      onClick={() => !showFeedback && setSelectedAnswer(ans)}
                      className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center text-left
                        ${selectedAnswer === ans ? 'border-primary bg-blue-50 shadow-md ring-4 ring-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}
                        ${showFeedback && ans === detail.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                        ${showFeedback && selectedAnswer === ans && ans !== detail.correctAnswer ? 'border-red-400 bg-red-50' : ''}`}>
                      <div>
                        <span className={`text-lg font-black ${selectedAnswer === ans || (showFeedback && ans === detail.correctAnswer) ? 'text-slate-900' : 'text-slate-700'}`}>{ans}</span>
                      </div>
                      {(selectedAnswer === ans || (showFeedback && ans === detail.correctAnswer)) && (
                        <span className={`material-symbols-outlined filled ${ans === detail.correctAnswer ? 'text-green-500' : 'text-red-400'}`}>
                          {ans === detail.correctAnswer ? 'check_circle' : 'cancel'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {showFeedback && (
                <div className={`mt-10 p-6 rounded-2xl border flex items-start gap-4 animate-fade-in
                  ${selectedAnswer === detail.correctAnswer ? 'bg-green-100 border-green-200' : 'bg-red-50 border-red-100'}`}>
                  <span className={`material-symbols-outlined text-3xl filled ${selectedAnswer === detail.correctAnswer ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedAnswer === detail.correctAnswer ? 'sentiment_very_satisfied' : 'sentiment_dissatisfied'}
                  </span>
                  <div>
                    <p className={`font-black text-lg ${selectedAnswer === detail.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                      {selectedAnswer === detail.correctAnswer ? 'Chính xác!' : 'Tiếc quá!'}
                    </p>
                    <p className={`${selectedAnswer === detail.correctAnswer ? 'text-green-700' : 'text-red-700'} font-medium`}>
                      {selectedAnswer === detail.correctAnswer ? detail.feedbackText : `Đáp án đúng là "${detail.correctAnswer}". ${detail.feedbackText}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="hidden lg:flex flex-col gap-6 sticky top-24">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Tiến độ bài học</span>
                <span className="material-symbols-outlined text-slate-300">school</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-black text-primary">{lessonProgress}%</span>
                <span className="text-xl text-slate-300 font-bold">/ 100%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${lessonProgress}%` }} />
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {selectedAnswer ? 'Làm tốt lắm, hãy tiếp tục sang bài học tiếp theo!' : 'Bạn đang học về các thuật ngữ quan trọng trong IT. Hãy hoàn thành Quiz để tiếp tục.'}
              </p>
            </div>
            
            <div className="bg-orange-50/80 backdrop-blur-md rounded-3xl p-6 border border-orange-100">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-orange-400 text-3xl">lightbulb</span>
                <div>
                  <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1">Mẹo IT</p>
                  <p className="text-sm text-orange-900/70 font-medium leading-relaxed">{detail.tip}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 z-50 shadow-lg">
        <div className="max-w-[1100px] mx-auto flex justify-between items-center px-4">
          <button onClick={onBack} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-[20px]">undo</span>
            Quay lại
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className={`size-2.5 rounded-full ${showFeedback ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`text-xs font-black uppercase tracking-widest ${showFeedback ? 'text-green-600' : 'text-slate-400'}`}>
              {showFeedback ? 'Đã trả lời' : 'Đang chờ trả lời'}
            </span>
          </div>
          <button 
            onClick={showFeedback ? onComplete : handleCheck}
            disabled={!selectedAnswer}
            className={`font-black py-3.5 px-10 rounded-2xl shadow-xl flex items-center gap-2 transition-all active:scale-95
            ${selectedAnswer ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/20' : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'}`}>
            {showFeedback ? 'Tiếp tục' : 'Kiểm tra'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LessonDetail;
