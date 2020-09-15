import FilmsListView from '../view/films-list';
import ShowMoreButtonView from '../view/show-more-button';
import FilmPresenter from './film';
import LoadingView from '../view/loading';
import {render, RenderPosition, remove} from '../utils/render';
import {filter} from '../utils/filter';
import {UpdateTypes, UserActions} from '../const';

const FILM_COUNT_PER_STEP = 5;

export default class FilmListPresenter {
  constructor(pageMainElement, filterModel, filmsModel, api) {
    this._isLoading = true;
    this._api = api;

    this._loadingComponent = new LoadingView();

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._pageMainElement = pageMainElement;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._filmsListComponent = new FilmsListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._filmPresenter = {};

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleChangeFilmMode = this._handleChangeFilmMode.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    render(this._pageMainElement, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmsList();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();

    return filter[filterType](films);
  }

  _renderFilmsList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderFilms(0, Math.min(this._getFilms().length, this._renderedFilmsCount));

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilms(from, to) {
    this._getFilms()
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmChange, this._handleChangeFilmMode, this._api);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderLoading() {
    render(this._filmsListContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _handleFilmChange(actionType, updateType, update) {
    switch (actionType) {
      case UserActions.UPDATE_FILM_CARD:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilmCard(updateType, response);
        });
        break;
      case UserActions.ADD_COMMENT:
        this._filmsModel.updateFilmCard(updateType, update);
        break;
      case UserActions.DELETE_COMMENT:
        this._filmsModel.updateFilmCard(updateType, update);
        break;
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._getFilms().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent.getElement().querySelector(`.films-list`), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
  }

  _handleChangeFilmMode() {
    Object.values(this._filmPresenter).forEach((filmPresenter) => filmPresenter.resetView());
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateTypes.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateTypes.MINOR:
        this._clearFilmList();
        this._renderFilmsList();
        break;
      case UpdateTypes.MAJOR:
        this._clearFilmsList();
        this._renderFilmsList();
        break;
      case UpdateTypes.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsList();
        break;
    }
  }
}
