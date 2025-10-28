import { useState, useRef } from "react";
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer";
import { QuestionModal } from "@/components/QuestionModal";
import { BranchingModal } from "@/components/BranchingModal";

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
  allowMultiple?: boolean;
}

/**
 * Branching story choice shown later in the video
 * @param id - Unique identifier for the choice
 * @param time - Video timestamp (in seconds with millisecond precision) when choice should appear
 * @param title - The decision prompt title
 * @param options - Array of choice options with optional recommendation flags and video URLs
 */
interface BranchingChoice {
  id: number;
  time: number;
  title: string;
  condition?: (answers: Array<string | string[]>) => boolean;
  options: Array<{
    text: string;
    isRecommended?: boolean;
    videoUrl: string;
    startTime?: number;
    switchTime?: number; // Time on main video when to switch to this branch
    returnTime: number;
    tags?: string[];
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
  const [videoStack, setVideoStack] = useState<
    Array<{ url: string; timestamp: number; cumulativeTime: number }>
  >([]);

  // UI state for showing modals
  const [showQuestion, setShowQuestion] = useState(false);
  const [showBranching, setShowBranching] = useState(false);

  // Track which question/branch is currently displayed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentBranchingIndex, setCurrentBranchingIndex] = useState(0);
  const [currentBranchingChoice, setCurrentBranchingChoice] = useState<
    number | null
  >(null);

  // Track pending branch switches (when switchTime is specified)
  const [pendingBranchSwitch, setPendingBranchSwitch] = useState<{
    branchIndex: number;
    choiceIndex: number;
    switchTime: number;
  } | null>(null);

  // Store user's personality answers for personalized recommendations
  const [personalityAnswers, setPersonalityAnswers] = useState<
    Array<string | string[]>
  >([]);

  // Track which questions/branches have already been shown (by ID)
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());
  const [askedBranches, setAskedBranches] = useState<Set<number>>(new Set());

  // Current video URL - changes based on branching choices
  const [videoUrl, setVideoUrl] = useState("/videos/spiderman_1080.mp4");

  // Personality questions at the start (customize these)
  const personalityQuestions: PersonalityQuestion[] = [
    {
      id: 1,
      time: 0,
      question: "What are your top 2 most preferred genres for movies?",
      options: ["Action", "Comedy", "Romance", "Thriller", "Horror"],
      allowMultiple: true,
    },
    {
      id: 2,
      time: 10,
      question: "What would you do if you were to be in Miles' position?",
      options: [
        "Try to think out of the box with a more creative soultion to cope with stress and anxiety",
        "Try to organize my thoughts & take control of your responsibilities",
        "Try to seek help from friends & family",
        "Try to just go with the flow, attributing it to fate",
        "Get bogged down and go into your shell",
      ],
    },
  ];

