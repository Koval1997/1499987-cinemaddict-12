import AbstractView from "./abstract.js";

const createFilmCardTemplate = (film) => {
  const {
    name,
    rating,
    duration,
    posterSrc,
    description,
    releaseDate,
    comments,
    isInWatchlist,
    isWatched,
    isFavorite
  } = film;

  const releaseYear = releaseDate.format(`YYYY`);
  const commentsCount = comments.length;

  let descriptionText = description;

  if (description.length > 140) {
    descriptionText = description.slice(0, 138).concat(`...`);
  }

  return (
    `<article class="film-card">
        <h3 class="film-card__title">${name}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseYear}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">Musical</span>
        </p>
        <img src=${posterSrc} alt="" class="film-card__poster">
        <p class="film-card__description">${descriptionText}</p>
        <a class="film-card__comments">${commentsCount} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${getControlButtonActiveClass(isInWatchlist)}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${getControlButtonActiveClass(isWatched)}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${getControlButtonActiveClass(isFavorite)}">Mark as favorite</button>
        </form>
      </article>`
  );
};

const getControlButtonActiveClass = (isMarked) => {
  return isMarked
    ? `film-card__controls-item--active`
    : ``;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._detailsClickHandler = this._detailsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _detailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.showDetailsClick();
  }

  setShowDetailsClickHandler(callback) {
    this._callback.showDetailsClick = callback;

    [
      this.getElement().querySelector(`.film-card__poster`),
      this.getElement().querySelector(`.film-card__title`),
      this.getElement().querySelector(`.film-card__comments`)
    ].map((element) => element.addEventListener(`click`, this._detailsClickHandler));
  }
}
