export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  lastActiveDate: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  levels: Level[];
}

export interface Level {
  id: string;
  unitId: string;
  order: number;
  type: 'lesson' | 'practice' | 'test';
  status: 'locked' | 'current' | 'completed';
  stars: number;
  xpEarned: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Progress {
  subjectId: string;
  currentUnitIndex: number;
  currentLevelIndex: number;
  masteryLevel: number;
  completedLevels: string[];
}

export interface LessonResult {
  correct: number;
  total: number;
  xpEarned: number;
  streakMaintained: boolean;
  perfectScore: boolean;
}

export type MascotMood = 'happy' | 'thinking' | 'sleeping' | 'celebrating' | 'sad';

export type TargetExam = 'CAT' | 'GRE' | 'GMAT' | 'BANK' | 'SSC' | 'GATE' | 'GENERAL';

export interface MiniGameResult {
  gameType: 'sudoku' | 'zip' | 'queens';
  won: boolean;
  gemsEarned: number;
  timestamp: string;
}

export interface MiniGameStats {
  sudokuWins: number;
  zipWins: number;
  queensWins: number;
  totalGems: number;
}
