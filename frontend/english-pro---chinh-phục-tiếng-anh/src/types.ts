
export enum AppTab {
  LEARN = 'Học',
  PRACTICE = 'Luyện tập',
  CHALLENGES = 'Thử thách',
  PROFILE = 'Hồ sơ'
}

export enum LessonStatus {
  COMPLETED = 'completed',
  ACTIVE = 'active',
  LOCKED = 'locked'
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number;
  status: LessonStatus;
  progress?: number;
}

export interface Vocabulary {
  word: string;
  phonetic: string;
  meaning: string;
}

export interface LessonContent {
  id: number;
  sectionTitle: string;
  vocab: Vocabulary[];
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: string;
  feedbackText: string;
  tip: string;
}

export interface UserStats {
  lessonsCount: number;
  streakDays: number;
  totalHours: number;
  completedChallenges: number;
}

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  type: 'success' | 'primary' | 'warning' | 'neutral';
}
