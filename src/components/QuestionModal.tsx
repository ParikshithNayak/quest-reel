import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-fade-in">
      <Card className="w-full max-w-2xl mx-4 bg-card/95 backdrop-blur-sm border-border shadow-soft animate-scale-in">
        <div className="p-8 space-y-6">
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
            <p className="text-sm text-muted-foreground font-medium">
              Question {currentQuestion} of {totalQuestions}
            </p>
            <h2 className="text-3xl font-bold text-foreground">{question}</h2>
            {allowMultiple && (
              <p className="text-sm text-muted-foreground">Select multiple options</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, idx) => {
              const isSelected = allowMultiple 
                ? selectedOptions.includes(option)
                : selectedOption === option;
              
              return (
                <button
                  key={idx}
                  onClick={() => allowMultiple ? toggleOption(option) : setSelectedOption(option)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{option}</span>
                    {isSelected && (
                      <CheckCircle2 className="h-6 w-6 text-primary animate-scale-in" />
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
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-6"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
