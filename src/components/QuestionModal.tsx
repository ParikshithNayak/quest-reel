import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Check } from 'lucide-react';

/**
 * Props for the QuestionModal component
 * @param question - The question text to display
 * @param options - Array of answer options for the user to choose from
 * @param currentQuestion - Current question number (1-indexed)
 * @param totalQuestions - Total number of questions in the sequence
 * @param onAnswer - Callback fired when user submits an answer
 */
interface QuestionModalProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answer: string | string[]) => void;
  allowMultiple?: boolean;
}

/**
 * QuestionModal Component
 * Displays personality assessment questions over a blurred video background
 * Shows progress dots, question text, answer options, and a submit button
 */
export const QuestionModal = ({
  question,
  options,
  currentQuestion,
  totalQuestions,
  onAnswer,
  allowMultiple = false,
}: QuestionModalProps) => {
  // Track selected option(s)
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Toggle option for multiple selection
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Submit the selected answer(s) and reset selection for next question
  const handleSubmit = () => {
    if (allowMultiple && selectedOptions.length > 0) {
      onAnswer(selectedOptions);
      setSelectedOptions([]);
    } else if (selectedOption) {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-fade-in p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-auto bg-card/95 backdrop-blur-sm border-border shadow-soft animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentQuestion - 1
                    ? 'w-8 bg-gradient-primary shadow-glow'
                    : idx < currentQuestion - 1
                    ? 'w-2 bg-primary'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Question */}
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Question {currentQuestion} of {totalQuestions}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{question}</h2>
            {allowMultiple && (
              <p className="text-xs sm:text-sm text-muted-foreground">Select multiple options</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2 sm:space-y-3">
            {options.map((option, idx) => {
              const isSelected = allowMultiple 
                ? selectedOptions.includes(option)
                : selectedOption === option;
              
              return (
                <button
                  key={idx}
                  onClick={() => allowMultiple ? toggleOption(option) : setSelectedOption(option)}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 group ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    {allowMultiple ? (
                      <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-border bg-background group-hover:border-primary/50'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />}
                      </div>
                    ) : null}
                    <span className="text-sm sm:text-base md:text-lg font-medium flex-1">{option}</span>
                    {!allowMultiple && isSelected && (
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-scale-in flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={allowMultiple ? selectedOptions.length === 0 : !selectedOption}
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg py-4 sm:py-6"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
