import MediaCarousel from './MediaCarousel';

const PlayStationCarousel = () => {
  const games = [
    { title: "The Last of Us Part II", image: "https://m.media-amazon.com/images/M/MV5BODIwYWZmYWMtYTliNC00YWQ5LTg5ZmEtNTZhNmUxNjdiMzNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "God of War Ragnarök", image: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png" },
    { title: "Spider-Man 2", image: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560d219ad0b22ee0a263b4537bd8.png" },
    { title: "Horizon Forbidden West", image: "https://i.gadgets360cdn.com/products/large/horizon-forbidden-west-1000x1500-1642581116.jpg" },
    { title: "Gran Turismo 7", image: "https://m.media-amazon.com/images/M/MV5BMDdhMzJhMDAtMzUwNy00NWNmLWEyMjUtZWQ2NGFlYTRiN2JkXkEyXkFqcGc@._V1_.jpg" },
    { title: "Ghost of Tsushima", image: "https://m.media-amazon.com/images/M/MV5BMzVhMGQyM2ItNTVkNi00NDZiLWFiMDMtMTQwOGE3NzQxZmM2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
  ];

  return <MediaCarousel items={games} playableIndex={-1} />;
};

export default PlayStationCarousel;