  // Branching choices later in the video (customize these with your video URLs)
  const branchingChoices: BranchingChoice[] = [
    {
      id: 1,
      time: 19,
      title: " What should he focus on?",
      options: [
        {
          text: "I am liking it... let's continue!",
          videoUrl: "/videos/PP1A-Negative.mp4",
          startTime: 0,
          returnTime: 30,
          tags: ["Director's Choice"],
        },
        {
          text: "It's sad, shift towards brighter thoughts",
          videoUrl: "/videos/PP1B-Positive.mp4",
          startTime: 0,
          returnTime: 29,
          tags: ["Recommended"],
        },
      ],
    },
    {
      id: 2,
      time: 50,
      title: "Pick your vibe...",
      options: [
        {
          text: "Am I Dreaming (Slow / Melancholic)",
          isRecommended: personalityAnswers[0] === "Action and courage",
          videoUrl: "/videos/Am_I_Dreaming.mp4",
          startTime: 0,
          returnTime: 65, // Resume main video at 20 seconds
        },
        {
          text: "Sunflower (Melodic Hip-Hop)",
          isRecommended: personalityAnswers[0] === "Patience and planning",
          videoUrl: "/videos/Sunflower_BalanceAndReflective.mp4",
          startTime: 0,
          returnTime: 65,
        },
        {
          text: "What’s Up Danger (Calm / Lo-Fi Version)",
          isRecommended: personalityAnswers[0] === "Patience and planning",
          videoUrl: "/videos/WhatsUpDangerLoFiBeatVersion.mp4",
          startTime: 0,
          returnTime: 65,
        },
      ],
    },
    // {
    //   id: 2,
    //   time: 25,
    //   title: 'You discover a hidden path...',
    //   options: [
    //     {
    //       text: 'Take the risky shortcut',
    //       isRecommended: personalityAnswers[1] === 'Head-on with confidence',
    //       videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    //       startTime: 0,
    //       returnTime: 30 // Resume main video at 30 seconds
    //     },
    //     {
    //       text: 'Stick to the known route',
    //       isRecommended: personalityAnswers[1] === 'Carefully with analysis',
    //       videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    //       startTime: 0,
    //       returnTime: 30
    //     },
    //     {
    //       text: 'Explore both options',
    //       isRecommended: personalityAnswers[1] === 'Creatively with flexibility',
    //       videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    //       startTime: 0,
    //       returnTime: 30
    //     },
    //   ],
    // },
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
    const newCumulativeTime =
      videoStack.length > 0
        ? videoStack[videoStack.length - 1].cumulativeTime + time
        : time;
    setCumulativeTime(newCumulativeTime);

    // Check for pending branch switches
    if (pendingBranchSwitch && videoStack.length === 0) {
      const { branchIndex, choiceIndex, switchTime } = pendingBranchSwitch;
      
      // Use 0.5s window for reliable time checking
      if (time >= switchTime && time < switchTime + 0.5) {
        const selectedOption = branchingChoices[branchIndex].options[choiceIndex];
        
        // Save current video state to stack before branching
        setVideoStack((prev) => [
          ...prev,
          {
            url: videoUrl,
            timestamp: currentTime,
            cumulativeTime: cumulativeTime,
          },
        ]);

        // Store the choice index to use the returnTime later
        setCurrentBranchingChoice(choiceIndex);

        // Switch to the new branch video
        setVideoUrl(selectedOption.videoUrl);
        setCurrentTime(selectedOption.startTime || 0);

        // Clear pending switch
        setPendingBranchSwitch(null);

        // Resume playback after a short delay
        setTimeout(() => {
          if (selectedOption.startTime && videoRef.current) {
            videoRef.current.seekTo(selectedOption.startTime);
          }
          videoRef.current?.play();
        }, 100);
        
        return;
      }
    }

    // Only check for questions/branches if we're on the main video (not in a branch)
    if (videoStack.length === 0) {
      // Check for personality questions (shown at the start, based on actual video time)
      // Use 0.5s window for reliable triggering
      const nextQuestion = personalityQuestions.find(
        (q) =>
          !askedQuestions.has(q.id) && time >= q.time && time < q.time + 0.5
      );

      if (nextQuestion && !showQuestion && !showBranching) {
        setCurrentQuestionIndex(personalityQuestions.indexOf(nextQuestion));
        setShowQuestion(true);
        videoRef.current?.pause();
        setAskedQuestions((prev) => new Set(prev).add(nextQuestion.id));
      }

      // Check for branching choices based on main video time (only after all personality questions are answered)
      if (personalityAnswers.length === personalityQuestions.length) {
        const nextBranch = branchingChoices.find(
          (b) =>
            !askedBranches.has(b.id) &&
            time >= b.time &&
            time < b.time + 0.5 &&
            (!b.condition || b.condition(personalityAnswers))
        );

        if (nextBranch && !showQuestion && !showBranching) {
          setCurrentBranchingIndex(branchingChoices.indexOf(nextBranch));
          setShowBranching(true);
          videoRef.current?.pause();
          setAskedBranches((prev) => new Set(prev).add(nextBranch.id));
        }
      }
    }
  };

