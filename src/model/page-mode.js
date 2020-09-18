import Observer from '../utils/observer';
import {PageModes} from '../const';

export default class Page extends Observer {
  constructor() {
    super();
    this._activePageMode = PageModes.FILMS;
  }

  setMode(updateType, pageMode) {
    this._activePageMode = pageMode;
    this._notify(updateType, pageMode);
  }

  getMode() {
    return this._activePageMode;
  }
}
