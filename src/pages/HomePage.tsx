import { Button } from '@/components/ui/button';
import { Play, Headphones } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// import TextPressure from '@/components/TextPressure';
import SphereImageGrid, { ImageData } from '@/components/SphereImageGrid';

export default function HomePage() {

  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/videoplayer')
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
  ];

  const sonyMovies: ImageData[] = [];
  for (let i = 0; i < 60; i++) {
    const baseIndex = i % BASE_IMAGES.length;
    const baseImage = BASE_IMAGES[baseIndex];
    sonyMovies.push({ id: `movie-${i + 1}`, ...baseImage });
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-background via-slate-900 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
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

        <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 w-full max-w-7xl mx-auto">
          <div className="order-1 lg:order-1 flex justify-center w-full overflow-visible -mb-12 lg:mb-0">
            <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
              <SphereImageGrid 
                images={sonyMovies}
                containerSize={600}
                sphereRadius={200}
                dragSensitivity={0.8}
                momentumDecay={0.96}
                maxRotationSpeed={6}
                baseImageScale={0.13}
                hoverScale={1.3}
                perspective={1000}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </div>
          </div>
          <div className="order-2 lg:order-2 max-w-xl space-y-6 px-2">
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Sony's Cinematic Legacy
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For over three decades, Sony Pictures has been at the forefront of cinematic innovation, 
              bringing unforgettable stories to life on the big screen. From the web-slinging adventures 
              of Spider-Man to the mind-bending animation of Spider-Verse, Sony has consistently pushed 
              the boundaries of storytelling and visual effects.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With blockbuster franchises like Venom, Jumanji, and Ghostbusters, Sony Pictures continues 
              to captivate audiences worldwide, blending cutting-edge technology with compelling narratives 
              that resonate across generations.
            </p>
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
