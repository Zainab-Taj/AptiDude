import { motion } from 'framer-motion';
import { Subject } from '@/types';
import { soundEffects } from '@/services/soundEffectsService';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  onClick: () => void;
}

export const SubjectCard = ({ subject, progress, onClick }: SubjectCardProps) => {
  return (
    <motion.button
      onClick={() => {
        soundEffects.playClickSound();
        onClick();
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-card rounded-2xl p-5 shadow-lg border border-border hover:shadow-card-hover transition-all duration-300 text-left"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md"
          style={{ backgroundColor: `${subject.color}20` }}
        >
          {subject.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg truncate">{subject.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {subject.description}
          </p>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span style={{ color: subject.color }}>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: subject.color }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Units preview */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {subject.units.slice(0, 4).map((unit, idx) => (
          <span
            key={unit.id}
            className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{
              backgroundColor: `${unit.color}15`,
              color: unit.color,
            }}
          >
            {unit.title}
          </span>
        ))}
        {subject.units.length > 4 && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground whitespace-nowrap">
            +{subject.units.length - 4} more
          </span>
        )}
      </div>
    </motion.button>
  );
};
