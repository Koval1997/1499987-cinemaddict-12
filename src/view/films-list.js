import {createElement} from '../utils';

const createFilmsListContainerTemplate = (title) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">${title}</h2>
        <div class="films-list__container">
        </div>
      </section>
    </section>`
  );
};

export default class FilmsList {
  constructor(title) {
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListContainerTemplate(this._title);
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
