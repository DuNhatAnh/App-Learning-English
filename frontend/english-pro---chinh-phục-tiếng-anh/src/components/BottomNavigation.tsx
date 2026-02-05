
import React from 'react';
import { AppTab } from '../types';

interface BottomNavigationProps {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: AppTab.LEARN, label: 'Lộ trình', icon: 'map' },
        { id: AppTab.PRACTICE, label: 'Luyện tập', icon: 'exercise' },
        { id: AppTab.CHALLENGES, label: 'Thử thách', icon: 'trophy' },
        { id: AppTab.PROFILE, label: 'Cá nhân', icon: 'person' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 px-6 py-2 pb-8 md:pb-2 flex justify-around items-center z-50">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <span className={`material-symbols-outlined ${activeTab === tab.id ? 'filled' : ''}`}>
                        {tab.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNavigation;
