import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Target, ChevronRight } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { StatsBar } from '@/components/StatsBar';
import { User, UserStats, TargetExam } from '@/types';
import { storageService } from '@/services/storageService';
import { soundEffects } from '@/services/soundEffectsService';
import { useTheme } from '@/context/ThemeContext';

interface ProfileViewProps {
  user: User;
  stats: UserStats;
  onLogout: () => void;
}

const examOptions: { value: TargetExam; label: string; description: string }[] = [
  { value: 'CAT', label: 'CAT', description: 'Common Admission Test' },
  { value: 'GRE', label: 'GRE', description: 'Graduate Record Examination' },
  { value: 'GMAT', label: 'GMAT', description: 'Graduate Management Admission Test' },
  { value: 'BANK', label: 'Bank Exams', description: 'Banking sector examinations' },
  { value: 'SSC', label: 'SSC', description: 'Staff Selection Commission' },
  { value: 'GATE', label: 'GATE', description: 'Graduate Aptitude Test in Engineering' },
  { value: 'GENERAL', label: 'General', description: 'General aptitude practice' },
];

export const ProfileView = ({ user, stats, onLogout }: ProfileViewProps) => {
  const { isDark, toggleDarkMode } = useTheme();
  const [targetExam, setTargetExam] = useState<TargetExam>(storageService.getTargetExam());
  const [showExamPicker, setShowExamPicker] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notifications-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('sound-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [offlineMode, setOfflineMode] = useState(() => {
    const saved = localStorage.getItem('offline-mode');
    return saved !== null ? saved === 'true' : false;
  });
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const saved = localStorage.getItem('daily-goal');
    return saved ? parseInt(saved, 10) : 10;
  });

  const handleExamChange = (exam: TargetExam) => {
    setTargetExam(exam);
    storageService.setTargetExam(exam);
    setShowExamPicker(false);
  };

  // Persist notifications setting
  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notifications-enabled', newValue.toString());
  };

  // Persist sound setting
  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('sound-enabled', newValue.toString());
    soundEffects.setSoundEnabled(newValue);
    // Play a click sound when toggling sound effects
    if (newValue) {
      soundEffects.playClickSound();
    }
  };

  // Persist offline mode setting
  const handleOfflineModeToggle = () => {
    const newValue = !offlineMode;
    setOfflineMode(newValue);
    localStorage.setItem('offline-mode', newValue.toString());
  };

  // Persist daily goal setting
  const handleDailyGoalChange = (newGoal: number) => {
    setDailyGoal(newGoal);
    localStorage.setItem('daily-goal', newGoal.toString());
  };

  const allProgress = storageService.getAllProgress();
  const totalCompletedLevels = allProgress.reduce(
    (acc, p) => acc + p.completedLevels.length,
    0
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Profile Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-4 mb-6">
            <Mascot mood="happy" size="lg" />
            <div className="flex-1">
              <h1 className="text-2xl font-black text-foreground">{user.username}</h1>
              <p className="text-muted-foreground font-semibold">{user.email}</p>
            </div>
          </div>

          <StatsBar stats={stats} />

          {/* Achievement Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-2xl font-black text-foreground">{totalCompletedLevels}</p>
              <p className="text-xs text-muted-foreground font-semibold">Levels Done</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-2xl font-black text-foreground">{stats.streak}</p>
              <p className="text-xs text-muted-foreground font-semibold">Day Streak</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-2xl font-black text-foreground">{stats.xp}</p>
              <p className="text-xs text-muted-foreground font-semibold">Total XP</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h2 className="text-xl font-black text-foreground mb-4">Settings</h2>

        {/* Target Exam */}
        <motion.button
          onClick={() => {
            soundEffects.playTouchSound();
            setShowExamPicker(!showExamPicker);
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-foreground">Target Exam</p>
            <p className="text-sm text-muted-foreground">
              {examOptions.find(e => e.value === targetExam)?.label || 'General'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        {/* Exam Picker */}
        {showExamPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            {examOptions.map((exam) => (
              <button
                key={exam.value}
                onClick={() => handleExamChange(exam.value)}
                className={`w-full p-4 flex items-center justify-between hover:bg-muted transition-colors ${
                  targetExam === exam.value ? 'bg-primary/10' : ''
                }`}
              >
                <div className="text-left">
                  <p className={`font-bold ${targetExam === exam.value ? 'text-primary' : 'text-foreground'}`}>
                    {exam.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{exam.description}</p>
                </div>
                {targetExam === exam.value && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {/* Other Settings */}
        <motion.button
          onClick={() => {
            soundEffects.playTouchSound();
            setShowAppSettings(!showAppSettings);
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-foreground">App Settings</p>
            <p className="text-sm text-muted-foreground">Notifications, sound, and more</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        {/* App Settings Panel */}
        {showAppSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden p-4 space-y-4"
          >
            {/* Notifications Setting */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Daily reminders & updates</p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playTouchSound();
                  handleNotificationsToggle();
                }}
                className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                  notificationsEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: notificationsEnabled ? 20 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>

            {/* Sound Setting */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Sound Effects</p>
                <p className="text-sm text-muted-foreground">Feedback during lessons</p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playTouchSound();
                  handleSoundToggle();
                }}
                className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                  soundEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: soundEnabled ? 20 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>

            {/* Dark Mode Setting */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Easy on the eyes at night</p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playTouchSound();
                  toggleDarkMode();
                }}
                className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                  isDark ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: isDark ? 20 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>

            {/* Offline Mode Setting */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Offline Mode</p>
                <p className="text-sm text-muted-foreground">Practice without internet</p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playTouchSound();
                  handleOfflineModeToggle();
                }}
                className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                  offlineMode ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: offlineMode ? 20 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>

            {/* Daily Goal Setting */}
            <div className="border-t border-border pt-4">
              <div className="mb-3">
                <p className="font-bold text-foreground">Daily XP Goal</p>
                <p className="text-sm text-muted-foreground">Target: {dailyGoal} XP per day</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEffects.playTouchSound();
                    handleDailyGoalChange(Math.max(5, dailyGoal - 5));
                  }}
                  className="flex-1 px-3 py-2 bg-muted rounded-lg font-semibold text-sm hover:bg-muted/80 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 px-3 py-2 bg-primary/10 rounded-lg text-center font-bold text-primary">
                  {dailyGoal}
                </div>
                <button
                  onClick={() => {
                    soundEffects.playTouchSound();
                    handleDailyGoalChange(Math.min(100, dailyGoal + 5));
                  }}
                  className="flex-1 px-3 py-2 bg-muted rounded-lg font-semibold text-sm hover:bg-muted/80 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Clear Data */}
            <div className="border-t border-border pt-4">
              <button
                onClick={() => {
                  soundEffects.playTouchSound();
                  if (confirm('Are you sure? This will clear all your progress data.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-semibold text-sm hover:bg-destructive/20 transition-colors"
              >
                Clear All Data
              </button>
            </div>

            {/* Version Info */}
            <div className="pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                AptiDude v1.0.0 • Made with ❤️ for learners
              </p>
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <motion.button
          onClick={() => {
            soundEffects.playTouchSound();
            onLogout();
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
            <LogOut className="w-6 h-6 text-destructive" />
          </div>
          <p className="font-bold text-destructive">Log Out</p>
        </motion.button>
      </motion.section>
    </div>
  );
};
