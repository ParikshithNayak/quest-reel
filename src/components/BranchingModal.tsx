import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

/**
 * Props for the BranchingModal component
 * @param title - The branching decision title/prompt
 * @param options - Array of choice options, with optional isRecommended flag
 * @param onChoice - Callback fired when user selects a choice (passes index)
 */
interface BranchingModalProps {
  title: string;
  options: Array<{
    text: string;
    isRecommended?: boolean;
    tags?: string[];
  }>;
  onChoice: (choiceIndex: number) => void;
}

/**
 * BranchingModal Component
 * Displays story branching choices over a blurred video background
 * Highlights recommended options based on user's personality profile
 */
export const BranchingModal = ({ title, options, onChoice }: BranchingModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-fade-in p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-auto bg-card/95 backdrop-blur-sm border-border shadow-soft animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Choose your path</p>
          </div>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onChoice(idx)}
                className={`w-full p-4 sm:p-5 md:p-6 rounded-lg border-2 text-left transition-all duration-200 group ${
                  option.isRecommended
                    ? 'border-accent bg-accent/10 shadow-accent-glow hover:shadow-accent-glow hover:scale-[1.02]'
                    : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <span className="text-base sm:text-lg md:text-xl font-semibold block">{option.text}</span>
                    {option.isRecommended && (
                      <div className="flex items-center gap-2 text-accent text-xs sm:text-sm font-medium">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Recommended for you</span>
                      </div>
                    )}
                    {option.tags && option.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {option.tags.map((tag, tagIdx) => (
                          <Badge 
                            key={tagIdx} 
                            className="text-xs font-semibold bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 text-foreground shadow-sm hover:shadow-md transition-shadow"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl md:text-4xl transition-transform duration-200 group-hover:scale-110 flex-shrink-0 ${
                      option.isRecommended ? 'animate-pulse-glow' : ''
                    }`}
                  >
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
