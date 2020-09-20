import CommentsView from '../view/comments';
import {remove, appendChild} from '../utils/render';
import {shake} from '../utils/common';

export default class Comment {
  constructor(commentsContainer, onDeleteComment) {
    this._commentsContainer = commentsContainer;
    this._comment = null;
    this._onDeleteComment = onDeleteComment;
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentsView(this._comment);

    this._commentComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);

    appendChild(this._commentsContainer, this._commentComponent);
  }

  _handleCommentDeleteClick() {
    this._onDeleteComment(
        this._comment
    );
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

  onFailure() {
    shake(this._commentComponent);
    this._commentComponent.setDeleteState();
  }
}
