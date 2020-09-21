import AbstractView from './abstract.js';
import NoFilm from './no-film';

export default class FilmsList extends AbstractView {
  constructor(title, filmsCount) {
    super();

    this._title = title;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    const noFilmTemplate = new NoFilm().getTemplate();

    return (
      `<section class="films">
      <section class="films-list">
      ${this._filmsCount === 0
        ? noFilmTemplate
        : `<h2 class="films-list__title visually-hidden">${this._title}</h2>
        <div class="films-list__container">
        </div>
        </div>`
      }
      </section>
    </section>`
    );
  }
}
