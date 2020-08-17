import AbstractView from "./abstract.js";

const createFilmsCountTemplate = (filmsCount) => {
  return (
    `<section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
      </section>`
  );
};

export default class FooterStatistic extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._count);
  }
}
