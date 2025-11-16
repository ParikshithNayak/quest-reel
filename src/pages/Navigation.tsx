import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  title: string;
  image: string;
  content: string;
}

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('item1');
  const [isLoaded, setIsLoaded] = useState(false);

  const navItems: NavItem[] = [
    { id: 'item1', title: 'Sony Pictures', image: 'https://logos-world.net/wp-content/uploads/2020/05/Sony-Pictures-Logo.png', content: 'Sony Pictures Entertainment - Creating and distributing motion pictures, television programming and other entertainment content worldwide.' },
    { id: 'item2', title: 'Sony Music', image: 'https://logos-world.net/wp-content/uploads/2020/05/Sony-Music-Logo.png', content: 'Sony Music Entertainment - One of the largest music companies in the world, home to countless artists and iconic music labels.' },
    { id: 'item3', title: 'PlayStation', image: 'https://logos-world.net/wp-content/uploads/2020/05/PlayStation-Logo.png', content: 'PlayStation - Leading gaming brand delivering innovative gaming experiences through consoles, games, and services.' }
  ];

  const activeContent = navItems.find(item => item.id === activeItem)?.content;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-background to-background/80 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Left Sidebar */}
      <div className="w-80 p-6 border-r border-border/50 backdrop-blur-sm relative z-10">
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

      {/* Main Content Area */}
      <div className="flex-1 p-8 relative z-10">
        <div className={`h-full bg-card/30 backdrop-blur-xl border border-border/30 rounded-2xl p-8 shadow-2xl transition-all duration-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {navItems.find(item => item.id === activeItem)?.title}
            </h1>
          </div>
          
          {/* Content */}
          <div>
            <p className="text-muted-foreground text-lg leading-relaxed animate-fade-in">
              {activeContent}
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-primary">{i * 42}</div>
                <div className="text-sm text-muted-foreground">Metric {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;