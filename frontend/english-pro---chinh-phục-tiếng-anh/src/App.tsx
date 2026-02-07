
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import BottomNavigation from './components/BottomNavigation';
import RoadmapScreen from './screens/RoadmapScreen';
import PracticeScreen from './screens/PracticeScreen';
import AIFlashcardScreen from './screens/AIFlashcardScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonDetail from './screens/LessonDetail';
import CelebrationScreen from './screens/CelebrationScreen';
import ListeningQuizScreen from './screens/ListeningQuizScreen';
import FillBlanksScreen from './screens/FillBlanksScreen';
import VocabularyQuizScreen from './screens/VocabularyQuizScreen';
import ChallengeSummaryScreen from './screens/ChallengeSummaryScreen';
import { fetchRandomQuiz, saveChallengeResult } from './api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LEARN);
  const [currentView, setCurrentView] = useState<'main' | 'lesson' | 'celebration' | 'listening_quiz' | 'fill_blanks' | 'vocabulary_quiz' | 'challenge_summary'>('main');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [challengeQuestions, setChallengeQuestions] = useState<any[]>([]);
  const [lastChallengeResult, setLastChallengeResult] = useState<{ score: number, total: number } | null>(null);

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson');
  };

  const handleStartChallenge = async () => {
    try {
      const questions = await fetchRandomQuiz();
      setChallengeQuestions(questions);
      setCurrentView('vocabulary_quiz');
    } catch (error) {
      alert('Không thể tải câu hỏi thử thách. Vui lòng thử lại sau.');
    }
  };

  const handleChallengeComplete = async (score: number, total: number) => {
    try {
      await saveChallengeResult('Trắc nghiệm từ vựng', score, total);
      setLastChallengeResult({ score, total });
      setCurrentView('challenge_summary');
    } catch (error) {
      console.error('Lỗi khi lưu kết quả:', error);
      setLastChallengeResult({ score, total });
      setCurrentView('challenge_summary');
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case AppTab.LEARN:
        return <RoadmapScreen onStartLesson={handleStartLesson} />;
      case AppTab.PRACTICE:
        return <AIFlashcardScreen />;
      case AppTab.CHALLENGES:
        return (
          <ChallengeScreen
            onStartTask={(taskType) => {
              if (taskType === 'listening') setCurrentView('listening_quiz');
              if (taskType === 'fill_blanks') setCurrentView('fill_blanks');
              if (taskType === 'quiz') handleStartChallenge();
            }}
          />
        );
      case AppTab.PROFILE:
        return <ProfileScreen />;
      default:
        return <RoadmapScreen onStartLesson={handleStartLesson} />;
    }
  };

  if (currentView === 'lesson' && selectedLessonId) {
    return <LessonDetail lessonId={selectedLessonId} onBack={() => setCurrentView('main')} onComplete={() => setCurrentView('celebration')} />;
  }

  if (currentView === 'listening_quiz') {
    return <ListeningQuizScreen onComplete={() => setCurrentView('challenge_summary')} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'fill_blanks') {
    return <FillBlanksScreen onComplete={() => setCurrentView('challenge_summary')} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'vocabulary_quiz') {
    return <VocabularyQuizScreen
      questions={challengeQuestions}
      onComplete={handleChallengeComplete}
      onBack={() => setCurrentView('main')}
    />;
  }

  if (currentView === 'challenge_summary') {
    return <ChallengeSummaryScreen
      score={lastChallengeResult?.score || 0}
      total={lastChallengeResult?.total || 10}
      onBackToChallenges={() => {
        setActiveTab(AppTab.CHALLENGES);
        setCurrentView('main');
      }}
    />;
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
