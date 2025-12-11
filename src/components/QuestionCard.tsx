import { motion } from 'framer-motion';
import { Question } from '@/types';
import { soundEffects } from '@/services/soundEffectsService';

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  showResult: boolean;
  onSelect: (index: number) => void;
}

export const QuestionCard = ({ 
  question, 
  selectedIndex, 
  showResult, 
  onSelect 
}: QuestionCardProps) => {
  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto pb-8"
    >
      {/* Question text */}
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-6">
        <p className="text-lg font-bold text-foreground leading-relaxed">
          {question.text}
        </p>
        {question.topic && (
          <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            {question.topic}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === question.correctIndex;
          
          let buttonStyles = 'bg-card border-2 border-border hover:border-primary hover:bg-primary/5';
          
          if (showResult) {
            if (isCorrectOption) {
              buttonStyles = 'bg-primary/10 border-2 border-primary text-primary';
            } else if (isSelected && !isCorrectOption) {
              buttonStyles = 'bg-destructive/10 border-2 border-destructive text-destructive';
            }
          } else if (isSelected) {
            buttonStyles = 'bg-primary/10 border-2 border-primary';
          }

          return (
            <motion.button
              key={index}
              onClick={() => {
                if (!showResult) {
                  soundEffects.playTouchSound();
                  onSelect(index);
                }
              }}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.02 } : undefined}
              whileTap={!showResult ? { scale: 0.98 } : undefined}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${buttonStyles} ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  showResult && isCorrectOption
                    ? 'bg-primary text-primary-foreground'
                    : showResult && isSelected && !isCorrectOption
                    ? 'bg-destructive text-destructive-foreground'
                    : isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-foreground flex-1">{option}</span>
                {showResult && isCorrectOption && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl"
                  >
                    ✓
                  </motion.span>
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl"
                  >
                    ✗
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation - Always show when result is visible */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6"
        >
          <div className={`p-5 rounded-xl ${isCorrect ? 'bg-primary/10 border-2 border-primary' : 'bg-destructive/10 border-2 border-destructive'}`}>
            <p className={`font-bold text-lg mb-3 ${isCorrect ? 'text-primary' : 'text-destructive'}`}>
              {isCorrect ? '🎉 Correct!' : '😿 Not quite right'}
            </p>
            <div className="space-y-3">
              <p className="text-foreground text-sm leading-relaxed font-medium">
                <span className="font-bold">Explanation: </span>
                {question.explanation}
              </p>
              {!isCorrect && (
                <p className="text-foreground text-sm leading-relaxed">
                  <span className="font-bold text-primary">Correct Answer: </span>
                  {question.options[question.correctIndex]}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};