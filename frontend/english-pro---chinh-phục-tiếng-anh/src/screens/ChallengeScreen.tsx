
import React from 'react';
import HeaderSection from '../components/HeaderSection';
import ProgressBar from '../components/ProgressBar';
import TaskList from '../components/TaskList';

interface ChallengeScreenProps {
  onStartTask: (taskType: 'listening' | 'fill_blanks' | 'quiz') => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onStartTask }) => {
  const dailyTasks = [
    { id: 'quiz', label: 'Trắc nghiệm từ vựng', desc: 'Ôn tập 20 từ vựng chủ đề giáo dục', completed: false, isCurrent: true },
    { id: 'listening', label: 'Nghe - chọn đáp án', desc: 'Luyện nghe hội thoại ngắn', completed: false, isAvailable: true },
    { id: 'fill_blanks', label: 'Điền từ', desc: 'Hoàn thành câu với từ gợi ý', completed: false, isAvailable: true },
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <HeaderSection
        title="Thử thách hiện tại"
        subtitle="Tập trung hoàn thành mục tiêu của bạn hôm nay."
        icon="🏆"
      />

      <div className="space-y-6">
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
    </div>
  );
};

export default ChallengeScreen;
