import AbstractView from "./abstract";

export default class Comments extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  createCommentTemplate(comment) {
    const {emotion, text, author, date} = comment;

    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src=${emotion} width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }

  createCommentsTemplate(comments) {
    const commentTemplate = comments.map(this.createCommentTemplate).join(``);

    return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentTemplate}
        </ul>
      </section>`;
  }

  getTemplate() {
    return this.createCommentsTemplate(this._comments);
  }
}