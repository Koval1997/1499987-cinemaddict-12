import {getRandomDate} from '../../utils/common';

export const commentsData = [{
  text: `Interesting setting and a good cast`,
  emotion: `/images/emoji/smile.png`,
  author: `Tim Macoveev`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
},
{
  text: `Booooooooooring`,
  emotion: `./images/emoji/sleeping.png`,
  author: `John Doe`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
},
{
  text: `Very very old. Meh`,
  emotion: `./images/emoji/puke.png`,
  author: `John Doe`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
},
{
  text: `Almost two hours? Seriously?`,
  emotion: `/images/emoji/angry.png`,
  author: `John Doe`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
}];
