import AbstractView from './abstract.js';
import {PageModes} from '../const';

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType, pageMode) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._pageMode = pageMode;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);
  }

  getTemplate() {
    return this._createMenuTemplate(this._filters);
  }

  _createFilterTemplate(filter) {
    const {type, name, count} = filter;

    return (
      `<a href="#${type}" id=${type} class="main-navigation__item ${this._currentFilterType === type ? `main-navigation__item--active` : ``}">${name} ${name !== `All movies` ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
    );
  }

  _createMenuTemplate(filters) {
    const filtersTemplate = filters.map((filter) => this._createFilterTemplate(filter)).join(``);

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersTemplate}
        </div>
        <a href="#stats" class="main-navigation__additional" ${this._pageMode === PageModes.STATISTICS ? `main-navigation__additional--active` : ``}>Stats</a>
      </nav>`
    );
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterChange(evt.target.id);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener(`click`, this._filterChangeHandler);
  }

  _statisticsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statisticsClick();
  }

  setStatisticsClickHandler(callback) {
    this._callback.statisticsClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statisticsClickHandler);
  }
}
