import MediaCarousel from './MediaCarousel';

const SonyMusicCarousel = () => {
  const albums = [
    { title: "Dynamite", image: "https://m.media-amazon.com/images/M/MV5BZDJiZTExYjAtOWRjNi00OWEyLWI2OWQtMDg0YWRlYWUyNzVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "APT.", image: "https://upload.wikimedia.org/wikipedia/en/5/52/Ros%C3%A9_and_Bruno_Mars_-_Apt..png" },
    { title: "Stay", image: "https://i.pinimg.com/736x/a7/d2/74/a7d2749f4b63181f44afa5d3809494d4.jpg" },
    { title: "As It Was", image: "https://m.media-amazon.com/images/I/6188VSO4vKL.jpg" },
    { title: "Am I Dreaming", image: "https://i1.sndcdn.com/artworks-QQKaeCwnyXWiJA24-qyda4Q-t500x500.jpg" },
    { title: "Someone Like You", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB4xlA-cMht8DLi6VARNwAJ-fj95HvCu5LpQ&s" }
  ];

  return <MediaCarousel items={albums} playableIndex={-1} />;
};

export default SonyMusicCarousel;
