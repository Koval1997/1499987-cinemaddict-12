import Observer from '../utils/observer';
import {FilterTypes} from '../const';

export default class Filters extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterTypes.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
