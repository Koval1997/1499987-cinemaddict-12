import moment from 'moment';
import {SHAKE_TIMEOUT_INTERVAL} from '../const';

export const getUserRank = (films) => {
  const watchedFilmsCount = getWatchedFilmsCount(films);

  switch (true) {
    case (watchedFilmsCount >= 1 && watchedFilmsCount <= 10):
      return `Novice`;
    case (watchedFilmsCount >= 11 && watchedFilmsCount <= 20):
      return `Fan`;
    case (watchedFilmsCount >= 21):
      return `Movie Buff`;
    default:
      return ``;
  }
};

export const getDurationFormat = (duration) => {
  duration = moment.duration(duration, `minutes`);
  const hours = `${duration.hours() > 0 ? `${duration.hours()}h` : ``}`;
  const minutes = `${duration.minutes() > 0 ? `${duration.minutes()}m` : ``}`;

  return `${hours} ${minutes}`;
};

export const getWatchedFilmsCount = (films) => {
  return films.filter((film) => film.isWatched).length;
};

export const sortFilmByPropName = (firstFilm, secondFilm, propName) => {
  if (firstFilm[propName] > secondFilm[propName]) {
    return -1;
  }
  if (firstFilm[propName] < secondFilm[propName]) {
    return 1;
  }

  return 0;
};

export const shake = (element) => {
  element.getElement().style.animation = `shake ${SHAKE_TIMEOUT_INTERVAL / 1000}s`;
  setTimeout(() => {
    element.getElement().style.animation = ``;
  }, SHAKE_TIMEOUT_INTERVAL);
};
