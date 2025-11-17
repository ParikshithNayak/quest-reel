import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SonyPicturesCarousel from '@/components/SonyPicturesCarousel';
import SonyMusicCarousel from '@/components/SonyMusicCarousel';
import PlayStationCarousel from '@/components/PlayStationCarousel';
import StayTuned from '@/components/StayTuned';

interface NavItem {
  id: string;
  title: string;
  image: string;
  content: string;
}

const Navigation = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('item1');
  const [isLoaded, setIsLoaded] = useState(false);

  const navItems: NavItem[] = [
    { id: 'item1', title: 'Sony Pictures', image: '/logos/NavLogo1.png', content: 'Sony Pictures Entertainment - Creating and distributing motion pictures, television programming and other entertainment content worldwide.' },
    { id: 'item2', title: 'Sony Music', image: '/logos/NavLogo2.png', content: 'Sony Music Entertainment - One of the largest music companies in the world, home to countless artists and iconic music labels.' },
    { id: 'item3', title: 'PlayStation', image: '/logos/NavLogo3.png', content: 'PlayStation - Leading gaming brand delivering innovative gaming experiences through consoles, games, and services.' },
    { id: 'item4', title: 'Sony WonderPark', image: '/logos/NavLogo4.png', content: 'Sony WonderPark - An immersive entertainment destination bringing stories to life through innovative experiences.' }
  ];

  const activeContent = navItems.find(item => item.id === activeItem)?.content;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex flex-col md:flex-row relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Left Sidebar - Desktop */}
      <div className="hidden md:block w-80 h-screen p-6 border-r border-border/50 backdrop-blur-sm relative z-10 flex-shrink-0">
        <div className={`h-full flex flex-col gap-3 transition-all duration-1000 ${
          isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}>
          {navItems.map((item, index) => (
            <button
              key={item.id}
              className={`group flex-1 relative overflow-hidden rounded-xl border transition-all duration-500 transform hover:-translate-y-1 ${
                activeItem === item.id 
                  ? 'border-primary shadow-2xl shadow-primary/25 scale-105' 
                  : 'border-border/30 hover:border-primary/50 hover:shadow-lg'
              }`}
              onClick={() => setActiveItem(item.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className={`w-full h-full object-contain p-8 bg-white/10 transition-transform duration-700 ${
                  activeItem === item.id ? 'scale-110' : 'group-hover:scale-105'
                }`}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <span className="text-white font-bold text-lg tracking-wide">{item.title}</span>
              </div>
              
              {/* Active State Overlay */}
              {activeItem === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 animate-pulse" />
              )}
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-accent/10" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full p-4 border-b border-border/50 backdrop-blur-sm relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                activeItem === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card/50 hover:bg-card'
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen md:h-screen p-4 md:p-8 relative z-10 overflow-y-auto md:overflow-hidden">
        <div className={`h-full bg-card/30 backdrop-blur-xl border border-border/30 rounded-2xl p-4 md:p-8 shadow-2xl transition-all duration-700 flex flex-col overflow-visible ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {navItems.find(item => item.id === activeItem)?.title}
            </h1>
          </div>
          
          {/* Content */}
          <div className="mb-4">
            <p className="text-muted-foreground text-base leading-relaxed animate-fade-in">
              {activeContent}
            </p>
          </div>
          
          {/* Sony Pictures Carousel */}
          {activeItem === 'item1' && <SonyPicturesCarousel />}
          
          {/* Sony Music Carousel */}
          {activeItem === 'item2' && <SonyMusicCarousel />}
          
          {/* PlayStation Carousel */}
          {activeItem === 'item3' && <PlayStationCarousel />}
          
          {/* Stay Tuned for WonderPark */}
          {activeItem === 'item4' && <StayTuned />}
        </div>
      </div>
    </div>
  );
};

export default Navigation;