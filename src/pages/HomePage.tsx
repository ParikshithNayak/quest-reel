import { Button } from '@/components/ui/button';
import { Sparkles, Headphones, User, LayoutDashboard } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import SphereImageGrid, { ImageData } from '@/components/SphereImageGrid';
import TextType from '@/components/TextType';

export default function HomePage() {

  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/navigation')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
    { src: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", alt: "Spider-Man: No Way Home", title: "Spider-Man: No Way Home", description: "2021 - Action, Adventure, Science Fiction" },
    { src: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", alt: "Spider-Man: Into the Spider-Verse", title: "Spider-Man: Into the Spider-Verse", description: "2018 - Animation, Action, Adventure" },
    { src: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg", alt: "Venom", title: "Venom", description: "2018 - Science Fiction, Action" },
    { src: "https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg", alt: "Venom: Let There Be Carnage", title: "Venom: Let There Be Carnage", description: "2021 - Science Fiction, Action, Thriller" },
    { src: "https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg", alt: "Jumanji: Welcome to the Jungle", title: "Jumanji: Welcome to the Jungle", description: "2017 - Adventure, Comedy, Fantasy" },
    { src: "https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg", alt: "Jumanji: The Next Level", title: "Jumanji: The Next Level", description: "2019 - Adventure, Comedy, Fantasy" },
    { src: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", alt: "The Amazing Spider-Man", title: "The Amazing Spider-Man", description: "2012 - Action, Adventure, Fantasy" },
    { src: "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg", alt: "The Amazing Spider-Man 2", title: "The Amazing Spider-Man 2", description: "2014 - Action, Adventure, Fantasy" },
    { src: "https://image.tmdb.org/t/p/w500/fPtlCO1yQtnoLHOwKtWz7db6RGU.jpg", alt: "Ghostbusters: Afterlife", title: "Ghostbusters: Afterlife", description: "2021 - Fantasy, Comedy, Adventure" },
    { src: "https://image.tmdb.org/t/p/w500/wRbjVBdDo5qHAEOVYoMWpM58FSA.jpg", alt: "Men in Black: International", title: "Men in Black: International", description: "2019 - Comedy, Science Fiction, Action" },
    { src: "https://image.tmdb.org/t/p/w500/db32LaOibwEliAmSL2jjDF6oDdj.jpg", alt: "Spider-Man: Homecoming", title: "Spider-Man: Homecoming", description: "2017 - Action, Adventure, Science Fiction" },
    { src: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", alt: "Spider-Man: Far From Home", title: "Spider-Man: Far From Home", description: "2019 - Action, Adventure, Science Fiction" },
    { src: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", alt: "Morbius", title: "Morbius", description: "2022 - Action, Science Fiction, Fantasy" },
    { src: "https://image.tmdb.org/t/p/w500/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg", alt: "Uncharted", title: "Uncharted", description: "2022 - Action, Adventure" },
    { src: "https://media.themoviedb.org/t/p/w440_and_h660_face/j8szC8OgrejDQjjMKSVXyaAjw3V.jpg", alt: "Bullet Train", title: "Bullet Train", description: "2022 - Action, Comedy, Thriller" },
    { src: "/logos/SonyFinal.jpg", alt: "Sony", title: "Sony" },
    { src: "/logos/Picture1use.jpg", alt: "Sony Pictures", title: "Sony Pictures" },
    { src: "/logos/Picture2.png", alt: "PlayStation", title: "PlayStation" },
    { src: "/logos/Picture3.png", alt: "Sony Music", title: "Sony Music" },
  ];

  const sonyMovies: ImageData[] = [];
  for (let i = 0; i < 150; i++) {
    const baseIndex = i % BASE_IMAGES.length;
    const baseImage = BASE_IMAGES[baseIndex];
    sonyMovies.push({ id: `movie-${i + 1}`, ...baseImage });
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-slate-900 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      {/* Login Button - Top Right */}
      <div className="absolute top-6 right-14 z-30">
        <Button
          size="sm"
          variant="outline"
          className="group transition-all duration-300 hover:scale-105"
        >
          <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          Log In / Sign Up
        </Button>
      </div>



      {/* Mobile Layout */}
      <div className="relative z-10 flex flex-col min-h-screen md:hidden pt-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="scale-[0.35] sm:scale-[0.4]">
            <SphereImageGrid 
              images={sonyMovies}
              containerSize={750}
              sphereRadius={500}
              dragSensitivity={0.8}
              momentumDecay={0.96}
              maxRotationSpeed={6}
              baseImageScale={0.14}
              hoverScale={1.3}
              perspective={1000}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </div>
        </div>
        
        <div className="space-y-4 animate-fade-in text-center px-6 pb-12">
          <img 
            src="/logos/TransparentSideBySideRealInReelLogo.png" 
            alt="Sony x Real in Reel" 
            className="h-12 sm:h-14 w-auto mx-auto mb-6"
          />
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display tracking-tight text-foreground">
              SONY's
            </h1>
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight bg-gradient-to-r from-primary via-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Interactive Platform
            </h2>
          </div>

          <TextType 
            text={["Your choices shape the narrative.", "Every decision reveals your personality.", "How will your story unfold?"]}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
          />

          <Button
            size="lg"
            onClick={handleStart}
            className="w-full max-w-xs mx-auto h-12 sm:h-14 text-base sm:text-lg group transition-all duration-300 hover:scale-105"
            data-testid="button-start"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Explore Creativity
          </Button>

          <Button
            size="sm"
            onClick={handleDashboard}
            variant="outline"
            className="w-full max-w-xs mx-auto text-sm group transition-all duration-300 hover:scale-105"
          >
            <LayoutDashboard className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Go to Dashboard
          </Button>

          <div className="flex items-center justify-center gap-2 text-muted-foreground pt-2">
            <Headphones className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Headphones recommended</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 hidden md:flex items-center min-h-screen pt-20">
        <div className="w-full grid grid-cols-10 gap-8 px-14">
          <div className="col-span-2"></div>
          <div className="col-span-3 flex items-center justify-center"></div>
          
          <div className="col-span-5 flex items-center justify-end">
            <div className="max-w-2xl space-y-8 animate-fade-in text-right">
              <img 
                src="/logos/TransparentSideBySideRealInReelLogo.png" 
                alt="Sony x Real in Reel" 
                className="h-16 md:h-20 w-auto ml-auto mb-0"
              />
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-foreground">
                  SONY's
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight bg-gradient-to-r from-primary via-cyan-500 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
                  Interactive Platform
                </h2>
              </div>

              <TextType 
                text={["Your choices shape the narrative.", "Every decision reveals your personality.", "How will your story unfold?"]}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              />

              <div className="flex flex-col gap-6 items-end pt-4">
                <Button
                  size="sm"
                  onClick={handleStart}
                  className="w-48 text-sm group transition-all duration-300 hover:scale-105"
                  data-testid="button-start"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Explore Creativity
                </Button>
                <Button
                  size="sm"
                  onClick={handleDashboard}
                  variant="outline"
                  className="w-48 text-sm group transition-all duration-300 hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Go to Dashboard
                </Button>
              </div>

              <div className="flex items-center justify-end gap-2 text-muted-foreground pt-8">
                <Headphones className="w-5 h-5" />
                <span className="text-sm">Headphones recommended for best experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sphere - Desktop only */}
      <div className="hidden md:block absolute top-1/2 left-[16.66%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
        <div className="scale-[0.5] md:scale-[0.6] lg:scale-[0.7]">
          <SphereImageGrid 
            images={sonyMovies}
            containerSize={750}
            sphereRadius={500}
            dragSensitivity={0.8}
            momentumDecay={0.96}
            maxRotationSpeed={6}
            baseImageScale={0.14}
            hoverScale={1.3}
            perspective={1000}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </div>
      </div>


    </div>
  );
}
