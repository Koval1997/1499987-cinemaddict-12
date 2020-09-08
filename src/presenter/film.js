import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import CommentsModel from '../model/comments';
import CommentListPresenter from './comments-list';
import {render, RenderPosition, remove, replace} from '../utils/render';
import {Mode, UserAction, UpdateType} from '../const';

export default class FilmPresenter {
  constructor(filmsListContainer, onChangeData, onChangeMode) {
    this._filmsListContainer = filmsListContainer;

    this._filmComponent = null;
    this._filmDetailComponent = null;
    this._commentListPresenter = null;
    this._mode = Mode.DEFAULT;

    this._onChangeData = onChangeData;
    this._onChangeMode = onChangeMode;

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
    this._commentsModel.setComments(this._film.comments);

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailComponent = this._filmDetailComponent;

    this._filmComponent = new FilmCardView(this._film);

    this._filmComponent.setShowDetailsClickHandler(this._handleShowDetailsClick);
    this._filmComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    this._filmDetailComponent = new FilmDetailsView(film);
    this._filmDetailComponent.setClosePopupClickHandler(this._handleClosePopupClick);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    if (prevFilmComponent === null || prevFilmDetailComponent === null) {
      render(this._filmsListContainer, this._filmComponent, RenderPosition.BEFOREEND);
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

  _handleShowDetailsClick() {
    render(this._filmsListContainer, this._filmDetailComponent, RenderPosition.BEFOREEND);
    this._onChangeMode();
    this._mode = Mode.POPUP;

    this._initComments();

    this._filmDetailComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmDetailComponent.restoreHandlers();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _initComments() {
    this._commentsContainer = this._filmDetailComponent.getElement().querySelector(`.film-details__comments-list`);
    this._newCommentContainer = this._filmDetailComponent.getElement().querySelector(`.film-details__comments-wrap`);

    this._commentListPresenter = new CommentListPresenter(this._commentsContainer, this._newCommentContainer, this._film, this._handleCommentListUpdate, this._commentsModel);
    this._commentListPresenter.init(this._film.comments);
  }

  destroy() {
    remove(this._filmComponent);
    this._destroyDetailsComponent();
  }

  _handleCommentListUpdate() {
    this._onChangeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              comments: this._commentsModel.getComments()
            }
        )
    );
  }

  _handleAddToFavoritesClick() {
    this._onChangeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
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
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
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
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isInWatchlist: !this._film.isInWatchlist
            }
        ));
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc` || evt.code === 27) {
      this._handleClosePopupClick();
    }
  }

  _handleClosePopupClick() {
    this._destroyDetailsComponent();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
    this._commentListPresenter.destroy();
    this._commentListPresenter = null;
  }

  _destroyDetailsComponent() {
    const filmPrevState = this._filmDetailComponent.getState();

    this._onChangeData(UserAction.UPDATE_FILM_CARD, UpdateType.PATCH, filmPrevState);

    remove(this._filmDetailComponent);
  }

  resetView() {
    if (this._mode === Mode.POPUP) {
      this._handleClosePopupClick();
    }
  }
}
