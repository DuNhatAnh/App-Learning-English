
import React, { useState } from 'react';

interface FillBlanksScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const FillBlanksScreen: React.FC<FillBlanksScreenProps> = ({ onComplete, onBack }) => {
  const [filledWords, setFilledWords] = useState<(string | null)[]>([null, null]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const wordBank = ['reservation', 'table', 'menu', 'waiter'];
  const correctWords = ['reservation', 'table'];

  const handleWordClick = (word: string) => {
    const nextEmpty = filledWords.indexOf(null);
    if (nextEmpty !== -1) {
      const newFilled = [...filledWords];
      newFilled[nextEmpty] = word;
      setFilledWords(newFilled);
      setShowFeedback(false);
      setShowNotification(null);
    }
  };

  const removeWord = (index: number) => {
    if (showFeedback && filledWords[0] === correctWords[0] && filledWords[1] === correctWords[1]) return;
    const newFilled = [...filledWords];
    newFilled[index] = null;
    setFilledWords(newFilled);
    setShowFeedback(false);
    setShowNotification(null);
  };

  const checkResult = () => {
    if (filledWords.includes(null)) return;
    
    setShowFeedback(true);
    const isCorrect = filledWords[0] === correctWords[0] && filledWords[1] === correctWords[1];
    
    if (isCorrect) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setShowNotification('Thứ tự từ chưa chính xác, hãy thử sắp xếp lại!');
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
        <div className="h-full bg-primary rounded-r-full transition-all duration-500" style={{ width: '80%' }} />
      </div>

      <header className="px-6 h-16 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-slate-500">arrow_back</span>
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Điền từ vào chỗ trống</span>
        <button className="p-2 rounded-full text-yellow-500 hover:bg-yellow-50 transition-colors">
          <span className="material-symbols-outlined filled">lightbulb</span>
        </button>
      </header>

      <main className="flex-1 p-6 max-w-[800px] mx-auto w-full flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 mb-12">
          <div className="text-xl md:text-2xl leading-[2.5] md:leading-[3] text-slate-800 font-medium text-center">
            "I have a 
            <span className={`inline-flex items-center justify-center min-w-[120px] h-10 mx-2 border-b-2 transition-all cursor-pointer rounded px-2
              ${filledWords[0] ? 'border-primary bg-blue-50/30' : 'border-slate-300 bg-slate-50'}
              ${showFeedback && filledWords[0] === correctWords[0] ? 'border-green-500 text-green-600 bg-green-50' : ''}
              ${showFeedback && filledWords[0] !== correctWords[0] ? 'border-red-400 text-red-500 bg-red-50' : ''}`}
              onClick={() => removeWord(0)}>
              {filledWords[0] || ''}
            </span>
            for two people under the name Smith. Could we have a 
            <span className={`inline-flex items-center justify-center min-w-[120px] h-10 mx-2 border-b-2 transition-all cursor-pointer rounded px-2
              ${filledWords[1] ? 'border-primary bg-blue-50/30' : 'border-slate-300 bg-slate-50'}
              ${showFeedback && filledWords[1] === correctWords[1] ? 'border-green-500 text-green-600 bg-green-50' : ''}
              ${showFeedback && filledWords[1] !== correctWords[1] ? 'border-red-400 text-red-500 bg-red-50' : ''}`}
              onClick={() => removeWord(1)}>
              {filledWords[1] || ''}
            </span> near the window, please?"
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Gợi ý từ vựng</p>
          <div className="flex flex-wrap justify-center gap-3">
            {wordBank.map((word) => {
              const isUsed = filledWords.includes(word);
              return (
                <button
                  key={word}
                  disabled={isUsed}
                  onClick={() => handleWordClick(word)}
                  className={`px-6 py-3 rounded-xl border-2 font-bold transition-all transform active:scale-95
                    ${isUsed ? 'bg-slate-100 border-slate-100 text-slate-300' : 'bg-white border-slate-200 text-slate-700 hover:border-primary hover:text-primary shadow-sm'}`}>
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-slate-100 flex justify-center">
        <button 
          onClick={checkResult}
          disabled={filledWords.includes(null) || (showFeedback && filledWords[0] === correctWords[0] && filledWords[1] === correctWords[1])}
          className={`w-full max-w-[400px] py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg
            ${!filledWords.includes(null) && !showFeedback ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-100 text-slate-400'}`}>
          Kiểm tra
        </button>
      </footer>
    </div>
  );
};

export default FillBlanksScreen;
