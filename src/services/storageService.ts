import { User, UserStats, Progress, Subject, TargetExam } from '@/types';

const STORAGE_KEYS = {
  USER: 'aptidude_user',
  STATS: 'aptidude_stats',
  PROGRESS: 'aptidude_progress',
  TARGET_EXAM: 'aptidude_target_exam',
  LAST_LESSON_DATE: 'aptidude_last_lesson',
};

const defaultStats: UserStats = {
  xp: 0,
  streak: 0,
  gems: 50,
  hearts: 5,
  maxHearts: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const storageService = {
  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  },

  // Stats
  getStats: (): UserStats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!data) return { ...defaultStats };
    
    const stats = JSON.parse(data) as UserStats;
    const today = new Date().toISOString().split('T')[0];
    const lastActive = stats.lastActiveDate;
    
    // Check streak
    const lastDate = new Date(lastActive);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      stats.streak = 0;
    }
    
    // Refill hearts daily
    if (diffDays >= 1) {
      stats.hearts = stats.maxHearts;
    }
    
    return stats;
  },

  setStats: (stats: UserStats): void => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  updateStats: (updates: Partial<UserStats>): UserStats => {
    const current = storageService.getStats();
    const updated = { ...current, ...updates };
    storageService.setStats(updated);
    return updated;
  },

  addXP: (amount: number): UserStats => {
    const stats = storageService.getStats();
    stats.xp += amount;
    stats.lastActiveDate = new Date().toISOString().split('T')[0];
    storageService.setStats(stats);
    return stats;
  },

  loseHeart: (): UserStats => {
    const stats = storageService.getStats();
    stats.hearts = Math.max(0, stats.hearts - 1);
    storageService.setStats(stats);
    return stats;
  },

  incrementStreak: (): UserStats => {
    const stats = storageService.getStats();
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastActiveDate !== today) {
      stats.streak += 1;
      stats.lastActiveDate = today;
      storageService.setStats(stats);
    }
    
    return stats;
  },

  // Progress
  getProgress: (subjectId: string): Progress | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!data) return null;
    const allProgress = JSON.parse(data) as Progress[];
    return allProgress.find(p => p.subjectId === subjectId) || null;
  },

  getAllProgress: (): Progress[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  },

  setProgress: (progress: Progress): void => {
    const allProgress = storageService.getAllProgress();
    const index = allProgress.findIndex(p => p.subjectId === progress.subjectId);
    
    if (index >= 0) {
      allProgress[index] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
  },

  completeLevel: (subjectId: string, levelId: string): void => {
    let progress = storageService.getProgress(subjectId);
    
    if (!progress) {
      progress = {
        subjectId,
        currentUnitIndex: 0,
        currentLevelIndex: 0,
        masteryLevel: 0,
        completedLevels: [],
      };
    }
    
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
      progress.masteryLevel = Math.min(100, progress.masteryLevel + 5);
    }
    
    storageService.setProgress(progress);
  },

  // Target Exam
  getTargetExam: (): TargetExam => {
    return (localStorage.getItem(STORAGE_KEYS.TARGET_EXAM) as TargetExam) || 'GENERAL';
  },

  setTargetExam: (exam: TargetExam): void => {
    localStorage.setItem(STORAGE_KEYS.TARGET_EXAM, exam);
  },

  // Gems
  addGems: (amount: number): UserStats => {
    const stats = storageService.getStats();
    stats.gems += amount;
    storageService.setStats(stats);
    return stats;
  },

  removeGems: (amount: number): UserStats => {
    const stats = storageService.getStats();
    stats.gems = Math.max(0, stats.gems - amount);
    storageService.setStats(stats);
    return stats;
  },

  // Hearts restoration
  restoreHeart: (gemsPerHeart: number = 5): UserStats => {
    const stats = storageService.getStats();
    if (stats.gems >= gemsPerHeart && stats.hearts < stats.maxHearts) {
      stats.gems -= gemsPerHeart;
      stats.hearts += 1;
      storageService.setStats(stats);
    }
    return stats;
  },

  restoreAllHearts: (gemsPerHeart: number = 5): UserStats => {
    const stats = storageService.getStats();
    const heartsNeeded = stats.maxHearts - stats.hearts;
    const gemsCost = heartsNeeded * gemsPerHeart;
    
    if (stats.gems >= gemsCost) {
      stats.gems -= gemsCost;
      stats.hearts = stats.maxHearts;
      storageService.setStats(stats);
    }
    return stats;
  },
};

