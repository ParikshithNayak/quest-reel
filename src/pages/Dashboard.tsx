import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  Video, 
  HelpCircle, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Play
} from 'lucide-react';

interface ApprovalInfo {
  role: string;
  name: string;
  avatar?: string;
  status: 'approved' | 'rejected' | 'pending';
  timestamp?: string;
  comments?: string;
}

// Import the exact same data structures from Index.tsx
interface PersonalityQuestion {
  id: number;
  time: number;
  question: string;
  options: string[];
  allowMultiple?: boolean;
}

interface BranchingChoice {
  id: number;
  time: number;
  title: string;
  condition?: (answers: Array<string | string[]>) => boolean;
  options: Array<{
    id: number;
    text: string;
    isRecommended?: boolean;
    videoUrl: string;
    startTime?: number;
    switchTime?: number;
    returnTime: number;
    tags?: string[];
  }>;
}

const Dashboard = () => {
  // Use the exact same data from Index.tsx
  const personalityQuestions: PersonalityQuestion[] = [
    {
      id: 1,
      time: 6.1,
      question: "What are your preferred genres for movies?",
      options: ["Comedy", "Romance", "Thriller/Horror"],
      allowMultiple: true,
    },
    {
      id: 2,
      time: 17,
      question: "What would you do if you were to be in Miles' position?",
      options: [
        "Try to organize your thoughts & take control of your responsibilities",
        "Try to seek help from friends & family",
        "Go with the flow, attributing it to fate",
      ],
    },
  ];

  const branchingChoices: BranchingChoice[] = [
    {
      id: 1,
      time: 22,
      title: "How do you like it?",
      options: [
        {
          id: 1,
          text: "I am loving it... keep going!",
          videoUrl: "/videos/PP1A-Negative.mp4",
          startTime: 0,
          returnTime: 30,
          tags: ["Director's Choice"],
        },
        {
          id: 2,
          text: "Organize thoughts & take control",
          videoUrl: "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/MotivationFinal.mp4",
          startTime: 0,
          returnTime: 42,
          switchTime: 29,
        },
        {
          id: 3,
          text: "Seek help from friends & family",
          videoUrl: "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/SeekHelp.mp4",
          startTime: 0,
          returnTime: 88,
          switchTime: 82,
        },
        {
          id: 4,
          text: "Miles should go with the flow, attributing it to fate",
          videoUrl: "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/FateFinal.mp4",
          startTime: 0,
          returnTime: 81,
          switchTime: 75,
        },
        {
          id: 5,
          text: "I want a feel good component",
          videoUrl: "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/Romance.mp4",
          startTime: 0,
          returnTime: 88,
          switchTime: 82,
        },
        {
          id: 6,
          text: "Make it a little spooky",
          videoUrl: "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/ThrillerFinal.mp4",
          startTime: 0,
          returnTime: 94.6,
          switchTime: 35.6,
        },
        {
          id: 7,
          text: "A tinge of comedy is definetly needed!",
          videoUrl: "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/ComedyFinal.mp4",
          startTime: 0,
          returnTime: 40,
          switchTime: 35,
        },
      ],
    },
  ];

  // Approval data overlay - doesn't modify original data
  const getApprovals = (type: 'question' | 'choice' | 'option', id: number, optionId?: number): ApprovalInfo[] => {
    const approvalMap: Record<string, ApprovalInfo[]> = {
      'question-1': [
        { role: "Director", name: "Sarah Chen", status: "approved", timestamp: "2024-01-15 14:30" },
        { role: "Producer", name: "Mike Johnson", status: "approved", timestamp: "2024-01-15 15:45" },
        { role: "Cinematographer", name: "Alex Rivera", status: "pending" }
      ],
      'question-2': [
        { role: "Director", name: "Sarah Chen", status: "approved", timestamp: "2024-01-16 09:15" },
        { role: "Producer", name: "Mike Johnson", status: "rejected", timestamp: "2024-01-16 10:30", comments: "Question needs refinement" },
        { role: "Script Writer", name: "Emma Davis", status: "approved", timestamp: "2024-01-16 11:00" }
      ],
      'choice-1': [
        { role: "Director", name: "Sarah Chen", status: "approved", timestamp: "2024-01-17 13:20" },
        { role: "Producer", name: "Mike Johnson", status: "approved", timestamp: "2024-01-17 14:00" }
      ],
      'option-1-1': [
        { role: "Director", name: "Sarah Chen", status: "approved", timestamp: "2024-01-17 13:25" },
        { role: "Cinematographer", name: "Alex Rivera", status: "approved", timestamp: "2024-01-17 14:30" }
      ],
      'option-1-2': [
        { role: "Director", name: "Sarah Chen", status: "approved", timestamp: "2024-01-17 15:00" },
        { role: "Producer", name: "Mike Johnson", status: "pending" },
        { role: "Editor", name: "Tom Wilson", status: "approved", timestamp: "2024-01-17 16:15" }
      ],
      'option-1-3': [
        { role: "Director", name: "Sarah Chen", status: "rejected", timestamp: "2024-01-17 16:30", comments: "Needs emotional depth" },
        { role: "Producer", name: "Mike Johnson", status: "approved", timestamp: "2024-01-17 17:00" }
      ]
    };
    
    const key = optionId ? `${type}-${id}-${optionId}` : `${type}-${id}`;
    return approvalMap[key] || [];
  };

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const ApprovalsList = ({ approvals }: { approvals: ApprovalInfo[] }) => (
    <div className="space-y-3">
      {approvals.map((approval, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={approval.avatar} />
            <AvatarFallback>{approval.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{approval.name}</span>
              <Badge variant="outline" className="text-xs">{approval.role}</Badge>
            </div>
            {approval.timestamp && (
              <p className="text-xs text-muted-foreground">{approval.timestamp}</p>
            )}
            {approval.comments && (
              <p className="text-xs text-muted-foreground mt-1 italic">"{approval.comments}"</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(approval.status)}
            <Badge className={`text-xs ${getStatusColor(approval.status)}`}>
              {approval.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              Production Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage interactive story elements and approvals
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Eye className="h-4 w-4 mr-2" />
            Preview Experience
          </Button>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Personality Questions
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Branching Choices
            </TabsTrigger>
          </TabsList>

          {/* Personality Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {personalityQuestions.map((question) => (
              <Card key={question.id} className="p-6 bg-card/95 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-primary/20 text-primary">
                          Question {question.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.time}s
                        </Badge>
                        {question.allowMultiple && (
                          <Badge variant="outline" className="text-xs">
                            Multiple Choice
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{question.question}</h3>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Options:</p>
                        <div className="grid gap-2">
                          {question.options.map((option, idx) => (
                            <div key={idx} className="p-2 rounded bg-muted/30 text-sm">
                              {idx + 1}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approvals
                    </h4>
                    <ApprovalsList approvals={getApprovals('question', question.id)} />
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Branching Choices Tab */}
          <TabsContent value="branches" className="space-y-6">
            {branchingChoices.map((branch) => (
              <Card key={branch.id} className="p-6 bg-card/95 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-accent/20 text-accent">
                          Branch {branch.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {branch.time}s
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold">{branch.title}</h3>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Branch Approvals</h4>
                    <ApprovalsList approvals={getApprovals('choice', branch.id)} />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Options
                    </h4>
                    {branch.options.map((option) => (
                      <Card key={option.id} className="p-4 bg-muted/20 border-border/50">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Option {option.id}
                                </Badge>
                                {option.tags?.map((tag, idx) => (
                                  <Badge key={idx} className="text-xs bg-primary/20 text-primary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <p className="font-medium mb-2">{option.text}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>Return Time: {option.returnTime}s</div>
                                {option.switchTime && (
                                  <div>Switch Time: {option.switchTime}s</div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedVideo(option.videoUrl)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Video Approvals</h5>
                            <ApprovalsList approvals={getApprovals('option', branch.id, option.id)} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Video Preview Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl">
            <Card className="w-full max-w-4xl mx-4 bg-card/95">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Video Preview</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVideo(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={selectedVideo}
                    controls
                    className="w-full h-full"
                    autoPlay
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;