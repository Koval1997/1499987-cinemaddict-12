import {commentsData} from './commentsData';
import {getRandomInteger, generateId} from '../../utils/common';

export const generateComment = () => {
  const {
    text,
    emoji,
    author,
    date
  } = commentsData[getRandomInteger(0, 3)];


  return {
    id: generateId(),
    text,
    emoji,
    author,
    date
  };
};
