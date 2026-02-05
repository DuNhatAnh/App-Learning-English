import React, { useEffect, useState } from 'react';
import { Lesson, LessonStatus } from '../types';
import { fetchRoadmap, resetProgress } from '../api';

interface RoadmapScreenProps {
  onStartLesson: (id: string) => void;
}

const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ onStartLesson }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoadmap = async () => {
    try {
      const data = await fetchRoadmap();
      setLessons(data);
    } catch (error) {
      console.error('Lỗi khi tải lộ trình:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleReset = async (e: React.MouseEvent, lessonId: string, title: string) => {
    e.stopPropagation(); // Ngăn chặn việc click vào thẻ lesson
    const confirmed = window.confirm(`Bạn có chắc muốn học lại từ đầu chủ đề "${title}" không? Toàn bộ tiến trình của chủ đề này sẽ bị reset về 0%.`);
    if (confirmed) {
      try {
        await resetProgress(lessonId);
        await loadRoadmap(); // Tải lại dữ liệu mới
      } catch (error) {
        alert('Lỗi khi reset tiến độ. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeLesson = lessons.find(l => l.status === LessonStatus.ACTIVE) || lessons.find(l => l.progress && l.progress < 100) || lessons[0];

  return (
    <div className="max-w-[640px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Lộ trình học tập</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Nội dung được cập nhật từ hệ thống.</p>
      </div>

      <div className="relative">
        {lessons.map((lesson, index) => {
          const isLast = index === lessons.length - 1;
          const isFirst = index === 0;
          const isCompleted = lesson.status === LessonStatus.COMPLETED;
          const hasProgress = lesson.progress && lesson.progress > 0;

          return (
            <div key={lesson.id} className="grid grid-cols-[48px_1fr] gap-x-4">
              <div className="flex flex-col items-center">
                {!isFirst && (
                  <div className={`w-0.5 h-4 ${isCompleted ? 'bg-green-200' : 'bg-slate-200'}`} />
                )}
                <div className={`size-8 rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm
                  ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-primary text-white scale-110 shadow-lg ring-4 ring-[#E6F2FF]'}`}>
                  <span className="material-symbols-outlined text-[18px] font-bold">
                    {isCompleted ? 'check' : 'play_arrow'}
                  </span>
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 my-1 ${isCompleted || (lessons[index + 1] && lessons[index + 1].status === LessonStatus.COMPLETED) ? 'bg-green-200' : 'bg-slate-200'}`} />
                )}
              </div>

              <div className="pb-8">
                <div
                  onClick={() => onStartLesson(lesson.id)}
                  className={`bg-white p-5 rounded-xl shadow-sm border transition-all cursor-pointer group relative
                  ${lesson.status === LessonStatus.ACTIVE ? 'border-primary/30 shadow-md ring-1 ring-primary/5' : 'border-slate-100 hover:shadow-md'}`}>

                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${isCompleted ? 'bg-green-50 text-green-600' :
                        hasProgress ? 'bg-blue-50 text-primary' : 'bg-slate-50 text-slate-500'
                        }`}>
                        {isCompleted ? 'Đã hoàn thành' : hasProgress ? 'Đang học' : 'Bắt đầu học'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {hasProgress && (
                        <button
                          onClick={(e) => handleReset(e, lesson.id, lesson.title)}
                          title="Học lại từ đầu"
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                          <span className="text-[10px] font-black uppercase">Làm lại</span>
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> {lesson.duration || 10} phút
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold text-slate-900 group-hover:text-primary transition-colors ${lesson.status === LessonStatus.ACTIVE ? 'text-xl' : ''}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{lesson.description || 'Khám phá kiến thức mới ngay hôm nay.'}</p>

                  {(hasProgress && !isCompleted) && (
                    <div className="mt-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-50">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${lesson.progress || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1.5">
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest animate-pulse">Đang diễn ra</p>
                        <p className="text-[10px] text-slate-400 font-bold">{lesson.progress || 0}% hoàn thành</p>
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Tuyệt vời! Đã hoàn thành</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-6 flex justify-center mt-4 pointer-events-none">
        <button
          onClick={() => onStartLesson(activeLesson.id)}
          className="bg-primary hover:bg-primary-dark text-white font-black py-4 px-12 rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-3 transform hover:scale-105 transition-all active:scale-95 group pointer-events-auto">
          Tiếp tục học
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default RoadmapScreen;
