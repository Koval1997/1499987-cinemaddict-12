import {getRandomDate} from '../../utils/common';
import {Emoji} from '../../const';

export const commentsData = [{
  text: `Interesting setting and a good cast`,
  emoji: Emoji.SMILE,
  author: `Tim Macoveev`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
},
{
  text: `Booooooooooring`,
  emoji: Emoji.SLEEPING,
  author: `John Doe`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
},
{
  text: `Very very old. Meh`,
  emoji: Emoji.PUKE,
  author: `John Doe`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
},
{
  text: `Almost two hours? Seriously?`,
  emoji: Emoji.ANGRY,
  author: `John Doe`,
  date: getRandomDate().format(`YYYY/MM/DD HH:MM`),
}];
