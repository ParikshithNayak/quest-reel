import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer";
import { QuestionModal } from "@/components/QuestionModal";
import { BranchingModal } from "@/components/BranchingModal";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

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
    id: number;
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
  const navigate = useNavigate();
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
  const [videoUrl, setVideoUrl] = useState(
    "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/demo_3_main_compressed.mp4"
  );

  const [journeyPath, setJourneyPath] = useState<
    Array<{
      type: "question" | "branch";
      title: string;
      choice: string;
      timestamp: number;
    }>
  >([]);

  // Track selected options for AI filtering
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Track branching history for going back
  const [branchingHistory, setBranchingHistory] = useState<
    Array<{
      branchIndex: number;
      title: string;
      options: BranchingChoice["options"];
      timeInVideo: number;
      journeyPathLength: number;
      selectedOptionsLength: number;
    }>
  >([]);

  // Personality questions at the start (customize these)
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

  // Branching choices later in the video (customize these with your video URLs)
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
          videoUrl:
            "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/MotivationFinal.mp4",
          startTime: 0,
          returnTime: 42,
          switchTime: 29,
        },
        {
          id: 3,
          text: "Seek help from friends & family",
          videoUrl:
            "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/SeekHelp.mp4",
          startTime: 0,
          returnTime: 88,
          switchTime: 82,
        },
        {
          id: 4,
          text: "Miles should go with the flow, attributing it to fate",
          videoUrl:
            "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/FateFinal.mp4",
          startTime: 0,
          returnTime: 81,
          switchTime: 75,
        },
        {
          id: 5,
          text: "I want a feel good component",
          videoUrl:
            "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/Romance.mp4",
          startTime: 0,
          returnTime: 88,
          switchTime: 82,
        },
        {
          id: 6,
          text: "Make it a little spooky",
          videoUrl:
            "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/ThrillerFinal.mp4",
          startTime: 0,
          returnTime: 94.6,
          switchTime: 35.6,
        },
        {
          id: 7,
          text: "A tinge of comedy is definetly needed!",
          videoUrl:
            "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/ComedyFinal.mp4",
          startTime: 0,
          returnTime: 40,
          switchTime: 35,
        },
      ],
    },
  ];

  // Filtered branching choices from AI
  const [filteredBranchingChoices, setFilteredBranchingChoices] =
    useState<BranchingChoice[]>(branchingChoices);

  /**
   * Call AI API to filter and rephrase branching options for a specific question
   */
  const filterOptionsWithAI = async (
    branchIndex: number,
    currentSelectedOptions?: string[]
  ) => {
    try {
      const branch = branchingChoices[branchIndex];
      const availableOptions = branch.options.map((option) => ({
        id: `opt_${option.id}`,
        text: option.text,
        tags: option?.tags,
      }));

      // Store first and rest options separately
      const firstOption = availableOptions[0];
      const restOptions = availableOptions.slice(1);

      // Use provided options or current state
      const optionsToUse = currentSelectedOptions || selectedOptions;

      // Payload excludes the first option
      console.log("AI payload", {
        selected_options: optionsToUse,
        available_options: restOptions, // send all except first
        max_options: 2,
      });

      console.log("Selected Options: ", optionsToUse);

      const response = await fetch(
        "https://real-in-reel-backend.vercel.app/api/filter-options",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selected_options: optionsToUse,
            available_options: restOptions, // send all except first
            max_options: 2,
          }),
        }
      );

      const data = await response.json();

      console.log("AI Response: ", data);

      if (data.options && Array.isArray(data.options)) {
        const updatedBranchingChoices = [...filteredBranchingChoices];

        // If needed, recover the full option details
        const filteredOptions = data.options.map((filteredOpt: any) => {
          const originalOption = branch.options.find(
            (opt) => `opt_${opt.id}` === filteredOpt.id
          );
          return {
            ...originalOption,
            text: filteredOpt.text,
          };
        });

        // Prepend first option to final options
        const finalOptions = [firstOption, ...filteredOptions];

        updatedBranchingChoices[branchIndex] = {
          ...branch,
          options: finalOptions,
        };

        setFilteredBranchingChoices(updatedBranchingChoices);
      }
    } catch (error) {
      console.error("Error filtering options with AI:", error);
    }
  };

  /**
   * Handle video time updates
   * Check if we've reached a timestamp for a personality question or branching choice
   * Uses cumulative time for branching checks
   * Pause video and show appropriate modal when triggered
   */
  const handleTimeUpdate = async (time: number) => {
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
        const selectedOption =
          filteredBranchingChoices[branchIndex].options[choiceIndex];

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
        const nextBranch = filteredBranchingChoices.find(
          (b) =>
            !askedBranches.has(b.id) &&
            time >= b.time &&
            time < b.time + 0.5 &&
            (!b.condition || b.condition(personalityAnswers))
        );

        if (nextBranch && !showQuestion && !showBranching) {
          const branchIndex = filteredBranchingChoices.indexOf(nextBranch);

          setCurrentBranchingIndex(branchIndex);
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
  ///////// pending
  const handleAnswer = async (answer: string | string[]) => {
    const currentQuestion = personalityQuestions[currentQuestionIndex];
    const answerTextPersonality = Array.isArray(answer)
      ? answer.join(", ")
      : answer;

    const updatedAnswers = [...personalityAnswers, answer];
    setPersonalityAnswers(updatedAnswers);
    setJourneyPath((prev) => [
      ...prev,
      {
        type: "question",
        title: currentQuestion.question,
        choice: answerTextPersonality,
        timestamp: currentTime,
      },
    ]);

    setShowQuestion(false);

    // Add personality answer to selected options
    const answerText = Array.isArray(answer) ? answer.join(", ") : answer;
    setSelectedOptions((prev) => [...prev, answerText]);

    // If all personality questions are answered, send to Gemini API and filter first branching question
    if (updatedAnswers.length === personalityQuestions.length) {
      try {
        const updatedSelectedOptions = [...selectedOptions, answerText];
        setTimeout(async () => {
          await filterOptionsWithAI(0, updatedSelectedOptions);
        }, 100);
      } catch (error) {
        console.error("Error analyzing personality:", error);
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
  const handleBranchChoice = async (choiceIndex: number) => {
    const selectedOption =
      filteredBranchingChoices[currentBranchingIndex].options[choiceIndex];
    const currentBranch = branchingChoices[currentBranchingIndex];

    // Add to branching history before making the choice
    setBranchingHistory((prev) => [
      ...prev,
      {
        branchIndex: currentBranchingIndex,
        title: filteredBranchingChoices[currentBranchingIndex].title,
        options: filteredBranchingChoices[currentBranchingIndex].options,
        timeInVideo: currentBranch.time,
        journeyPathLength: journeyPath.length,
        selectedOptionsLength: selectedOptions.length,
      },
    ]);

    setJourneyPath((prev) => [
      ...prev,
      {
        type: "branch",
        title: currentBranch.title,
        choice: selectedOption.text,
        timestamp: currentTime,
      },
    ]);

    // Add selected option to tracking
    setSelectedOptions((prev) => [...prev, selectedOption.text]);

    // Filter next branching question if it exists
    const nextBranchIndex = currentBranchingIndex + 1;
    if (nextBranchIndex < branchingChoices.length) {
      // Update selected options first, then filter
      const updatedSelectedOptions = [...selectedOptions, selectedOption.text];
      setTimeout(async () => {
        await filterOptionsWithAI(nextBranchIndex, updatedSelectedOptions);
      }, 100);
    }

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
   * Handle going back to previous branching question
   * Resets progress and shows the branching modal again
   */
  const handleGoBackToBranching = () => {
    if (branchingHistory.length > 0) {
      const lastBranching = branchingHistory[branchingHistory.length - 1];

      // Remove this branching from history
      setBranchingHistory((prev) => prev.slice(0, -1));

      // Reset journey path to before this branching
      setJourneyPath((prev) => prev.slice(0, lastBranching.journeyPathLength));

      // Reset selected options to before this branching choice
      setSelectedOptions((prev) =>
        prev.slice(0, lastBranching.selectedOptionsLength)
      );

      // Clear video stack (return to main video)
      setVideoStack([]);

      // Clear pending branch switch
      setPendingBranchSwitch(null);

      // Clear current branching choice
      setCurrentBranchingChoice(null);

      // Return to main video
      setVideoUrl(
        "https://real-in-reel-general-poc.s3.ap-south-1.amazonaws.com/demo_3_main_compressed.mp4"
      );

      // Seek video back to the branching point
      setTimeout(() => {
        videoRef.current?.seekTo(lastBranching.timeInVideo);

        // Show the branching modal
        setCurrentBranchingIndex(lastBranching.branchIndex);
        setShowBranching(true);
        videoRef.current?.pause();
      }, 100);
    }
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
        filteredBranchingChoices[currentBranchingIndex].options[
          currentBranchingChoice
        ];
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
    } else if (videoStack.length === 0) {
      // Main video has ended - navigate to completion
      navigate("/completion", {
        state: {
          personalityAnswers,
          journeyPath,
        },
      });
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
        allowSeeking={personalityAnswers.length === personalityQuestions.length}
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
          title={filteredBranchingChoices[currentBranchingIndex].title}
          options={filteredBranchingChoices[currentBranchingIndex].options}
          onChoice={handleBranchChoice}
        />
      )}

      {/* Go Back Button - Only show if there's branching history and no modal is open */}
      {branchingHistory.length > 0 && !showQuestion && !showBranching && (
        <Button
          onClick={handleGoBackToBranching}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary/90 hover:bg-primary backdrop-blur-sm"
          size="icon"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
    </div>
  );
};

export default Index;
