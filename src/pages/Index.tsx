import { useState, useRef } from 'react';
import { VideoPlayer, VideoPlayerRef } from '@/components/VideoPlayer';
import { QuestionModal } from '@/components/QuestionModal';
import { BranchingModal } from '@/components/BranchingModal';

/**
 * Personality question shown at the start of the video
 * @param id - Unique identifier for the question
 * @param time - Video timestamp (in seconds) when question should appear
 * @param question - The question text
 * @param options - Array of answer options
 */
interface PersonalityQuestion {
  id: number;
  time: number;
  question: string;
  options: string[];
}

/**
 * Branching story choice shown later in the video
 * @param id - Unique identifier for the choice
 * @param time - Video timestamp (in seconds) when choice should appear
 * @param title - The decision prompt title
 * @param options - Array of choice options with optional recommendation flags and video URLs
 */
interface BranchingChoice {
  id: number;
  time: number;
  title: string;
  options: Array<{
    text: string;
    isRecommended?: boolean;
    videoUrl: string;
    startTime?: number; // Optional: start the new video at a specific time
  }>;
}

/**
 * Index Page Component
 * Main application page that orchestrates the interactive video experience
 * Manages personality questions, branching choices, and video playback
 */
const Index = () => {
  // Ref to control video playback programmatically
  const videoRef = useRef<VideoPlayerRef>(null);
  
  // Current video playback time in seconds
  const [currentTime, setCurrentTime] = useState(0);
  
  // Cumulative time across all videos watched (for branching triggers)
  const [cumulativeTime, setCumulativeTime] = useState(0);
  
  // Video history stack - stores previous videos to return to after branches
  const [videoStack, setVideoStack] = useState<Array<{ url: string; timestamp: number; cumulativeTime: number }>>([]);
  
  // UI state for showing modals
  const [showQuestion, setShowQuestion] = useState(false);
  const [showBranching, setShowBranching] = useState(false);
  
  // Track which question/branch is currently displayed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentBranchingIndex, setCurrentBranchingIndex] = useState(0);
  
  // Store user's personality answers for personalized recommendations
  const [personalityAnswers, setPersonalityAnswers] = useState<string[]>([]);
  
  // Track which questions/branches have already been shown (by ID)
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());
  const [askedBranches, setAskedBranches] = useState<Set<number>>(new Set());

  // Current video URL - changes based on branching choices
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // Personality questions at the start (customize these)
  const personalityQuestions: PersonalityQuestion[] = [
    {
      id: 1,
      time: 2,
      question: 'What drives you in difficult situations?',
      options: ['Logic and strategy', 'Intuition and emotion', 'Action and courage', 'Patience and planning'],
    },
    {
      id: 2,
      time: 5,
      question: 'How do you approach new challenges?',
      options: ['Head-on with confidence', 'Carefully with analysis', 'Creatively with flexibility', 'Collaboratively with others'],
    },
    {
      id: 3,
      time: 8,
      question: 'What matters most to you?',
      options: ['Truth and justice', 'Freedom and adventure', 'Harmony and peace', 'Knowledge and wisdom'],
    },
  ];

  // Branching choices later in the video (customize these with your video URLs)
  const branchingChoices: BranchingChoice[] = [
    {
      id: 1,
      time: 15,
      title: 'A mysterious figure approaches...',
      options: [
        { 
          text: 'Confront them directly', 
          isRecommended: personalityAnswers[0] === 'Action and courage',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          startTime: 0
        },
        { 
          text: 'Observe from a distance', 
          isRecommended: personalityAnswers[0] === 'Patience and planning',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          startTime: 0
        },
        { 
          text: 'Try to communicate peacefully', 
          isRecommended: personalityAnswers[0] === 'Intuition and emotion',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          startTime: 0
        },
      ],
    },
    {
      id: 2,
      time: 25,
      title: 'You discover a hidden path...',
      options: [
        { 
          text: 'Take the risky shortcut', 
          isRecommended: personalityAnswers[1] === 'Head-on with confidence',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          startTime: 0
        },
        { 
          text: 'Stick to the known route', 
          isRecommended: personalityAnswers[1] === 'Carefully with analysis',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          startTime: 0
        },
        { 
          text: 'Explore both options', 
          isRecommended: personalityAnswers[1] === 'Creatively with flexibility',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          startTime: 0
        },
      ],
    },
  ];

  /**
   * Handle video time updates
   * Check if we've reached a timestamp for a personality question or branching choice
   * Uses cumulative time for branching checks
   * Pause video and show appropriate modal when triggered
   */
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    
    // Update cumulative time based on current video playback
    const newCumulativeTime = videoStack.length > 0 
      ? videoStack[videoStack.length - 1].cumulativeTime + time
      : time;
    setCumulativeTime(newCumulativeTime);

    // Check for personality questions (shown at the start, based on actual video time)
    const nextQuestion = personalityQuestions.find(
      (q) => !askedQuestions.has(q.id) && time >= q.time && time < q.time + 0.5
    );

    if (nextQuestion && !showQuestion && !showBranching) {
      setCurrentQuestionIndex(personalityQuestions.indexOf(nextQuestion));
      setShowQuestion(true);
      videoRef.current?.pause();
      setAskedQuestions((prev) => new Set(prev).add(nextQuestion.id));
    }

    // Check for branching choices using cumulative time (only after all personality questions are answered)
    if (personalityAnswers.length === personalityQuestions.length) {
      const nextBranch = branchingChoices.find(
        (b) => !askedBranches.has(b.id) && newCumulativeTime >= b.time && newCumulativeTime < b.time + 0.5
      );

      if (nextBranch && !showQuestion && !showBranching) {
        setCurrentBranchingIndex(branchingChoices.indexOf(nextBranch));
        setShowBranching(true);
        videoRef.current?.pause();
        setAskedBranches((prev) => new Set(prev).add(nextBranch.id));
      }
    }
  };

  /**
   * Handle personality question answer submission
   * Store answer, close modal, and resume video playback
   */
  const handleAnswer = (answer: string) => {
    setPersonalityAnswers([...personalityAnswers, answer]);
    setShowQuestion(false);
    setTimeout(() => {
      videoRef.current?.play();
    }, 300);
  };

  /**
   * Handle branching choice selection
   * Push current video state to stack, switch to branch video
   */
  const handleBranchChoice = (choiceIndex: number) => {
    const selectedOption = branchingChoices[currentBranchingIndex].options[choiceIndex];
    
    // Save current video state to stack before branching
    setVideoStack((prev) => [
      ...prev,
      {
        url: videoUrl,
        timestamp: currentTime,
        cumulativeTime: cumulativeTime,
      },
    ]);
    
    // Switch to the new branch video
    setVideoUrl(selectedOption.videoUrl);
    setCurrentTime(selectedOption.startTime || 0);
    
    setShowBranching(false);
    
    // Resume playback after a short delay
    setTimeout(() => {
      if (selectedOption.startTime && videoRef.current) {
        videoRef.current.seekTo(selectedOption.startTime);
      }
      videoRef.current?.play();
    }, 300);
  };

  /**
   * Handle video end event
   * When a branch video ends, return to the previous video in the stack
   */
  const handleVideoEnded = () => {
    if (videoStack.length > 0) {
      // Pop the last video from the stack
      const previousVideo = videoStack[videoStack.length - 1];
      setVideoStack((prev) => prev.slice(0, -1));
      
      // Restore the previous video
      setVideoUrl(previousVideo.url);
      setCurrentTime(previousVideo.timestamp);
      setCumulativeTime(previousVideo.cumulativeTime);
      
      // Resume playback from where we left off
      setTimeout(() => {
        videoRef.current?.seekTo(previousVideo.timestamp);
        videoRef.current?.play();
      }, 100);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <VideoPlayer
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onVideoEnded={handleVideoEnded}
        isBlurred={showQuestion || showBranching}
      />

      {showQuestion && (
        <QuestionModal
          question={personalityQuestions[currentQuestionIndex].question}
          options={personalityQuestions[currentQuestionIndex].options}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={personalityQuestions.length}
          onAnswer={handleAnswer}
        />
      )}

      {showBranching && (
        <BranchingModal
          title={branchingChoices[currentBranchingIndex].title}
          options={branchingChoices[currentBranchingIndex].options}
          onChoice={handleBranchChoice}
        />
      )}
    </div>
  );
};

export default Index;
