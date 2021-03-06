import SmartView from './smart.js';
import moment from 'moment';
import {Emoji} from '../const';
import {shakeElement} from '../utils/common';

export default class NewComment extends SmartView {
  constructor() {
    super();
    this._data = {
      emoji: null,
      text: ``
    };

    this._inputCommentTextHandler = this._inputCommentTextHandler.bind(this);
    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);

    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    const {emoji} = this._data;

    return `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === Emoji.SMILE ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emoji === Emoji.SLEEPING ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === Emoji.PUKE ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === Emoji.ANGRY ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>`;
  }

  reset() {
    this._data = null;
    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    this.getElement().querySelector(`.film-details__comment-input`).innerHTML = ``;
    this._destroyHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.getElement().addEventListener(`keydown`, this._commentSubmitHandler);
  }

  getNewComment() {
    return Object.assign(
        {},
        {
          emotion: this._data.emoji,
          comment: this._data.text,
          date: moment(new Date()).format(`YYYY/MM/DD HH:MM`)
        }
    );
  }

  setSubmitCommentHandler(callback) {
    this._callback.createComment = callback;
    this.getElement().addEventListener(`keydown`, this._commentSubmitHandler);
  }

  applyAddFailureEffect() {
    shakeElement(this);
    this._unblockForm();
  }

  blockForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach(function (item) {
      item.disabled = true;
    });
  }

  _unblockForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach(function (item) {
      item.disabled = false;
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiToggleHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._inputCommentTextHandler);
  }

  _destroyHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).removeEventListener(`change`, this._emojiToggleHandler);
    this.getElement().querySelector(`.film-details__comment-input`).removeEventListener(`input`, this._inputCommentTextHandler);
  }

  _emojiToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.value
    });
  }

  _inputCommentTextHandler(evt) {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value
    }, true);
  }

  _commentSubmitHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      evt.preventDefault();
      this._callback.createComment();
    }
  }
}
