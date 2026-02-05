import React, { useState, useEffect } from 'react';
import { LessonContent, LessonStatus } from '../types';
import { fetchLessonDetail, updateProgress } from '../api';

interface LessonDetailProps {
  lessonId: string;
  onBack: () => void;
  onComplete: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lessonId, onBack, onComplete }) => {
  const [detail, setDetail] = useState<LessonContent | null>(null);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [step, setStep] = useState<'STUDY' | 'QUIZ' | 'FINISHED'>('STUDY');
  const [quizInChunkIndex, setQuizInChunkIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  const CHUNK_SIZE = 3;

  // Text-to-Speech function
  const speakWord = (text: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Dừng nếu đang đọc
    window.speechSynthesis.speak(utterance);
  };

  // Reset state when lesson changes
  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchLessonDetail(lessonId);
        console.log('[DEBUG] Dữ liệu bài học:', data);
        setDetail(data);

        // Khởi tạo vị trí học dựa trên tiến độ đã lưu
        if (data.progress) {
          const savedPercentage = data.progress.percentage;
          const totalVocab = data.vocab.length;
          const totalChunks = Math.ceil(totalVocab / CHUNK_SIZE);

          const chunkProgress = 100 / totalChunks;
          const initialChunk = Math.min(Math.floor(savedPercentage / chunkProgress), totalChunks - 1);

          console.log(`[DEBUG] Lưu tiến độ: ${savedPercentage}%, Tổng nhóm: ${totalChunks}, Chênh lệch mỗi nhóm: ${chunkProgress}, Nhóm bắt đầu (index): ${initialChunk}`);

          setCurrentChunk(initialChunk);
          if (savedPercentage === 100) {
            setStep('FINISHED');
          } else {
            setStep('STUDY');
          }
        } else {
          console.log('[DEBUG] Chưa có tiến độ, bắt đầu từ nhóm 1');
          setCurrentChunk(0);
          setStep('STUDY');
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài học:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
    setQuizInChunkIndex(0);
    setCorrectCount(0);
  }, [lessonId]);

  if (loading || !detail) {
    return <div className="p-10 text-center font-bold">Đang tải bài học...</div>;
  }

  const chunksCount = Math.ceil(detail.vocab.length / CHUNK_SIZE);
  const currentVocabChunk = detail.vocab.slice(currentChunk * CHUNK_SIZE, (currentChunk + 1) * CHUNK_SIZE);
  const currentQuizzesChunk = detail.quizzes.slice(currentChunk * CHUNK_SIZE, (currentChunk + 1) * CHUNK_SIZE);

  const currentQuiz = currentQuizzesChunk[quizInChunkIndex];

  const totalSteps = chunksCount * 2; // Study + Quiz per chunk
  const currentStepProgress = (currentChunk * 2 + (step === 'STUDY' ? 0.5 : 1)) / totalSteps * 100;

  const handleCheck = () => {
    if (!selectedAnswer || !currentQuiz) return;

    setShowFeedback(true);
    if (selectedAnswer === currentQuiz.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (step === 'STUDY') {
      setStep('QUIZ');
      setQuizInChunkIndex(0);
      setCorrectCount(0);
    } else {
      // Logic for QUIZ step
      if (quizInChunkIndex < currentQuizzesChunk.length - 1) {
        setQuizInChunkIndex(prev => prev + 1);
      } else {
        // End of quiz chunk
        if (correctCount === currentQuizzesChunk.length) {
          // All correct! Move to next chunk or finish
          if (currentChunk < chunksCount - 1) {
            setCurrentChunk(prev => prev + 1);
            setStep('STUDY');
            const newProgress = Math.round(((currentChunk + 1) / chunksCount) * 100);
            await updateProgress(lessonId, newProgress, false);
          } else {
            setStep('FINISHED');
            await updateProgress(lessonId, 100, true);
            onComplete();
          }
        } else {
          // Not all correct, restart chunk
          alert(`Bạn mới trả lời đúng ${correctCount}/${currentQuizzesChunk.length} câu. Hãy ôn lại nhóm này và thử lại nhé!`);
          setStep('STUDY');
          setQuizInChunkIndex(0);
          setCorrectCount(0);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E6F2FF] flex flex-col pb-24 animate-fade-in">
      <div className="fixed top-0 left-0 w-full z-[60]">
        <div className="w-full h-2 bg-slate-200">
          <div className="h-full bg-primary rounded-r-full transition-all duration-1000" style={{ width: `${currentStepProgress}%` }} />
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 h-16 shadow-sm mt-2">
        <div className="max-w-[1000px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1" />
            <div>
              <h1 className="text-slate-900 text-lg font-black tracking-tight truncate">{detail.title}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Nhóm {currentChunk + 1} / {chunksCount} • {step === 'STUDY' ? 'Học từ mới' : 'Kiểm tra'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm">
            <span className="material-symbols-outlined text-[20px] filled">stars</span>
            <span className="text-sm font-black">CP: 120</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center w-full px-4 py-8">
        <div className="w-full max-w-[800px]">
          {step === 'STUDY' ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-800">3 từ vựng tiếp theo</h2>
                <p className="text-slate-500 font-medium">Nhấn vào từng từ để xem ví dụ chi tiết.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentVocabChunk.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setExpandedWord(expandedWord === item.word ? null : item.word)}
                    className={`bg-white rounded-3xl border-2 transition-all p-6 cursor-pointer group
                    ${expandedWord === item.word ? 'border-primary shadow-xl ring-4 ring-primary/5' : 'border-slate-100 hover:border-primary/20 shadow-sm'}`}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={(e) => speakWord(item.word, e)}
                          className="size-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center hover:scale-110 transition-transform shadow-inner hover:bg-blue-100">
                          <span className="material-symbols-outlined text-3xl">volume_up</span>
                        </button>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">{item.word}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-400 font-serif italic">{item.phonetic}</p>
                            <span className="text-xs text-primary font-black uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-md">{item.meaning}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-slate-300 transition-transform ${expandedWord === item.word ? 'rotate-180 text-primary' : ''}`}>
                        expand_more
                      </span>
                    </div>

                    {expandedWord === item.word && (
                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-slide-down">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ví dụ sử dụng</p>
                        {item.examples.map((ex, idx) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3">
                            <span className="size-6 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0 shadow-sm">{idx + 1}</span>
                            <p className="text-slate-700 font-medium leading-relaxed">{ex}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 flex">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-500 ${i < quizInChunkIndex ? 'bg-green-500' : i === quizInChunkIndex ? 'bg-primary' : 'bg-slate-100'}`}
                  />
                ))}
              </div>

              <div className="mt-4 mb-10 flex justify-between items-center">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">Câu hỏi {quizInChunkIndex + 1}/3</span>
                <div className="flex gap-1">
                  {Array.from({ length: correctCount }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-green-500 filled text-[20px]">check_circle</span>
                  ))}
                </div>
              </div>

              {currentQuiz && (
                <div className="space-y-8 animate-fade-in" key={quizInChunkIndex}>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">
                    {currentQuiz.question}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {currentQuiz.options.map((ans) => (
                      <button
                        key={ans}
                        onClick={() => !showFeedback && setSelectedAnswer(ans)}
                        className={`p-6 rounded-3xl border-2 transition-all flex justify-between items-center text-left group
                          ${selectedAnswer === ans ? 'border-primary bg-blue-50 shadow-lg ring-4 ring-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}
                          ${showFeedback && ans === currentQuiz.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                          ${showFeedback && selectedAnswer === ans && ans !== currentQuiz.correctAnswer ? 'border-red-400 bg-red-50' : ''}`}>
                        <span className={`text-xl font-black ${selectedAnswer === ans || (showFeedback && ans === currentQuiz.correctAnswer) ? 'text-slate-900' : 'text-slate-700'} group-hover:translate-x-1 transition-transform`}>
                          {ans}
                        </span>
                        {showFeedback && (ans === currentQuiz.correctAnswer || selectedAnswer === ans) && (
                          <span className={`material-symbols-outlined filled text-2xl ${ans === currentQuiz.correctAnswer ? 'text-green-500' : 'text-red-400'}`}>
                            {ans === currentQuiz.correctAnswer ? 'check_circle' : 'cancel'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showFeedback && (
                <div className={`mt-10 p-6 rounded-3xl border-2 flex items-start gap-5 animate-slide-up
                  ${selectedAnswer === currentQuiz?.correctAnswer ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className={`size-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm
                    ${selectedAnswer === currentQuiz?.correctAnswer ? 'bg-white text-green-600' : 'bg-white text-red-500'}`}>
                    <span className="material-symbols-outlined text-3xl filled">
                      {selectedAnswer === currentQuiz?.correctAnswer ? 'sentiment_very_satisfied' : 'sentiment_dissatisfied'}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-black text-xl mb-1 ${selectedAnswer === currentQuiz?.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                      {selectedAnswer === currentQuiz?.correctAnswer ? 'Tuyệt đỉnh!' : 'Cố gắng lên!'}
                    </h4>
                    <p className={`font-medium ${selectedAnswer === currentQuiz?.correctAnswer ? 'text-green-700/80' : 'text-red-700/80'}`}>
                      {selectedAnswer === currentQuiz?.correctAnswer ? 'Câu trả lời hoàn toàn chính xác.' : `Đáp án đúng phải là "${currentQuiz?.correctAnswer}".`} {currentQuiz?.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-[800px] mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95">
            Quay lại sau
          </button>

          <button
            onClick={showFeedback || step === 'STUDY' ? handleNext : handleCheck}
            disabled={step === 'QUIZ' && !selectedAnswer && !showFeedback}
            className={`font-black py-4 px-14 rounded-2xl shadow-xl flex items-center gap-3 transition-all active:scale-95 transform
            ${(step === 'STUDY' || (step === 'QUIZ' && selectedAnswer)) ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'}`}>
            {step === 'STUDY' ? 'Tôi đã hiểu!' : showFeedback ? 'Tiếp tục' : 'Kiểm tra'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LessonDetail;
