import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { StatsBar } from '@/components/StatsBar';
import { SubjectCard } from '@/components/SubjectCard';
import { subjects } from '@/data/subjects';
import { UserStats } from '@/types';
import { storageService } from '@/services/storageService';
import { soundEffects } from '@/services/soundEffectsService';
import { Sparkles, Shuffle } from 'lucide-react';
import welcomeGif from '@/assets/welcome.gif';

interface DashboardProps {
  stats: UserStats;
  onSelectSubject: (subjectId: string) => void;
  onStartDailyMix: () => void;
}

export const Dashboard = ({ stats, onSelectSubject, onStartDailyMix }: DashboardProps) => {
  const allProgress = storageService.getAllProgress();
  
  const getSubjectProgress = (subjectId: string): number => {
    const progress = allProgress.find(p => p.subjectId === subjectId);
    if (!progress) return 0;
    
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return 0;
    
    const totalLevels = subject.units.reduce((acc, unit) => acc + unit.levels.length, 0);
    return (progress.completedLevels.length / totalLevels) * 100;
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMascotMessage = () => {
    if (stats.streak === 0) return "Hi I'm Dude! Your Learning Partner. Let's start a streak today! 🔥";
    if (stats.streak >= 7) return `Hi I'm Dude! Your Learning Partner. Amazing! ${stats.streak} days in a row! 🌟`;
    if (stats.hearts < 3) return "Hi I'm Dude! Your Learning Partner. Low on hearts! Take it easy 💪";
    return "Ready to learn something new? 📚";
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">
              {greeting()}! 👋
            </h1>
            <p className="text-muted-foreground font-semibold">
              What will you learn today?
            </p>
          </div>
          <StatsBar stats={stats} compact />
        </div>
      </motion.header>

      {/* Mascot Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-6 flex items-center gap-4">
          <Mascot mood="happy" size="lg" image={welcomeGif} />
          <div className="flex-1">
            <p className="font-bold text-foreground text-lg mb-2">
              {getMascotMessage()}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Keep learning to earn XP and level up!</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Daily Mix */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <motion.button
          onClick={() => {
            soundEffects.playClickSound();
            onStartDailyMix();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl p-5 shadow-lg flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <Shuffle className="w-7 h-7" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-lg">Daily Mix</h3>
            <p className="text-sm opacity-90">Practice questions from all topics</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">+50</span>
            <p className="text-xs opacity-90">XP</p>
          </div>
        </motion.button>
      </motion.section>

      {/* Subjects */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-foreground">Subjects</h2>
          <span className="text-sm text-muted-foreground font-semibold">
            {subjects.length} available
          </span>
        </div>
        <div className="grid gap-4">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <SubjectCard
                subject={subject}
                progress={getSubjectProgress(subject.id)}
                onClick={() => onSelectSubject(subject.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
