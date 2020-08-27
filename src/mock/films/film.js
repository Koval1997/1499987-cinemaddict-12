import {
  filmsData,
  directorsList,
  writersList,
  actorsList,
  genresList,
  countriesList
} from './filmsData';

import {
  getRandomInteger,
  getRandomDate,
  getRandomDecimal,
  getRandomElemenstFromArray,
  getRandomDescription,
  generateId
} from '../../utils/common.js';

import {generateComment} from '../comments/comment';

export const generateFilm = () => {
  const {
    posterSrc,
    name,
    originalName,
    duration
  } = filmsData[getRandomInteger(0, 4)];

  const description = getRandomDescription();
  const ageRating = `${getRandomInteger(3, 18)}+`;
  const rating = getRandomDecimal(1.0, 10.0);
  const director = getRandomElemenstFromArray(directorsList)[0];
  const writers = getRandomElemenstFromArray(writersList);
  const actors = getRandomElemenstFromArray(actorsList);
  const releaseDate = getRandomDate();
  const country = getRandomElemenstFromArray(countriesList)[0];
  const genres = getRandomElemenstFromArray(genresList);
  const isWatched = Boolean(getRandomInteger(0, 1));
  const isInWatchlist = isWatched ? false : Boolean(getRandomInteger(0, 1));
  const isFavorite = Boolean(getRandomInteger(0, 1));
  const comments = [];

  for (let i = 0; i < getRandomInteger(0, 3); i++) {
    comments.push(generateComment());
  }

  return {
    id: generateId(),
    posterSrc,
    name,
    originalName,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    duration,
    country,
    genres,
    description,
    ageRating,
    comments,
    isWatched,
    isInWatchlist,
    isFavorite
  };
};
