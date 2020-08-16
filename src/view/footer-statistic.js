import {createElement} from '../utils';

const createFilmsCountTemplate = (filmsCount) => {
  return (
    `<section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
      </section>`
  );
};

export default class FooterStatistic {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
