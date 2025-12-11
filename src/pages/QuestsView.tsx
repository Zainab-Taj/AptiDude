import { motion } from 'framer-motion';
import { Scroll, Clock, Gift, Star, Zap } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressBar';
import welcomeGif from '@/assets/welcome.gif';

export const QuestsView = () => {
  const dailyQuests = [
    { id: 1, title: 'Complete 3 lessons', progress: 2, total: 3, xp: 30, icon: '📚' },
    { id: 2, title: 'Get 5 questions right in a row', progress: 3, total: 5, xp: 50, icon: '🎯' },
    { id: 3, title: 'Practice for 10 minutes', progress: 7, total: 10, xp: 20, icon: '⏱️' },
  ];

  const weeklyQuests = [
    { id: 4, title: 'Complete 20 lessons', progress: 8, total: 20, xp: 200, icon: '🏆' },
    { id: 5, title: 'Maintain a 7-day streak', progress: 4, total: 7, xp: 150, icon: '🔥' },
    { id: 6, title: 'Earn 500 XP', progress: 320, total: 500, xp: 100, icon: '⚡' },
  ];

  const renderQuest = (quest: typeof dailyQuests[0], index: number) => {
    const isComplete = quest.progress >= quest.total;
    
    return (
      <motion.div
        key={quest.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-card rounded-2xl p-4 border ${
          isComplete ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            isComplete ? 'bg-primary/20' : 'bg-muted'
          }`}>
            {isComplete ? '✅' : quest.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <p className={`font-bold ${isComplete ? 'text-primary' : 'text-foreground'}`}>
                {quest.title}
              </p>
              <div className="flex items-center gap-1 text-xp">
                <Zap className="w-4 h-4" />
                <span className="font-bold text-sm">+{quest.xp}</span>
              </div>
            </div>
            <ProgressBar
              current={quest.progress}
              total={quest.total}
              variant={isComplete ? 'xp' : 'default'}
            />
            <p className="text-xs text-muted-foreground mt-1 font-semibold">
              {quest.progress}/{quest.total} completed
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Scroll className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-black text-foreground">Quests</h1>
        </div>
        <p className="text-muted-foreground font-semibold">
          Complete quests to earn bonus XP and rewards!
        </p>
      </motion.header>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          <Mascot mood="celebrating" size="md" image={welcomeGif} />
          <div>
            <p className="font-bold text-foreground">🎮 Quests are coming!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete daily and weekly challenges to level up faster
            </p>
          </div>
        </div>
      </motion.div>

      {/* Daily Quests */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">Daily Quests</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
            Resets in 8h
          </span>
        </div>
        <div className="space-y-3">
          {dailyQuests.map((quest, index) => renderQuest(quest, index))}
        </div>
      </motion.section>

      {/* Weekly Quests */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-black text-foreground">Weekly Quests</h2>
          <span className="text-xs bg-gold/10 text-secondary-foreground px-2 py-1 rounded-full font-bold">
            Resets in 3d
          </span>
        </div>
        <div className="space-y-3">
          {weeklyQuests.map((quest, index) => renderQuest(quest, index + 3))}
        </div>
      </motion.section>
    </div>
  );
};
