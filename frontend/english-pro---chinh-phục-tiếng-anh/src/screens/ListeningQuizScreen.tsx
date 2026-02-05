
import React, { useState, useEffect } from 'react';

interface ListeningQuizScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const ListeningQuizScreen: React.FC<ListeningQuizScreenProps> = ({ onComplete, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [listenCount, setListenCount] = useState(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const options = [
    { id: 'A', text: 'I would like to order a large latte with oat milk, please.' },
    { id: 'B', text: 'Could you tell me how much this blue shirt costs?' },
    { id: 'C', text: 'I missed the bus this morning, so I had to take a taxi.' },
    { id: 'D', text: 'Nice to meet you! My name is Alex and I am from Canada.' }
  ];

  const handleSelect = (id: string) => {
    if (feedback === 'correct') return;
    setSelectedOption(id);
    setFeedback(null);
    setShowNotification(null);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === 'A'; // Giả định câu A là đúng cho ví dụ này
    
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        onComplete();
      }, 800);
    } else {
      setFeedback('wrong');
      setShowNotification('Chưa chính xác. Hãy nghe kỹ lại lời thoại nhé!');
    }
  };

  const playAudio = () => {
    if (listenCount >= 3) return;
    setListenCount(prev => prev + 1);
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
        <div className="h-full bg-primary rounded-r-full transition-all duration-500" style={{ width: '40%' }} />
      </div>

      <header className="px-6 h-16 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-slate-500">close</span>
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Thử thách Nghe hiểu</span>
        <div className="size-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-bold">1</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-[800px] mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Lắng nghe và chọn đúng nội dung</h2>
          <p className="text-slate-500 font-medium">Chủ đề: Tại quán Cà phê.</p>
        </div>

        <div className="mb-16 relative">
          <button 
            onClick={playAudio}
            disabled={listenCount >= 3}
            className={`size-32 rounded-full flex items-center justify-center transition-all transform active:scale-90 shadow-xl
              ${listenCount >= 3 ? 'bg-slate-100 text-slate-300' : 'bg-primary text-white hover:scale-105'}`}>
            <span className="material-symbols-outlined text-[64px] filled">volume_up</span>
          </button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`size-2 rounded-full ${i <= listenCount ? 'bg-primary' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all flex items-start gap-4 group
                ${selectedOption === opt.id ? 'border-primary bg-blue-50 shadow-md ring-4 ring-primary/5' : 'border-white bg-white hover:border-slate-100 shadow-sm'}
                ${feedback === 'correct' && opt.id === 'A' ? 'border-green-500 bg-green-50 !ring-green-500/10' : ''}
                ${feedback === 'wrong' && selectedOption === opt.id && opt.id !== 'A' ? 'border-red-400 bg-red-50 !ring-red-400/10' : ''}`}>
              <span className={`text-sm font-black w-6 h-6 rounded flex items-center justify-center transition-colors
                ${selectedOption === opt.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                {opt.id}
              </span>
              <p className={`font-bold flex-1 ${selectedOption === opt.id ? 'text-primary' : 'text-slate-700'}`}>{opt.text}</p>
            </button>
          ))}
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-slate-100 flex justify-center">
        <button 
          onClick={handleCheck}
          disabled={!selectedOption || feedback === 'correct'}
          className={`w-full max-w-[400px] py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg
            ${selectedOption && feedback !== 'correct' ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-100 text-slate-400'}`}>
          Kiểm tra
        </button>
      </footer>
    </div>
  );
};

export default ListeningQuizScreen;
