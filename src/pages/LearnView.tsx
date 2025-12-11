import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { LevelCircle } from '@/components/LevelCircle';
import ComingSoon from '@/components/ComingSoon';
import { Subject, Unit, Level, Progress } from '@/types';
import { storageService } from '@/services/storageService';

interface LearnViewProps {
  subject: Subject;
  onBack: () => void;
  onStartLevel: (unitId: string, levelId: string) => void;
}

export const LearnView = ({ subject, onBack, onStartLevel }: LearnViewProps) => {
  const [expandedUnits, setExpandedUnits] = useState<string[]>([subject.units[0]?.id || '']);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => { 
    const savedProgress = storageService.getProgress(subject.id);
    setProgress(savedProgress);
  }, [subject.id]);

  const getLevelStatus = (level: Level): 'locked' | 'current' | 'completed' => {
    // Level 1 of any unit is always unlocked
    if (level.order === 1) {
      return progress?.completedLevels.includes(level.id) ? 'completed' : 'current';
    }

    if (!progress) {
      // First level is current, rest are locked
      const allLevels = subject.units.flatMap(u => u.levels);
      const levelIndex = allLevels.findIndex(l => l.id === level.id);
      return levelIndex === 0 ? 'current' : 'locked';
    }

    if (progress.completedLevels.includes(level.id)) {
      return 'completed';
    }

    // Find the first incomplete level
    const allLevels = subject.units.flatMap(u => u.levels);
    const firstIncompleteLevelIndex = allLevels.findIndex(
      l => !progress.completedLevels.includes(l.id)
    );
    const currentLevelIndex = allLevels.findIndex(l => l.id === level.id);

    if (currentLevelIndex === firstIncompleteLevelIndex) {
      return 'current';
    }

    return currentLevelIndex < firstIncompleteLevelIndex ? 'completed' : 'locked';
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const renderPath = (levels: Level[], unitColor: string) => {
    const positions: { x: number; y: number }[] = [];
    const width = 280;
    const levelSpacing = 100;
    const amplitude = 80;

    levels.forEach((_, index) => {
      const x = width / 2 + Math.sin(index * 0.8) * amplitude;
      const y = index * levelSpacing + 50;
      positions.push({ x, y });
    });

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={levels.length * levelSpacing + 50}
      >
        {/* Background path */}
        <path
          d={positions.reduce((path, pos, i) => {
            if (i === 0) return `M ${pos.x} ${pos.y}`;
            const prev = positions[i - 1];
            const cpY = (prev.y + pos.y) / 2;
            return `${path} Q ${prev.x} ${cpY} ${pos.x} ${pos.y}`;
          }, '')}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Completed path (golden) */}
        {progress && progress.completedLevels.length > 0 && (
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            d={positions.slice(0, progress.completedLevels.filter(id => 
              levels.some(l => l.id === id)
            ).length + 1).reduce((path, pos, i) => {
              if (i === 0) return `M ${pos.x} ${pos.y}`;
              const prev = positions[i - 1];
              const cpY = (prev.y + pos.y) / 2;
              return `${path} Q ${prev.x} ${cpY} ${pos.x} ${pos.y}`;
            }, '')}
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{subject.icon}</span>
            <div>
              <h1 className="font-bold text-lg text-foreground">{subject.name}</h1>
              <p className="text-sm text-muted-foreground">
                {subject.units.length} units • {subject.units.reduce((acc, u) => acc + u.levels.length, 0)} levels
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Units */}
      <div className="px-4 py-6 space-y-6">
        {subject.units.map((unit, unitIndex) => {
          const isExpanded = expandedUnits.includes(unit.id);
          const completedInUnit = progress?.completedLevels.filter(id =>
            unit.levels.some(l => l.id === id)
          ).length || 0;

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.1 }}
              className="rounded-3xl overflow-hidden border border-border shadow-lg"
              style={{ backgroundColor: `${unit.color}08` }}
            >
              {/* Unit Header */}
              <motion.button
                onClick={() => toggleUnit(unit.id)}
                className="w-full p-5 flex items-center gap-4 text-left"
                style={{ backgroundColor: `${unit.color}15` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-primary-foreground"
                  style={{ backgroundColor: unit.color }}
                >
                  {unitIndex + 1}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-foreground">{unit.title}</h2>
                  <p className="text-sm text-muted-foreground">{unit.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedInUnit / unit.levels.length) * 100}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: unit.color }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {completedInUnit}/{unit.levels.length}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-6 h-6 text-muted-foreground" />
                </motion.div>
              </motion.button>

              {/* Levels Path */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative bg-card"
                >
                  <div
                    className="relative mx-auto"
                    style={{
                      width: 280,
                      height: unit.levels.length * 100 + 50,
                    }}
                  >
                    {renderPath(unit.levels, unit.color)}
                    
                    {unit.levels.map((level, levelIndex) => {
                      const amplitude = 80;
                      const x = 280 / 2 + Math.sin(levelIndex * 0.8) * amplitude - 40;
                      const y = levelIndex * 100 + 10;

                      return (
                        <motion.div
                          key={level.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: levelIndex * 0.05 }}
                          className="absolute"
                          style={{ left: x, top: y }}
                        >
                          <LevelCircle
                            level={{ ...level, status: getLevelStatus(level) }}
                            onClick={() => onStartLevel(unit.id, level.id)}
                          />
                        </motion.div>
                      );
                    })}
                    {/* Coming Soon Message after level 10 */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: unit.levels.length * 0.05 }}
                      className="absolute"
                      style={{
                        left: 280 / 2 + Math.sin(unit.levels.length * 0.8) * 80 - 40,
                        top: unit.levels.length * 100 + 10
                      }}
                    >
                      <ComingSoon />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
