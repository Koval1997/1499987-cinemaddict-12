import {FilterTypes} from '../const';

export const filter = {
  [FilterTypes.ALL]: (films) => films,
  [FilterTypes.WATCHLIST]: (films) => films.filter((film) => film.isInWatchlist),
  [FilterTypes.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterTypes.FAVORITES]: (films) => films.filter((film) => film.isFavorite)
};
