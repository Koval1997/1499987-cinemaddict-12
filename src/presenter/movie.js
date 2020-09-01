import FilmCard from '../view/film-card';
import FilmDetails from '../view/film-details';
import NewCommentView from "../view/new-comment";
import {render, RenderPosition, remove, replace, appendChild} from '../utils/render';

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Movie {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;

    this._filmComponent = null;
    this._filmDetailComponent = null;
    this._newCommentComponent = null;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._handleShowDetailsClick = this._handleShowDetailsClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);

    this._bodyElement = document.body;
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailComponent = this._filmDetailComponent;

    this._mode = Mode.DEFAULT;

    this._filmComponent = new FilmCard(film);
    this._filmDetailComponent = new FilmDetails(film);
    this._newCommentComponent = new NewCommentView();

    this._filmComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._filmComponent.setShowDetailsClickHandler(this._handleShowDetailsClick);

    this._filmDetailComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmDetailComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._filmDetailComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmDetailComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    const newCommentContainer = this._filmDetailComponent.getElement().querySelector(`.film-details__comments-wrap`);

    if (prevFilmComponent === null || prevFilmDetailComponent === null) {
      render(this._filmsListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      appendChild(newCommentContainer, this._newCommentComponent);
      return;
    }

    if (this._filmsListContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._bodyElement.contains(prevFilmDetailComponent.getElement())) {
      replace(this._filmDetailComponent, prevFilmDetailComponent);
      appendChild(newCommentContainer, this._newCommentComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailComponent);
  }

  _handleAddToFavoritesClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        ));
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        ));
  }

  _handleAddToWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isInWatchlist: !this._film.isInWatchlist
            }
        ));
  }

  _handleShowDetailsClick() {
    this._bodyElement.appendChild(this._filmDetailComponent.getElement());
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _handleClosePopupClick() {
    this._bodyElement.removeChild(this._filmDetailComponent.getElement());
    this._mode = Mode.DEFAULT;
    this._changeData(this._film);
  }

  resetView() {
    if (this._mode === Mode.POPUP) {
      this._handleClosePopupClick();
    }
  }
}
