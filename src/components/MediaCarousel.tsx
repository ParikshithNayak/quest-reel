import { useRef } from 'react';
import { PinContainer } from '@/components/ui/3d-pin';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface MediaItem {
  title: string;
  image: string;
}

interface MediaCarouselProps {
  items: MediaItem[];
  playableIndex?: number;
  playableHref?: string;
}

const MediaCarousel = ({ items, playableIndex = 0, playableHref }: MediaCarouselProps) => {
  const autoplayRef = useRef(Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }));

  return (
    <div className="flex-1 flex items-center justify-center overflow-visible">
      <Carousel 
        className="w-full max-w-4xl"
        opts={{ loop: true }}
        plugins={[autoplayRef.current]}
      >
        <CarouselContent className="-ml-4">
          {items.map((item, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="flex items-center justify-center py-20">
                <PinContainer
                  title={index === playableIndex ? "Play Now" : "Coming Soon ..."}
                  href={index === playableIndex ? playableHref : undefined}
                >
                  <div className="w-[200px]">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-[280px] object-cover rounded-lg"
                    />
                  </div>
                </PinContainer>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default MediaCarousel;
