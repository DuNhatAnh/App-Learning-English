
import React from 'react';
import TaskItem from './TaskItem';

interface Task {
    id: string;
    label: string;
    desc: string;
    completed?: boolean;
    isCurrent?: boolean;
    isAvailable?: boolean;
}

interface TaskListProps {
    tasks: Task[];
    onStartTask: (taskId: string) => void;
    title?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStartTask, title }) => {
    return (
        <div className="space-y-4">
            {title && <h4 className="font-black text-lg text-slate-800 mb-2">{title}</h4>}
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    label={task.label}
                    desc={task.desc}
                    completed={task.completed}
                    isCurrent={task.isCurrent}
                    isAvailable={task.isAvailable}
                    onClick={() => onStartTask(task.id)}
                />
            ))}
        </div>
    );
};

export default TaskList;
