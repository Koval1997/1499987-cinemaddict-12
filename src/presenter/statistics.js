import StatisticsView from '../view/statistics';
import {render, remove, RenderPosition} from '../utils/render';

export default class Statistics {
  constructor(statisticsContainer, filmsModel) {
    this._statisticsContainer = statisticsContainer;
    this._filmsModel = filmsModel;
  }

  init() {
    this._statisticsComponent = new StatisticsView(this._filmsModel.getFilms());
    render(this._statisticsContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
    this._statisticsComponent.restoreHandlers();
  }

  destroy() {
    remove(this._statisticsComponent);
  }
}
