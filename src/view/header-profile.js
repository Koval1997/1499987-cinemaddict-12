import AbstractView from './abstract.js';
import {getUserRank} from '../utils/common';

export default class HeaderProfile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    const userRank = getUserRank(this._films);

    return (
      `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
    );
  }
}
