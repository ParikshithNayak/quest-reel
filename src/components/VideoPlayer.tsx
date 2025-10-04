import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
  isBlurred?: boolean;
}

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, onTimeUpdate, isBlurred = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      getCurrentTime: () => videoRef.current?.currentTime || 0,
    }));

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

    const togglePlay = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    };

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
              <Play className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleMute}
              className="bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-soft"
            >
              <Volume2 className="h-5 w-5" />
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
