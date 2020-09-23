import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, comment) {
    this._comments = [
      comment,
      ...this._comments
    ];

    this._notify(updateType, comment);
  }

  deleteComment(updateType, updatedComment) {
    const index = this._comments.findIndex((comment) => comment.id === updatedComment.id);

    if (index === -1) {
      throw new Error(`Comment is not exists`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, updatedComment);
  }
}
