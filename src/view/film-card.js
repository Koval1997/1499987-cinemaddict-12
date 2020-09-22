import AbstractView from './abstract.js';
import moment from 'moment';
import {getDurationFormat} from '../utils/common';

const MAX_DESCRIPTION_LENGTH = 140;
const CUTED_DESCRIPTION_LENGTH = 138;

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._detailsClickHandler = this._detailsClickHandler.bind(this);
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._addToFavoritesClickHandler = this._addToFavoritesClickHandler.bind(this);
  }

  getTemplate() {
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
      isFavorite,
      genres
    } = this._film;

    const releaseYear = moment(releaseDate).format(`YYYY`);
    const commentsCount = comments.length;

    let descriptionText = description;

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      descriptionText = description.slice(0, CUTED_DESCRIPTION_LENGTH).concat(`...`);
    }

    const formattedDuration = getDurationFormat(duration);

    return (
      `<article class="film-card">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseYear}</span>
            <span class="film-card__duration">${formattedDuration}</span>
            <span class="film-card__genre">${genres.length ? genres[0] : ``}</span>
          </p>
          <img src=${posterSrc} alt="" class="film-card__poster">
          <p class="film-card__description">${descriptionText}</p>
          <a class="film-card__comments">${commentsCount} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._getControlButtonActiveClass(isInWatchlist)}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._getControlButtonActiveClass(isWatched)}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._getControlButtonActiveClass(isFavorite)}">Mark as favorite</button>
          </form>
        </article>`
    );
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;

    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._alreadyWatchedClickHandler);
  }

  setAddToFavoritesClickHandler(callback) {
    this._callback.addToFavoritesClick = callback;

    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._addToFavoritesClickHandler);
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;

    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._addToWatchlistClickHandler);
  }

  setShowDetailsClickHandler(callback) {
    this._callback.showDetailsClick = callback;

    [
      this.getElement().querySelector(`.film-card__poster`),
      this.getElement().querySelector(`.film-card__title`),
      this.getElement().querySelector(`.film-card__comments`)
    ].map((element) => element.addEventListener(`click`, this._detailsClickHandler));
  }

  _getControlButtonActiveClass(isMarked) {
    return isMarked
      ? `film-card__controls-item--active`
      : ``;
  }

  _addToWatchlistClickHandler(evt) {
    evt.preventDefault();

    this._callback.watchlistClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();

    this._callback.alreadyWatchedClick();
  }

  _addToFavoritesClickHandler(evt) {
    evt.preventDefault();

    this._callback.addToFavoritesClick();
  }

  _detailsClickHandler(evt) {
    evt.preventDefault();

    this._callback.showDetailsClick();
  }
}
