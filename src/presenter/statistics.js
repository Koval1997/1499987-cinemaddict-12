import StatisticsView from '../view/statistics';
import {render, remove} from '../utils/render';
import {RenderPositions} from '../const';

export default class StatisticsPresenter {
  constructor(statisticsContainer, filmsModel) {
    this._statisticsContainer = statisticsContainer;
    this._filmsModel = filmsModel;
  }

  init() {
    this._statisticsComponent = new StatisticsView(this._filmsModel.getFilms());
    render(this._statisticsContainer, this._statisticsComponent, RenderPositions.BEFOREEND);
    this._statisticsComponent.restoreHandlers();
  }

  destroy() {
    remove(this._statisticsComponent);
  }
}
