import AbstractView from "./abstract.js";

export default class Loading extends AbstractView {
  constructor() {
    super();
  }

  _createNoTaskTemplate() {
    return `<p class="board__no-tasks">
      Loading...
    </p>`;
  }

  getTemplate() {
    return this._createNoTaskTemplate();
  }
}
