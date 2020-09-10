import CommentPresenter from './comment';
import NewCommentView from '../view/new-comment';
import {appendChild, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class CommentList {
  constructor(commentsContainer, newCommentContainer, film, onChangeData, commentsModel) {
    this._commentsContainer = commentsContainer;
    this._newCommentContainer = newCommentContainer;
    this._film = film;
    this._onChangeData = onChangeData;
    this._commentsModel = commentsModel;
    this._commentPresenter = {};

    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
  }

  init(comments) {
    this._commentsModel.setComments(comments);
    this.renderCommentsList();

    this._newCommentComponent = new NewCommentView();
    appendChild(this._newCommentContainer, this._newCommentComponent);
    this._newCommentComponent.setSubmitCommentHandler(this._handleCommentSubmit);
  }

  _renderComment(comment) {
    this._comment = comment;
    const commentPresenter = new CommentPresenter(this._commentsContainer, this._handleCommentDeleteClick);
    commentPresenter.init(this._comment);
    this._commentPresenter[this._comment.id] = commentPresenter;
  }

  _handleCommentDeleteClick(comment) {
    this._commentsModel.deleteComment(UpdateType.PATCH, comment);
    this._commentPresenter[comment.id].destroy();

    this._onChangeData(
        UserAction.DELETE_COMMENT,
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

  _handleCommentSubmit() {
    this._commentsModel.addComment(UpdateType.PATCH, this._newCommentComponent.getNewComment());

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

  _renderComments(comments) {
    comments.forEach((comment) => this._renderComment(comment));
  }

  renderCommentsList() {
    const comments = this._commentsModel.getComments();
    this._renderComments(comments);
  }

  destroy() {
    remove(this._newCommentComponent);

    Object
        .values(this._commentPresenter)
        .forEach((presenter) => presenter.destroy());
    this._commentPresenter = {};
  }
}
