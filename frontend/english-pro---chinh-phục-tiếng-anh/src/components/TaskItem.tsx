
import React from 'react';

interface TaskItemProps {
    label: string;
    desc: string;
    completed?: boolean;
    isCurrent?: boolean;
    isAvailable?: boolean;
    onClick?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
    label,
    desc,
    completed,
    isCurrent,
    isAvailable,
    onClick
}) => {
    const canInteract = !completed && (isCurrent || isAvailable);

    return (
        <div
            onClick={canInteract ? onClick : undefined}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group
      ${completed ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100 cursor-pointer hover:bg-slate-50'}
      ${isCurrent ? 'ring-2 ring-primary/20 border-primary shadow-sm' : ''}`}>

            <div className={`size-6 rounded-lg flex items-center justify-center border-2 transition-colors
        ${completed ? 'bg-primary border-primary' : 'border-slate-200 bg-white group-hover:border-primary/50'}`}>
                {completed && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
            </div>

            <div className="flex-1">
                <span className={`text-lg font-extrabold transition-colors ${completed ? 'text-slate-500' : 'text-slate-900 group-hover:text-primary'}`}>
                    {label}
                </span>
                <p className="text-sm text-slate-400 font-medium">{desc}</p>
            </div>

            {canInteract && (
                <span className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                    Bắt đầu <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </span>
            )}
        </div>
    );
};

export default TaskItem;
