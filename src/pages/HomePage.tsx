import { Button } from '@/components/ui/button';
import { Play, Headphones } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/videoplayer')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-slate-900 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display tracking-tight text-foreground">
              Interactive Story
            </h1>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-display tracking-tight bg-gradient-to-r from-primary via-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Experience
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your choices shape the narrative. Every decision reveals your personality.
            How will your story unfold?
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={handleStart}
              className="w-64 h-16 text-xl group"
              data-testid="button-start"
            >
              <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Begin Your Story
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground pt-12">
            <Headphones className="w-5 h-5" />
            <span className="text-sm">Headphones recommended for best experience</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
          Inspired by interactive narratives
        </p>
      </div>
    </div>
  );
}
