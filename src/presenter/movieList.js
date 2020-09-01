import FilmsList from '../view/films-list';
import ShowMoreButton from '../view/show-more-button';
import Movie from './movie';

import {render, RenderPosition, remove} from '../utils/render';
import {updateItem} from '../utils/common';

const FILMS_LIST_TITLE = `All movies. Upcoming`;
const FILM_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(pageMainElement) {
    this._pageMainElement = pageMainElement;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._showMoreButtonComponent = new ShowMoreButton();

    this._filmPresenter = {};

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleChangeFilmMode = this._handleChangeFilmMode.bind(this);
  }

  init(films) {
    this._films = films.slice();

    this._filmsListComponent = new FilmsList(FILMS_LIST_TITLE);
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    render(this._pageMainElement, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderList();
  }

  _renderList() {
    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _renderFilm(film) {
    const filmPresenter = new Movie(this._filmsListContainer, this._handleFilmChange, this._handleChangeFilmMode);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListContainer, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
  }

  _handleChangeFilmMode() {
    Object.values(this._filmPresenter).forEach((filmPresenter) => filmPresenter.resetView());
  }
}
