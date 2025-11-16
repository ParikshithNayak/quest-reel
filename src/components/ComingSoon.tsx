import { useEffect, useState } from 'react';

const ComingSoon = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center space-y-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Title */}
        <div className="space-y-4">
          <h2 className="text-6xl font-light tracking-wider text-foreground/90">
            Coming Soon
          </h2>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        
        {/* Subtitle */}
        <p className="text-lg text-muted-foreground font-light tracking-wide">
          Experience awaits
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-30px, 30px) scale(1.1);
          }
        }
        
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
