const filmsToFilterMap = {
  watchlist: (films) => films
        .filter((film) => film.isInWatchlist === true).length,
  history: (tasks) => tasks
      .filter((film) => film.isWatched === true).length,
  favorites: (tasks) => tasks
      .filter((film) => film.isFavorite === true).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
