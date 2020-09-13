import moment from 'moment';

const TEXT_FOR_DESCRIPTION_GENERATION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget. 
Fusce tristique felis at fermentum pharetra. 
Aliquam id orci ut lectus varius viverra. 
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. 
Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. 
Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. 
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. 
Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDate = () => {
  const startDate = new Date(1900, 0, 1);
  const endDate = new Date();

  return moment(new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())));
};

export const getRandomDecimal = (min = 0.0, max = 1.0) => {
  return (Math.random() * (max - min) + min).toFixed(1);
};

export const getRandomElemenstFromArray = (array) => {
  const randomSortWriters = array.sort(() => {
    return 0.5 - Math.random();
  });

  const randomLastIndex = getRandomInteger(1, array.length - 1);

  return randomSortWriters.slice(0, randomLastIndex);
};

export const getRandomDescription = () => {
  const parsedText = TEXT_FOR_DESCRIPTION_GENERATION.split(`.`);
  const countOfSentences = getRandomInteger(1, 5);

  return parsedText.splice(0, countOfSentences).join(`.`);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const generateId = () => {
  return Date.now() + parseInt(Math.random() * 10000, 10);
};

export const getProfileRating = (films) => {
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
