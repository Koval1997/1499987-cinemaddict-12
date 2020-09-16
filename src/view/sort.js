import AbstractView from './abstract';
import {SortTypes} from '../const';

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _createSortTemplate(currentSortType) {
    return (
      `<ul class="sort">
        <li><a href="#" class="sort__button ${currentSortType === SortTypes.DEFAULT ? `sort__button--active` : ``}" data-sort-type="${SortTypes.DEFAULT}">Sort by default</a></li>
        <li><a href="#" class="sort__button ${currentSortType === SortTypes.DATE ? `sort__button--active` : ``}" data-sort-type="${SortTypes.DATE}">Sort by date</a></li>
        <li><a href="#" class="sort__button ${currentSortType === SortTypes.RATING ? `sort__button--active` : ``}" data-sort-type="${SortTypes.RATING}">Sort by rating</a></li>
      </ul>`
    );
  }

  getTemplate() {
    return this._createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
