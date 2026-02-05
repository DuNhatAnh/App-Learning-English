
import React from 'react';
import { LessonStatus } from '../types';
import { MOCK_LESSONS } from '../constants';

interface RoadmapScreenProps {
  onStartLesson: (id: number) => void;
}

const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ onStartLesson }) => {
  const activeLesson = MOCK_LESSONS.find(l => l.status === LessonStatus.ACTIVE) || MOCK_LESSONS[0];

  return (
    <div className="max-w-[640px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Lộ trình học tập</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Tiếp tục hành trình chinh phục tiếng Anh của bạn.</p>
      </div>

      <div className="relative">
        {MOCK_LESSONS.map((lesson, index) => {
          const isLast = index === MOCK_LESSONS.length - 1;
          const isFirst = index === 0;

          return (
            <div key={lesson.id} className="grid grid-cols-[48px_1fr] gap-x-4">
              <div className="flex flex-col items-center">
                {!isFirst && (
                   <div className={`w-0.5 h-4 ${lesson.status === LessonStatus.COMPLETED ? 'bg-green-200' : 'bg-slate-200'}`} />
                )}
                <div className={`size-8 rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm
                  ${lesson.status === LessonStatus.COMPLETED ? 'bg-green-100 text-green-600' : 
                    lesson.status === LessonStatus.ACTIVE ? 'bg-primary text-white scale-110 shadow-lg ring-4 ring-[#E6F2FF]' : 
                    'bg-slate-200 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[18px] font-bold">
                    {lesson.status === LessonStatus.COMPLETED ? 'check' : lesson.status === LessonStatus.ACTIVE ? 'play_arrow' : 'lock'}
                  </span>
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 my-1 ${lesson.status === LessonStatus.COMPLETED || MOCK_LESSONS[index+1].status === LessonStatus.COMPLETED ? 'bg-green-200' : 'bg-slate-200'}`} />
                )}
              </div>

              <div className="pb-8">
                <div 
                  onClick={lesson.status !== LessonStatus.LOCKED ? () => onStartLesson(lesson.id) : undefined}
                  className={`bg-white p-5 rounded-xl shadow-sm border transition-all cursor-pointer group
                  ${lesson.status === LessonStatus.ACTIVE ? 'border-primary/30 shadow-md ring-1 ring-primary/5' : 'border-slate-100 hover:shadow-md'}
                  ${lesson.status === LessonStatus.LOCKED ? 'opacity-70 grayscale cursor-not-allowed' : ''}`}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      lesson.status === LessonStatus.COMPLETED ? 'bg-green-50 text-green-600' :
                      lesson.status === LessonStatus.ACTIVE ? 'bg-blue-50 text-primary' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {lesson.status === LessonStatus.COMPLETED ? 'Đã hoàn thành' :
                       lesson.status === LessonStatus.ACTIVE ? 'Đang học' : 'Chưa mở'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {lesson.duration} phút
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold text-slate-900 group-hover:text-primary transition-colors ${lesson.status === LessonStatus.ACTIVE ? 'text-xl' : ''}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{lesson.description}</p>
                  
                  {lesson.status === LessonStatus.ACTIVE && lesson.progress && (
                    <div className="mt-4">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${lesson.progress}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 text-right font-bold">{lesson.progress}% hoàn thành</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-6 flex justify-center mt-4">
        <button 
          onClick={() => onStartLesson(activeLesson.id)}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-xl shadow-xl shadow-primary/30 flex items-center gap-3 transform hover:scale-105 transition-all active:scale-95">
          Tiếp tục học
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default RoadmapScreen;
