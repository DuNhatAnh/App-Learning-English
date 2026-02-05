
import React from 'react';

interface HeaderSectionProps {
    title: string;
    subtitle?: string;
    icon?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, subtitle, icon }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3">
                {icon && <span className="text-4xl">{icon}</span>}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h1>
            </div>
            {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
    );
};

export default HeaderSection;
