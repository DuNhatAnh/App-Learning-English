
import React, { useState } from 'react';

interface Question {
  id: number;
  question: string;
  context: string;
  options: { label: string; text: string; subtext?: string }[];
  correct: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Bạn nên nói gì khi muốn thu hút sự chú ý của ai đó một cách lịch sự?",
    context: "\"________, do you happen to know where the nearest post office is?\"",
    options: [
      { label: 'A', text: 'Hey you!', subtext: 'Ê bạn!' },
      { label: 'B', text: 'Excuse me', subtext: 'Xin lỗi cho hỏi' },
      { label: 'C', text: 'Attention', subtext: 'Chú ý đây' },
      { label: 'D', text: 'Stop here', subtext: 'Dừng lại' }
    ],
    correct: 'B'
  },
  {
    id: 2,
    question: "Chọn câu trả lời phù hợp cho: \"Thank you so much for your help!\"",
    context: "Reply to gratitude",
    options: [
      { label: 'A', text: 'No problem', subtext: 'Không có gì' },
      { label: 'B', text: 'I am okay', subtext: 'Tôi ổn' },
      { label: 'C', text: 'Yes, help', subtext: 'Vâng, giúp' },
      { label: 'D', text: 'Who are you?', subtext: 'Bạn là ai?' }
    ],
    correct: 'A'
  },
  {
    id: 3,
    question: "Trong nhà hàng, 'Would you like to see the menu?' có nghĩa là gì?",
    context: "Server talking to customer",
    options: [
      { label: 'A', text: 'Bạn muốn ăn gì không?' },
      { label: 'B', text: 'Bạn muốn xem thực đơn không?' },
      { label: 'C', text: 'Bạn muốn trả tiền không?' },
      { label: 'D', text: 'Bạn muốn về chưa?' }
    ],
    correct: 'B'
  }
];

interface VocabularyQuizScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const VocabularyQuizScreen: React.FC<VocabularyQuizScreenProps> = ({ onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (label: string) => {
    if (feedback === 'correct') return;
    setSelectedOption(label);
    setFeedback(null);
    setShowNotification(null);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    
    const isCorrect = selectedOption === currentQuestion.correct;
    
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        if (currentIndex < QUESTIONS.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setShowNotification('Chưa đúng rồi! Hãy thử suy nghĩ lại nhé.');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col animate-fade-in relative overflow-hidden">
      {showNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-black border-2 border-rose-400">
            <span className="material-symbols-outlined filled">error</span>
            {showNotification}
          </div>
        </div>
      )}

      <div className="w-full h-1.5 bg-slate-200">
        <div className="h-full bg-primary rounded-r-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <header className="px-6 h-16 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-slate-500">close</span>
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Trắc nghiệm giao tiếp - {currentIndex + 1}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-primary">{currentIndex + 1}</span>
          <span className="text-sm font-bold text-slate-300">/ {QUESTIONS.length}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-[800px] mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 w-full mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-500 mb-4 text-center">
            {currentQuestion.question}
          </h2>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
             <p className="text-xl md:text-2xl font-black text-slate-900 leading-relaxed italic">
                {currentQuestion.context}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 group
                ${selectedOption === opt.label ? 'border-primary bg-blue-50 shadow-md ring-4 ring-primary/5' : 'border-white bg-white hover:border-slate-100 shadow-sm'}
                ${feedback === 'correct' && opt.label === currentQuestion.correct ? 'border-green-500 bg-green-50 !ring-green-500/10' : ''}
                ${feedback === 'wrong' && selectedOption === opt.label && opt.label !== currentQuestion.correct ? 'border-red-400 bg-red-50 !ring-red-400/10' : ''}`}>
              <span className={`text-sm font-black w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
                ${selectedOption === opt.label ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                {opt.label}
              </span>
              <div className="flex-1 overflow-hidden">
                <p className={`text-lg font-black truncate ${selectedOption === opt.label ? 'text-primary' : 'text-slate-700'}`}>{opt.text}</p>
                {opt.subtext && <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">{opt.subtext}</p>}
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-slate-100 flex justify-center">
        <button 
          onClick={handleCheck}
          disabled={!selectedOption || feedback === 'correct'}
          className={`w-full max-w-[400px] py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg
            ${selectedOption && feedback !== 'correct' ? 'bg-primary text-white shadow-primary/20 shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
          Kiểm tra đáp án
        </button>
      </footer>
    </div>
  );
};

export default VocabularyQuizScreen;
