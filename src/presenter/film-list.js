import FilmsListView from '../view/films-list';
import ShowMoreButtonView from '../view/show-more-button';
import FilmPresenter from './film';
import LoadingView from '../view/loading';
import {render, remove} from '../utils/render';
import {filter} from '../utils/filter';
import {UpdateTypes, UserActions} from '../const';
import SortView from '../view/sort';
import {SortTypes, RenderPositions} from '../const';
import {sortFilmByPropName} from '../utils/common';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsList {
  constructor(pageMainElement, filterModel, filmsModel, api) {
    this._isLoading = true;
    this._api = api;
    this._currentSortType = SortTypes.DEFAULT;

    this._loadingComponent = new LoadingView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._pageMainElement = pageMainElement;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._filmPresenter = {};

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleChangeFilmMode = this._handleChangeFilmMode.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    render(this._pageMainElement, this._filmsListComponent, RenderPositions.BEFOREEND);

    this._renderFilmsList();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearFilmsList(true);

    remove(this._filmsListComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    render(this._filmsListContainer, this._sortComponent, RenderPositions.BEFORE);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = filter[filterType](this._filmsModel.getFilms());

    switch (this._currentSortType) {
      case SortTypes.DATE:
        return films.slice().sort((firstFilm, secondFilm) => sortFilmByPropName(firstFilm, secondFilm, `releaseDate`));
      case SortTypes.RATING:
        return films.slice().sort((firstFilm, secondFilm) => sortFilmByPropName(firstFilm, secondFilm, `rating`));
      default:
        return films;
    }
  }

  _renderFilmsList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSort();
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
    render(this._filmsListContainer, this._loadingComponent, RenderPositions.AFTERBEGIN);
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent.getElement().querySelector(`.films-list`),
        this._showMoreButtonComponent,
        RenderPositions.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsList(isSortTypeReset) {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);

    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    if (isSortTypeReset) {
      this._currentSortType = SortTypes.DEFAULT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _handleFilmChange(actionType, updateType, film, comment) {
    switch (actionType) {
      case UserActions.UPDATE_FILM_CARD:
        this._api.updateFilm(film)
        .then((response) => {
          this._filmsModel.updateFilmCard(updateType, response);
        });
        break;
      case UserActions.ADD_COMMENT:
        this._api.addComment(film, comment)
        .then((response) => {
          this._filmsModel.updateFilmCard(updateType, response);
        })
        .catch(() => {
          this._filmPresenter[film.id].applyCommentActionFailure(UserActions.ADD_COMMENT, comment);
        });
        break;
      case UserActions.DELETE_COMMENT:
        this._api.deleteComment(comment)
        .then(() => {
          this._filmsModel.updateFilmCard(updateType, film);
        })
        .catch(() => {
          this._filmPresenter[film.id].applyCommentActionFailure(UserActions.DELETE_COMMENT, comment);
        });
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
        this._clearFilmsList(true);
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