  /**
   * Handle personality question answer submission
   * Store answer, close modal, and resume video playback
   */
  const handleAnswer = async (answer: string | string[]) => {
    const updatedAnswers = [...personalityAnswers, answer];
    setPersonalityAnswers(updatedAnswers);
    setShowQuestion(false);
    
    // If all personality questions are answered, send to Gemini API
    if (updatedAnswers.length === personalityQuestions.length) {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-personality`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ personalityAnswers: updatedAnswers }),
        });
        
        const data = await response.json();
        console.log('Personality Analysis:', data.analysis);
      } catch (error) {
        console.error('Error analyzing personality:', error);
      }
    }
    
    setTimeout(() => {
      videoRef.current?.play();
    }, 300);
  };

  /**
   * Handle branching choice selection
   * If switchTime is specified, schedule the switch; otherwise switch immediately
   * Or continue main video if Director's Choice
   */
  const handleBranchChoice = (choiceIndex: number) => {
    const selectedOption =
      branchingChoices[currentBranchingIndex].options[choiceIndex];

    // Check if this is a Director's Choice (continue main video)
    const isDirectorsChoice =
      selectedOption.tags?.includes("Director's Choice");

    if (isDirectorsChoice) {
      // Just close the modal and continue playing the main video
      setShowBranching(false);
      setTimeout(() => {
        videoRef.current?.play();
      }, 300);
      return;
    }

    // Check if this branch has a delayed switch time
    if (selectedOption.switchTime !== undefined) {
      // Schedule the branch switch for later
      setPendingBranchSwitch({
        branchIndex: currentBranchingIndex,
        choiceIndex: choiceIndex,
        switchTime: selectedOption.switchTime,
      });
      
      // Close modal and continue playing main video until switchTime
      setShowBranching(false);
      setTimeout(() => {
        videoRef.current?.play();
      }, 300);
      return;
    }

    // Immediate switch: Save current video state to stack before branching
    setVideoStack((prev) => [
      ...prev,
      {
        url: videoUrl,
        timestamp: currentTime,
        cumulativeTime: cumulativeTime,
      },
    ]);

    // Store the choice index to use the returnTime later
    setCurrentBranchingChoice(choiceIndex);

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
   * When a branch video ends, return to the previous video at the specified returnTime
   */
  const handleVideoEnded = () => {
    if (videoStack.length > 0 && currentBranchingChoice !== null) {
      // Get the branch video duration for cumulative time tracking
      const branchVideoDuration = currentTime;

      // Pop the last video from the stack
      const previousVideo = videoStack[videoStack.length - 1];
      setVideoStack((prev) => prev.slice(0, -1));

      // Get the developer-specified return time for this branch
      const selectedOption =
        branchingChoices[currentBranchingIndex].options[currentBranchingChoice];
      const resumeTime = selectedOption.returnTime;

      // Restore the previous video
      setVideoUrl(previousVideo.url);
      setCurrentTime(resumeTime);
      setCumulativeTime(previousVideo.cumulativeTime + branchVideoDuration);

      // Reset the branch choice tracker
      setCurrentBranchingChoice(null);

      // Resume playback from the specified return time
      setTimeout(() => {
        videoRef.current?.seekTo(resumeTime);
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
        allowSeeking={
          personalityAnswers.length === personalityQuestions.length &&
          videoStack.length === 0
        }
      />

      {showQuestion && (
        <QuestionModal
          question={personalityQuestions[currentQuestionIndex].question}
          options={personalityQuestions[currentQuestionIndex].options}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={personalityQuestions.length}
          onAnswer={handleAnswer}
          allowMultiple={
            personalityQuestions[currentQuestionIndex].allowMultiple
          }
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
