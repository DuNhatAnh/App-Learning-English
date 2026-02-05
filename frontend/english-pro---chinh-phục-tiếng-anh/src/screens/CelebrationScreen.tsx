
import React from 'react';

interface CelebrationScreenProps {
  onBackToRoadmap: () => void;
  onNextLesson: () => void;
}

const CelebrationScreen: React.FC<CelebrationScreenProps> = ({ onBackToRoadmap, onNextLesson }) => {
  return (
    <div className="min-h-screen bg-[#E6F2FF] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[15%] text-yellow-400 opacity-60 animate-bounce text-5xl">✷</div>
        <div className="absolute top-[20%] right-[18%] text-primary/40 text-3xl animate-pulse">●</div>
        <div className="absolute bottom-[25%] left-[10%] text-red-400 opacity-50 text-4xl">▲</div>
        <div className="absolute bottom-[30%] right-[12%] text-green-400 opacity-50 text-2xl">■</div>
      </div>

      <div className="max-w-[480px] w-full z-10 animate-fade-in">
        <div className="text-[100px] mb-6 animate-bounce">🎉</div>
        
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Bạn đã hoàn thành Bài 3!</h2>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            Tuyệt vời! Bạn đã tiến thêm một bước vững chắc trên hành trình chinh phục tiếng Anh.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-white p-1 overflow-hidden mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            <div className="flex flex-col items-center justify-center p-8 transition-colors hover:bg-slate-50">
              <div className="bg-orange-50 p-3 rounded-2xl mb-3">
                <span className="material-symbols-outlined text-orange-500 text-[32px] filled">timer</span>
              </div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Thời gian học</span>
              <span className="text-slate-900 text-3xl font-black">4:30</span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 transition-colors hover:bg-slate-50">
              <div className="bg-green-50 p-3 rounded-2xl mb-3">
                <span className="material-symbols-outlined text-green-500 text-[32px] filled">target</span>
              </div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Độ chính xác</span>
              <span className="text-slate-900 text-3xl font-black">90%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onNextLesson}
            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4.5 px-8 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-3">
            Tiếp tục bài tiếp theo
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button 
            onClick={onBackToRoadmap}
            className="w-full bg-transparent border-2 border-primary text-primary hover:bg-primary/5 font-black py-3.5 px-8 rounded-2xl transition-all active:scale-95 text-lg flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">map</span>
            Quay về lộ trình
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationScreen;
