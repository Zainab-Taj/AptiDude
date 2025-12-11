import { motion } from 'framer-motion';
import mascotImage from '@/assets/mascot.gif';
import { MascotMood } from '@/types';

interface MascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const moodAnimations = {
  happy: {
    y: [0, -8, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 1, repeat: Infinity, repeatDelay: 2 }
  },
  thinking: {
    rotate: [-3, 3, -3],
    transition: { duration: 2, repeat: Infinity }
  },
  sleeping: {
    y: [0, 2, 0],
    transition: { duration: 3, repeat: Infinity }
  },
  celebrating: {
    y: [0, -15, 0],
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.5, repeat: Infinity }
  },
  sad: {
    y: [0, 3, 0],
    rotate: [-2, 2, -2],
    transition: { duration: 3, repeat: Infinity }
  },
};

const happyPhrases = [
  "Pawlicious! 🐾",
  "Meowsome! 😺",
  "Pawsome! ✨",
  "Meow wow! 🎉",
  "You're meow-velous! 💫",
  "You're purrfect! 😻",
  "Meowgical",
  "Purrfectly happy",
  "Furrtastic",
  "Claw-some vibes",
  "Pawsitively cheerful",
  "Purrty amazing",
  "Meowvelous day",
  "Cat-titude queen",
  "Furever joyful",
  "Whisker-wonderful",
  "Paws and smile",
  "Purr-fect mood",
  "Fuzzy and fabulous",
  "Totally paw-some",
  "Whiskerlicious",

];

const sadPhrases = [
  "You've got this, you're purr-fectly capable! 💪",
  "Just a little bit of meow-gic to get you through! ✨",
  "Stay paws-itive, even when things get ruff! 🐾",
  "Meow-tivate yourself! You can do it! 💫",
  "Purr-suade yourself to try again! 😺",
  "Stay pawsitive 🐾",
  "Keep clawing your way up 🐱",
  "You’re purrfect just the way you are",
  "Chase your dreams, not the laser",
  "Believe in your inner meowgic",
  "Pounce on every opportunity",
  "Be fierce, be fluffy",
  "One paw at a time",
  "Turn your hiss into hustle",
  "You’ve got purr-tential!",
  "Stay curious like a kitten",
  "Rise, stretch, conquer",
  "Don’t stop till you’re meow-gical!",
  "Climb high, land light",
  "Shine with cat-titude 🌟",
];

export const getRandomPhrase = (mood: 'happy' | 'sad'): string => {
  const phrases = mood === 'happy' ? happyPhrases : sadPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export const Mascot = ({ mood = 'happy', size = 'md', message, className = '' }: MascotProps) => {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative bg-card rounded-2xl px-4 py-3 shadow-lg border border-border max-w-xs"
        >
          <p className="text-sm font-semibold text-foreground text-center">{message}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
        </motion.div>
      )}
      <motion.div
        animate={moodAnimations[mood]}
        className={`${sizeClasses[size]} relative`}
      >
        <img
          src={mascotImage}
          alt="Dude the cat mascot"
          className="w-full h-full object-contain drop-shadow-lg"
        />
        {mood === 'sleeping' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 text-2xl"
          >
            💤
          </motion.div>
        )}
        {mood === 'celebrating' && (
          <>
            <motion.div
              animate={{ y: [-20, -40], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="absolute -top-4 left-0 text-xl"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ y: [-20, -40], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              className="absolute -top-4 right-0 text-xl"
            >
              🎉
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute -bottom-2 -right-4 text-2xl"
            >
              👏
            </motion.div>
          </>
        )}
        {mood === 'happy' && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
            className="absolute -top-1 -right-1 text-lg"
          >
            ✨
          </motion.div>
        )}
        {mood === 'sad' && (
          <motion.div
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 right-0 text-lg"
          >
            💧
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};