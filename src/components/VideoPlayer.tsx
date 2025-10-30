import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props for the VideoPlayer component
 * @param src - URL of the video file to play
 * @param onTimeUpdate - Optional callback fired when video time updates
 * @param onVideoEnded - Optional callback fired when video playback ends
 * @param isBlurred - Whether to apply blur effect to the video (e.g., when showing modals)
 */
interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
  onVideoEnded?: () => void;
  isBlurred?: boolean;
  allowSeeking?: boolean;
}

/**
 * Ref methods exposed by VideoPlayer for external control
 */
export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
}

/**
 * VideoPlayer Component
 * Full-screen video player with custom controls and blur effects
 * Supports play/pause, mute/unmute, fullscreen, and external control via ref
 */
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, onTimeUpdate, onVideoEnded, isBlurred = false, allowSeeking = true }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    // Expose play, pause, getCurrentTime, and seekTo methods to parent components
    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      seekTo: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      },
    }));

    // Listen to video timeupdate events and notify parent component
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
        if (onTimeUpdate) {
          onTimeUpdate(video.currentTime);
        }
        // Update progress bar
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, [onTimeUpdate]);

    // Listen to video ended event and notify parent component
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleEnded = () => {
        if (onVideoEnded) {
          onVideoEnded();
        }
      };

      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }, [onVideoEnded]);

    // Track play/pause state
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }, []);

    // Track mute state
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleVolumeChange = () => setIsMuted(video.muted);

      video.addEventListener('volumechange', handleVolumeChange);
      return () => video.removeEventListener('volumechange', handleVolumeChange);
    }, []);

    // Toggle play/pause state of the video
    const togglePlay = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };

    // Toggle mute/unmute state of the video
    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    };

    // Toggle fullscreen mode for the video container
    const toggleFullscreen = () => {
      if (containerRef.current) {
        if (!document.fullscreenElement) {
          containerRef.current.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    };

    // Handle progress bar seeking
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!videoRef.current || !allowSeeking) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * videoRef.current.duration;

      videoRef.current.currentTime = newTime;
    };

    return (
      <div ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          className={`w-full h-full object-cover transition-all duration-600 ${
            isBlurred ? 'animate-blur-in' : 'animate-blur-out'
          }`}
          autoPlay
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-overlay pointer-events-none" />

        {/* Progress Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-2 bg-white/30 group/progress ${
            allowSeeking ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          {allowSeeking && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="icon"
              onClick={togglePlay}
              className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft h-8 w-8 sm:h-10 sm:w-10"
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleMute}
              className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft h-8 w-8 sm:h-10 sm:w-10"
            >
              {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft h-8 w-8 sm:h-10 sm:w-10"
          >
            <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
