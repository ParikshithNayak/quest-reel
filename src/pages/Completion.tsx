import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RotateCcw, User, Route } from 'lucide-react';

interface CompletionData {
  personalityAnswers: Array<string | string[]>;
  journeyPath: Array<{
    type: 'question' | 'branch';
    title: string;
    choice: string;
    timestamp: number;
  }>;
}

interface PersonalityAnalysis {
  userType: string;
  description: string;
  traits: string[];
}

const Completion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [personalityAnalysis, setPersonalityAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  
  const completionData = location.state as CompletionData;

  useEffect(() => {
    // Simulate API call for personality analysis
    const fetchPersonalityAnalysis = async () => {
      try {
        // Mock API call - replace with actual backend endpoint
        const response = await fetch('https://real-in-reel-backend.vercel.app/api/personality-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selected_options: completionData?.personalityAnswers.flat()
            }),
        });

        console.log(completionData?.personalityAnswers)
        
        if (!response.ok) {
          throw new Error('API call failed');
        }
        
        const data = await response.json();
        setPersonalityAnalysis(data);
      } catch (error) {
        // Fallback mock data if API fails
        setPersonalityAnalysis({
          userType:"Creative Explorer",
          description:"You are imaginative and introspective, seeking meaning in every choice.",
          traits:["Curious", "Open to Experience"],
        });
      } finally {
        setLoading(false);
      }
    };

    if (completionData?.personalityAnswers) {
      fetchPersonalityAnalysis();
    } else {
      setLoading(false);
    }
  }, [completionData]);

  const handleRestart = () => {
    navigate('/', { replace: true });
  };

  if (!completionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No completion data found</p>
          <Button onClick={handleRestart}>Start New Experience</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-accent">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Experience Complete
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personalized journey has revealed insights about your preferences
          </p>
        </div>

        {/* Personality Analysis */}
        <Card className="p-8 bg-card/95 backdrop-blur-sm border-border shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Your Personality Profile</h2>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-20 bg-muted animate-pulse rounded" />
              <div className="flex gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          ) : personalityAnalysis ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-accent mb-2">
                  {personalityAnalysis.userType}
                </h3>
                <p className="text-foreground leading-relaxed">
                  {personalityAnalysis.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Key Traits:</h4>
                <div className="flex flex-wrap gap-2">
                  {personalityAnalysis.traits.map((trait, idx) => (
                    <Badge key={idx} className="bg-primary/20 text-primary border-primary/30">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Unable to load personality analysis</p>
          )}
        </Card>

        {/* Journey Path */}
        <Card className="p-8 bg-card/95 backdrop-blur-sm border-border shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <Route className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold">Your Journey Path</h2>
          </div>
          
          <div className="space-y-4">
            {completionData.journeyPath.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {step.type === 'question' ? 'Question' : 'Choice'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="text-foreground font-medium">{step.choice}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    At {Math.floor(step.timestamp / 60)}:{(step.timestamp % 60).toFixed(0).padStart(2, '0')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button 
            onClick={handleRestart}
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 px-8 py-3"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start New Experience
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Completion;