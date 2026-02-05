
import React from 'react';

interface ProgressBarProps {
    progress: number;
    label?: string;
    showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, showPercentage = true }) => {
    return (
        <div className="mb-8">
            {(label || showPercentage) && (
                <div className="flex justify-between text-[11px] mb-2.5 font-black text-slate-500 uppercase tracking-widest">
                    <span>{label}</span>
                    {showPercentage && <span className="text-primary">{progress}%</span>}
                </div>
            )}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
