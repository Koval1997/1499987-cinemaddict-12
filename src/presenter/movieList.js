import FilmsList from '../view/films-list';
import FilmCard from '../view/film-card';
import FilmDetails from '../view/film-details';
import ShowMoreButton from '../view/show-more-button';
import {render, RenderPosition, remove} from '../utils/render';

const FILMS_LIST_TITLE = `All movies. Upcoming`;
const FILM_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(pageMainElement) {
    this._pageMainElement = pageMainElement;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmsListComponent = new FilmsList(FILMS_LIST_TITLE);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

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
    const filmComponent = new FilmCard(film);
    const filmDetailComponent = new FilmDetails(film);
    const bodyElement = document.querySelector(`body`);

    const openPopup = () => {
      bodyElement.appendChild(filmDetailComponent.getElement());
    };

    const closePopup = () => {
      bodyElement.removeChild(filmDetailComponent.getElement());
    };

    filmComponent.setShowDetailsClickHandler(() => {
      openPopup();
    });

    filmDetailComponent.setClosePopupClickHandler(() => {
      closePopup();
    });

    const filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    render(filmsListContainer, filmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
