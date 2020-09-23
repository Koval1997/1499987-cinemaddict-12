import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import CommentsModel from '../model/comments';
import CommentListPresenter from './comments-list';
import {render, remove, replace} from '../utils/render';
import {Modes, UserActions, UpdateTypes, RenderPositions} from '../const';

export default class Film {
  constructor(filmsListContainer, onChangeData, onChangeModes, api) {
    this._filmsListContainer = filmsListContainer;

    this._api = api;

    this._filmComponent = null;
    this._filmDetailComponent = null;
    this._commentListPresenter = null;
    this._mode = Modes.DEFAULT;

    this._onChangeData = onChangeData;
    this._onChangeModes = onChangeModes;

    this._handleShowDetailsClick = this._handleShowDetailsClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
    this._handleCommentListUpdate = this._handleCommentListUpdate.bind(this);

    this._bodyElement = document.body;

    this._commentsModel = new CommentsModel();
  }

  init(film) {
    this._film = film;
    this._api.getComments(this._film.id)
      .then((comments) => this._commentsModel.setComments(comments));

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailComponent = this._filmDetailComponent;

    this._filmComponent = new FilmCardView(this._film);

    this._filmComponent.setShowDetailsClickHandler(this._handleShowDetailsClick);
    this._filmComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    this._filmDetailComponent = new FilmDetailsView(film);
    this._filmDetailComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmDetailComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._filmDetailComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmDetailComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    if (prevFilmComponent === null || prevFilmDetailComponent === null) {
      render(this._filmsListContainer, this._filmComponent, RenderPositions.BEFOREEND);
      return;
    }

    if (prevFilmDetailComponent !== null) {
      this._initComments();
    }

    replace(this._filmComponent, prevFilmComponent);
    replace(this._filmDetailComponent, prevFilmDetailComponent);

    remove(prevFilmComponent);
    remove(prevFilmDetailComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  resetView() {
    if (this._mode === Modes.POPUP) {
      this._handleClosePopupClick();
    }
  }

  applyCommentActionFailure(actionType, comment) {
    this._commentListPresenter.applyCommentActionFailure(actionType, comment);
  }

  _destroyDetailsComponent() {
    const filmPrevState = this._filmDetailComponent.getState();

    this._onChangeData(UserActions.UPDATE_FILM_CARD, UpdateTypes.PATCH, filmPrevState);

    remove(this._filmDetailComponent);
  }

  _initComments() {
    this._commentsContainer = this._filmDetailComponent.getElement().querySelector(`.film-details__comments-list`);
    this._newCommentContainer = this._filmDetailComponent.getElement().querySelector(`.film-details__comments-wrap`);

    this._commentListPresenter = new CommentListPresenter(this._commentsContainer, this._newCommentContainer, this._film, this._handleCommentListUpdate, this._commentsModel);
    this._api.getComments(this._film.id)
      .then((comments) => this._commentListPresenter.init(comments));
  }

  _handleShowDetailsClick() {
    render(this._filmsListContainer, this._filmDetailComponent, RenderPositions.BEFOREEND);
    this._onChangeModes();
    this._mode = Modes.POPUP;

    if (!this._commentListPresenter) {
      this._initComments();
    }

    this._filmDetailComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmDetailComponent.restoreHandlers();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleCommentListUpdate(userAction, updateTypes, film, newComment) {
    this._onChangeData(
        userAction,
        updateTypes,
        film,
        newComment
    );
  }

  _handleAddToFavoritesClick() {
    this._onChangeData(
        UserActions.UPDATE_FILM_CARD,
        UpdateTypes.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        ));
  }

  _handleAlreadyWatchedClick() {
    this._onChangeData(
        UserActions.UPDATE_FILM_CARD,
        UpdateTypes.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        ));
  }

  _handleAddToWatchlistClick() {
    this._onChangeData(
        UserActions.UPDATE_FILM_CARD,
        UpdateTypes.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isInWatchlist: !this._film.isInWatchlist
            }
        ));
  }

  _handleClosePopupClick() {
    this._destroyDetailsComponent();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._commentListPresenter.destroy();
    this._commentListPresenter = null;
    this._mode = Modes.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc` || evt.code === 27) {
      this._handleClosePopupClick();
    }
  }
}
