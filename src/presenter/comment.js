import CommentsView from '../view/comments';
import {remove, appendChild} from '../utils/render';
import {shakeElement} from '../utils/common';

export default class Comment {
  constructor(commentsContainer, onDeleteComment) {
    this._commentsContainer = commentsContainer;
    this._onDeleteComment = onDeleteComment;
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentsView(this._comment);
    this._commentComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);
    appendChild(this._commentsContainer, this._commentComponent);
  }

  setDeletingState() {
    return this._commentComponent.setDeletingState();
  }

  setDeleteState() {
    return this._commentComponent.setDeleteState();
  }

  destroy() {
    remove(this._commentComponent);
  }

  applyDeleteFailureEffect() {
    shakeElement(this._commentComponent);
    this._commentComponent.setDeleteState();
  }

  _handleCommentDeleteClick() {
    this._onDeleteComment(
        this._comment
    );
  }
}
