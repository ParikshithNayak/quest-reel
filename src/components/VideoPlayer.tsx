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
  ({ src, onTimeUpdate, onVideoEnded, isBlurred = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

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

        {/* Controls */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="icon"
              onClick={togglePlay}
              className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleMute}
              className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
