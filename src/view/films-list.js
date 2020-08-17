import AbstractView from "./abstract.js";

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

export default class FilmsList extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createFilmsListContainerTemplate(this._title);
  }
}
