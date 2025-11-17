import MediaCarousel from './MediaCarousel';

const SonyPicturesCarousel = () => {
  const movies = [
    { title: "The Spider Within: A Spider-Verse Story", image: "https://m.media-amazon.com/images/M/MV5BMjgyNDhlZmItYWRlNi00Y2NmLWFmYTgtZWJkYWE3M2IyZmVkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    { title: "Spider-Man: Across the Spider-Verse", image: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
    { title: "Skyfall", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3QjxC_sCvc7IixN0MjBoiflaEXbQMhtiS3_B55DFFX28_qvwAfNn9fkcsaUshdibolXaZpA&s=10" },
    { title: "Venom: Let There Be Carnage", image: "https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg" },
    { title: "Jumanji", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsDhg4E9M91oy7j_TCUukcaRvMmkYUz7rIh0yitZ756YUCDl2Xl7D94QB0hWXI-GBT5QEF&s=10" },
    { title: "Uncharted", image: "https://alumni.risd.edu/sites/default/files/2022-06/Uncharted_web.jpg" }
  ];

  return <MediaCarousel items={movies} playableIndex={0} playableHref="/videoplayer" />;
};

export default SonyPicturesCarousel;
