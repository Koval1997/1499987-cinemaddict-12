import AbstractView from './abstract';
import he from 'he';
import moment from "moment";

const DeleteButtonTexts = {
  DELETING: `Deleting...`,
  DELETE: `Delete`
};

export default class Comments extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  getTemplate() {
    const {id, emotion, comment, author, date} = this._comment;

    const formattedDate = moment(date).fromNow();

    return `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src=/images/emoji/${emotion}.png width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formattedDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }

  setDeletingState() {
    const deleteButton = this.getElement().querySelector(`.film-details__comment-delete`);
    deleteButton.textContent = DeleteButtonTexts.DELETING;
    deleteButton.disabled = true;
  }

  setDeleteState() {
    const deleteButton = this.getElement().querySelector(`.film-details__comment-delete`);
    deleteButton.textContent = DeleteButtonTexts.DELETE;
    deleteButton.disabled = false;
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteButtonClickHandler);
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._comment);
  }
}
