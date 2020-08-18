import {commentsData} from './commentsData';
import {getRandomInteger, getRandomDate} from '../../utils/common';

export const generateComment = () => {
  const {
    text,
    emotion,
    author
  } = commentsData[getRandomInteger(0, 3)];

  const date = getRandomDate().format(`YYYY/MM/DD HH:MM`);

  return {
    text,
    emotion,
    author,
    date
  };
};
