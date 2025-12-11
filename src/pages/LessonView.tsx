import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Zap, Home, ArrowRight } from 'lucide-react';
import { Mascot, getRandomPhrase } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { Question, LessonResult, MascotMood, UserStats } from '@/types';
import { geminiService } from '@/services/geminiService';
import { storageService } from '@/services/storageService';

interface LessonViewProps {
  subjectId: string;
  unitId: string;
  levelId: string;
  isDailyMix?: boolean;
  stats: UserStats;
  onComplete: (result: LessonResult) => void;
  onExit: () => void;
}

export const LessonView = ({
  subjectId,
  unitId,
  levelId,
  isDailyMix = false,
  stats,
  onComplete,
  onExit,
}: LessonViewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(stats.hearts);
  const [xpEarned, setXpEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [mascotMessage, setMascotMessage] = useState<string>('');

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const qs = isDailyMix
          ? await geminiService.getDailyMixQuestions(10)
          : await geminiService.generateQuestions(subjectId, 5);
        setQuestions(qs);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, [subjectId, isDailyMix]);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    setShowResult(true);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setXpEarned(prev => prev + 10);
      setMascotMood('celebrating');
      setMascotMessage(getRandomPhrase('happy'));
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      storageService.loseHeart();
      setMascotMood('sad');
      setMascotMessage(getRandomPhrase('sad'));
    }
  };

  const handleNext = () => {
    if (hearts === 0) {
      finishLesson();
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setMascotMood('thinking');
      setMascotMessage('');
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    const result: LessonResult = {
      correct: correctCount,
      total: questions.length,
      xpEarned,
      streakMaintained: true,
      perfectScore: correctCount === questions.length,
    };

    // Save progress
    if (!isDailyMix && correctCount > 0) {
      storageService.completeLevel(subjectId, levelId);
    }
    storageService.addXP(xpEarned);
    storageService.incrementStreak();

    setMascotMood(result.perfectScore ? 'celebrating' : correctCount > questions.length / 2 ? 'happy' : 'sad');
    setMascotMessage(
      result.perfectScore
        ? "Absolutely meow-nificent! Perfect score! 🎉"
        : correctCount > questions.length / 2
        ? "Great job, you're pawsome! 🐾"
        : "Keep practicing, you've got this! 💪"
    );
    setLessonComplete(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Mascot mood="thinking" size="xl" message="Preparing your lesson... 🐾" />
        </motion.div>
      </div>
    );
  }

  if (lessonComplete) {
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <Mascot
            mood={correctCount === questions.length ? 'celebrating' : correctCount > questions.length / 2 ? 'happy' : 'sad'}
            size="xl"
            message={mascotMessage}
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-foreground mt-6 mb-2"
          >
            {correctCount === questions.length
              ? '🎉 Purrfect Score!'
              : correctCount > questions.length / 2
              ? '👏 Meowsome Job!'
              : '💪 Keep Practicing!'}
          </motion.h1>
          <p className="text-muted-foreground font-semibold mb-6">
            You got {correctCount} out of {questions.length} correct ({percentage}%)
          </p>

          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xp">
                  <Zap className="w-6 h-6" />
                  <span className="text-2xl font-black">+{xpEarned}</span>
                </div>
                <p className="text-sm text-muted-foreground font-semibold">XP Earned</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <span className="text-2xl font-black">{percentage}%</span>
                </div>
                <p className="text-sm text-muted-foreground font-semibold">Accuracy</p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={() => onComplete({
              correct: correctCount,
              total: questions.length,
              xpEarned,
              streakMaintained: true,
              perfectScore: correctCount === questions.length,
            })}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-primary text-primary-foreground shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Fixed to top, centered max-width content */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <motion.button
            onClick={onExit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </motion.button>

          <div className="flex-1">
            <ProgressBar
              current={currentIndex + 1}
              total={questions.length}
            />
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: stats.maxHearts }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < hearts ? 'text-hearts fill-hearts' : 'text-muted'}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content - Two-Column Layout for Desktop, Single Column for Mobile */}
      <main className="flex-1 overflow-y-auto px-4 py-8 pb-32">
        {/* Main Content Grid: 2/3 width for Question, 1/3 for Mascot on MD screens and up */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
          
          {/* Column 1 (Left Side on Desktop): Question Card */}
          <div className="md:order-1 order-2">
            <AnimatePresence mode="wait">
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                selectedIndex={selectedAnswer}
                showResult={showResult}
                onSelect={handleSelectAnswer}
              />
            </AnimatePresence>
          </div>

          {/* Column 2 (Right Side on Desktop): Mascot */}
          {/* Added sticky/self-start to keep mascot visible while scrolling questions */}
          <div className="md:order-2 order-1 flex justify-center md:justify-end sticky top-24 self-start">
            <motion.div
              key={`${mascotMood}-${currentIndex}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Mascot mood={mascotMood} size="md" message={showResult ? mascotMessage : undefined} />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Action Buttons - Fixed at bottom, centered max-width content */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-50">
        <div className="max-w-5xl mx-auto">
          {!showResult ? (
            <motion.button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              whileHover={selectedAnswer !== null ? { scale: 1.02 } : undefined}
              whileTap={selectedAnswer !== null ? { scale: 0.98 } : undefined}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                selectedAnswer !== null
                  ? 'bg-primary text-primary-foreground shadow-level'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Check Answer
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                onClick={onExit}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-2xl font-bold text-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Dashboard
              </motion.button>
              <motion.button
                onClick={handleNext}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  'Finish Lesson'
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};