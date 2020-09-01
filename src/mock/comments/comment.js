import {commentsData} from './commentsData';
import {getRandomInteger} from '../../utils/common';

export const generateComment = () => {
  const {
    text,
    emotion,
    author,
    date
  } = commentsData[getRandomInteger(0, 3)];


  return {
    text,
    emotion,
    author,
    date
  };
};
