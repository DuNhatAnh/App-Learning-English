
export enum AppTab {
  LEARN = 'Học',
  PRACTICE = 'Luyện tập',
  CHALLENGES = 'Thử thách',
  PROFILE = 'Hồ sơ'
}

export enum LessonStatus {
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED'
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  duration?: number;
  status: LessonStatus;
  progress?: number;
}

export interface Vocabulary {
  id?: string;
  word: string;
  meaning: string;
  phonetic?: string;
  examples: string[];
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  tip?: string;
}

export interface LessonContent {
  id: string;
  title: string;
  vocab: Vocabulary[];
  quizzes: QuizQuestion[];
  tips?: string;
  progress?: {
    percentage: number;
    status: LessonStatus;
  } | null;
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
