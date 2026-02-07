
import React from 'react';
import ProgressBar from '../components/ProgressBar';
import PrimaryButton from '../components/PrimaryButton';

interface ChallengeSummaryScreenProps {
  onBackToChallenges: () => void;
  score: number;
  total: number;
}

const ChallengeSummaryScreen: React.FC<ChallengeSummaryScreenProps> = ({ onBackToChallenges, score, total }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      {/* Confetti-like bits */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: ['#4A90E2', '#fbbf24', '#34d399', '#f87171'][Math.floor(Math.random() * 4)],
              opacity: 0.3
            }}
          />
        ))}
      </div>

      <div className="max-w-[500px] w-full text-center z-10">
        <div className="mb-6 inline-block">
          <div className="size-32 rounded-full bg-yellow-50 flex items-center justify-center text-[72px] shadow-inner border-4 border-white animate-bounce">
            🏆
          </div>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-2">Thử thách hoàn tất!</h1>
        <p className="text-slate-500 font-medium mb-10">Bạn đã hoàn thành nhiệm vụ ngày 3 của chuỗi 7 ngày.</p>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Đúng', value: `${score}/${total}`, icon: 'check_circle', color: 'text-green-500' },
            { label: 'Thời gian', value: '2:15', icon: 'schedule', color: 'text-blue-500' },
            { label: 'XP', value: `+${score * 5}`, icon: 'bolt', color: 'text-yellow-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-1 border border-slate-100">
              <span className={`material-symbols-outlined ${stat.color} filled text-[24px]`}>{stat.icon}</span>
              <span className="text-2xl font-black text-slate-900">{stat.value}</span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        <ProgressBar
          label="Tiến độ ngày 3"
          progress={100}
        />

        <PrimaryButton
          label="Quay về trang thử thách"
          onClick={onBackToChallenges}
          fullWidth
          className="py-5 text-lg"
        />
      </div>
    </div>
  );
};

export default ChallengeSummaryScreen;
