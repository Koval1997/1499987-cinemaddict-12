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
