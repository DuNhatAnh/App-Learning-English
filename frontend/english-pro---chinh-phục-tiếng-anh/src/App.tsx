
import React, { useState } from 'react';
import { AppTab } from './types';
import BottomNavigation from './components/BottomNavigation';
import RoadmapScreen from './screens/RoadmapScreen';
import PracticeScreen from './screens/PracticeScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonDetail from './screens/LessonDetail';
import CelebrationScreen from './screens/CelebrationScreen';
import ListeningQuizScreen from './screens/ListeningQuizScreen';
import FillBlanksScreen from './screens/FillBlanksScreen';
import VocabularyQuizScreen from './screens/VocabularyQuizScreen';
import ChallengeSummaryScreen from './screens/ChallengeSummaryScreen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LEARN);
  const [currentView, setCurrentView] = useState<'main' | 'lesson' | 'celebration' | 'listening_quiz' | 'fill_blanks' | 'vocabulary_quiz' | 'challenge_summary'>('main');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(3);

  const handleStartLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case AppTab.LEARN:
        return <RoadmapScreen onStartLesson={handleStartLesson} />;
      case AppTab.PRACTICE:
        return <PracticeScreen />;
      case AppTab.CHALLENGES:
        return (
          <ChallengeScreen
            onStartTask={(taskType) => {
              if (taskType === 'listening') setCurrentView('listening_quiz');
              if (taskType === 'fill_blanks') setCurrentView('fill_blanks');
              if (taskType === 'quiz') setCurrentView('vocabulary_quiz');
            }}
          />
        );
      case AppTab.PROFILE:
        return <ProfileScreen />;
      default:
        return <RoadmapScreen onStartLesson={handleStartLesson} />;
    }
  };

  if (currentView === 'lesson') {
    return <LessonDetail lessonId={selectedLessonId} onBack={() => setCurrentView('main')} onComplete={() => setCurrentView('celebration')} />;
  }

  if (currentView === 'listening_quiz') {
    return <ListeningQuizScreen onComplete={() => setCurrentView('challenge_summary')} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'fill_blanks') {
    return <FillBlanksScreen onComplete={() => setCurrentView('challenge_summary')} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'vocabulary_quiz') {
    return <VocabularyQuizScreen onComplete={() => setCurrentView('challenge_summary')} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'challenge_summary') {
    return <ChallengeSummaryScreen onBackToChallenges={() => {
      setActiveTab(AppTab.CHALLENGES);
      setCurrentView('main');
    }} />;
  }

  if (currentView === 'celebration') {
    return <CelebrationScreen onBackToRoadmap={() => setCurrentView('main')} onNextLesson={() => {
      if (selectedLessonId < 5) {
        setSelectedLessonId(selectedLessonId + 1);
        setCurrentView('lesson');
      } else {
        setCurrentView('main');
      }
    }} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <main className="flex-1">
        {renderActiveScreen()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setCurrentView('main');
      }} />
    </div>
  );
};

export default App;
