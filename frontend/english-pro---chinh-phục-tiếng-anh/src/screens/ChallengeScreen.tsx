
import React, { useEffect, useState } from 'react';
import HeaderSection from '../components/HeaderSection';
import ProgressBar from '../components/ProgressBar';
import TaskList from '../components/TaskList';
import { fetchChallengeHistory } from '../api';

interface ChallengeScreenProps {
  onStartTask: (taskType: 'listening' | 'fill_blanks' | 'quiz') => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onStartTask }) => {
  const [history, setHistory] = useState<any[]>([]);
  const dailyTasks = [
    { id: 'quiz', label: 'Trắc nghiệm từ vựng', desc: '10 câu hỏi ngẫu nhiên từ ngân hàng 150 từ', completed: false, isCurrent: true },
    { id: 'listening', label: 'Nghe - chọn đáp án', desc: 'Luyện nghe hội thoại ngắn', completed: false, isAvailable: true },
    { id: 'fill_blanks', label: 'Điền từ', desc: 'Hoàn thành câu với từ gợi ý', completed: false, isAvailable: true },
  ];

  const loadHistory = async () => {
    try {
      const data = await fetchChallengeHistory();
      setHistory(data);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <HeaderSection
        title="Hãy chọn thử thách bạn muốn thực hiện"
        subtitle="Vượt qua giới hạn của chính mình mỗi ngày."
        icon="⚡"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-md">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Thử thách 7 ngày từ vựng</h3>
                <span className="text-xs text-primary font-black bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-wider">Đang thực hiện</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900">Ngày 3 <span className="text-slate-300 text-xl">/ 7</span></p>
              </div>
            </div>

            <ProgressBar label="Tiến độ thử thách" progress={42} />

            <TaskList
              title="Nhiệm vụ hôm nay:"
              tasks={dailyTasks}
              onStartTask={(taskId) => {
                if (taskId === 'quiz') onStartTask('quiz');
                if (taskId === 'listening') onStartTask('listening');
                if (taskId === 'fill_blanks') onStartTask('fill_blanks');
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
            <h4 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Tiến độ gần đây
            </h4>

            <div className="space-y-4">
              {history.length > 0 ? history.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group hover:border-primary/30 transition-all">
                  <div>
                    <p className="text-sm font-black text-slate-700">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                    {item.score}/{item.total}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-slate-200 text-5xl mb-2">leaderboard</span>
                  <p className="text-sm text-slate-400 font-bold">Chưa có lịch sử làm bài</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeScreen;
