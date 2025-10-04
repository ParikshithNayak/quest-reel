import { useState, useRef } from 'react';
import { VideoPlayer, VideoPlayerRef } from '@/components/VideoPlayer';
import { QuestionModal } from '@/components/QuestionModal';
import { BranchingModal } from '@/components/BranchingModal';

interface PersonalityQuestion {
  id: number;
  time: number;
  question: string;
  options: string[];
}

interface BranchingChoice {
  id: number;
  time: number;
  title: string;
  options: Array<{
    text: string;
    isRecommended?: boolean;
  }>;
}

const Index = () => {
  const videoRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showBranching, setShowBranching] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentBranchingIndex, setCurrentBranchingIndex] = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState<string[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());
  const [askedBranches, setAskedBranches] = useState<Set<number>>(new Set());

  // Demo video - replace with your actual video URL
  const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

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

  // Branching choices later in the video (customize these)
  const branchingChoices: BranchingChoice[] = [
    {
      id: 1,
      time: 15,
      title: 'A mysterious figure approaches...',
      options: [
        { text: 'Confront them directly', isRecommended: personalityAnswers[0] === 'Action and courage' },
        { text: 'Observe from a distance', isRecommended: personalityAnswers[0] === 'Patience and planning' },
        { text: 'Try to communicate peacefully', isRecommended: personalityAnswers[0] === 'Intuition and emotion' },
      ],
    },
    {
      id: 2,
      time: 25,
      title: 'You discover a hidden path...',
      options: [
        { text: 'Take the risky shortcut', isRecommended: personalityAnswers[1] === 'Head-on with confidence' },
        { text: 'Stick to the known route', isRecommended: personalityAnswers[1] === 'Carefully with analysis' },
        { text: 'Explore both options', isRecommended: personalityAnswers[1] === 'Creatively with flexibility' },
      ],
    },
  ];

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);

    // Check for personality questions
    const nextQuestion = personalityQuestions.find(
      (q) => !askedQuestions.has(q.id) && time >= q.time && time < q.time + 0.5
    );

    if (nextQuestion && !showQuestion && !showBranching) {
      setCurrentQuestionIndex(personalityQuestions.indexOf(nextQuestion));
      setShowQuestion(true);
      videoRef.current?.pause();
      setAskedQuestions((prev) => new Set(prev).add(nextQuestion.id));
    }

    // Check for branching choices (only after all personality questions)
    if (personalityAnswers.length === personalityQuestions.length) {
      const nextBranch = branchingChoices.find(
        (b) => !askedBranches.has(b.id) && time >= b.time && time < b.time + 0.5
      );

      if (nextBranch && !showQuestion && !showBranching) {
        setCurrentBranchingIndex(branchingChoices.indexOf(nextBranch));
        setShowBranching(true);
        videoRef.current?.pause();
        setAskedBranches((prev) => new Set(prev).add(nextBranch.id));
      }
    }
  };

  const handleAnswer = (answer: string) => {
    setPersonalityAnswers([...personalityAnswers, answer]);
    setShowQuestion(false);
    setTimeout(() => {
      videoRef.current?.play();
    }, 300);
  };

  const handleBranchChoice = (choiceIndex: number) => {
    console.log('Branch chosen:', choiceIndex);
    setShowBranching(false);
    setTimeout(() => {
      videoRef.current?.play();
    }, 300);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <VideoPlayer
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
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
