import { motion } from 'framer-motion';
import pawImage from '@/assets/paw.png';
import { Level } from '@/types';
import { Star, Lock } from 'lucide-react';
import { soundEffects } from '@/services/soundEffectsService';

interface LevelCircleProps {
  level: Level;
  onClick: () => void;
  isActive?: boolean;
}

const statusStyles = {
  locked: 'opacity-50 grayscale cursor-not-allowed',
  current: 'cursor-pointer hover:scale-110 animate-pulse-glow',
  completed: 'cursor-pointer hover:scale-105',
};

const LevelCircle = ({ level, onClick, isActive = false }: LevelCircleProps) => {
  const isCompleted = level.status === 'completed';
  const isLocked = level.status === 'locked';
  const isCurrent = level.status === 'current';

  return (
    <motion.button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!isLocked ? { scale: 1.1 } : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : undefined}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${statusStyles[level.status]} ${isActive ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : ''}`}
    >
      {/* Paw icon container */}
      <div className={`relative w-16 h-16 ${isLocked ? 'grayscale opacity-60' : ''}`}>
        <img
          src={pawImage}
          alt={`Level ${level.order}`}
          className={`w-full h-full object-contain ${isCompleted ? 'drop-shadow-lg' : ''} ${isCurrent ? 'animate-bounce-slow' : ''}`}
          style={{
            filter: isLocked ? 'grayscale(100%) brightness(0.7)' : isCompleted ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' : '',
          }}
        />
        
        {/* Lock icon for locked levels */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
        )}



        {/* Star for completed levels */}
        {isCompleted && level.stars > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gold rounded-full p-1 shadow-lg"
          >
            <Star className="w-4 h-4 text-secondary-foreground fill-current" />
          </motion.div>
        )}

        {/* Current level indicator */}
        {isCurrent && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          >
            <div className="w-3 h-3 bg-primary rounded-full shadow-lg" />
          </motion.div>
        )}
      </div>

      {/* Level number */}
      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-sm font-bold ${isLocked ? 'text-muted-foreground' : isCurrent ? 'text-primary' : 'text-foreground'}`}>
        {level.order}
      </span>
    </motion.button>
  );
};

export { LevelCircle };
