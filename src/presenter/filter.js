import MenuView from '../view/site-menu';
import {render, replace, remove} from '../utils/render';
import {FilterTypes, UpdateTypes, PageModes, RenderPositions} from '../const';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, filmListPresenter, statisticsPresenter, pageModeModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._statisticsPresenter = statisticsPresenter;
    this._pageModeModel = pageModeModel;
    this._filmListPresenter = filmListPresenter;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleStatisticsClick = this._handleStatisticsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._pageModeModel.addObserver(this._handleModelEvent);

    this._pageMode = this._pageModeModel.getMode();
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new MenuView(filters, this._currentFilter, this._pageMode);
    this._filterComponent.setFilterChangeHandler(this._handleFilterChange);
    this._filterComponent.setStatisticsClickHandler(this._handleStatisticsClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPositions.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterTypes.ALL,
        name: `All movies`,
        count: ``
      },
      {
        type: FilterTypes.WATCHLIST,
        name: `Watchlist`,
        count: films.filter((film) => film.isInWatchlist).length
      },
      {
        type: FilterTypes.HISTORY,
        name: `History`,
        count: films.filter((film) => film.isWatched).length
      },
      {
        type: FilterTypes.FAVORITES,
        name: `Favorites`,
        count: films.filter((film) => film.isFavorite).length
      }
    ];
  }

  _handleStatisticsClick() {
    if (this._pageMode === PageModes.FILMS) {
      this._pageMode = PageModes.STATISTICS;
      this._statisticsPresenter.init();
      this._filmListPresenter.destroy();
      this._pageModeModel.setMode(UpdateTypes.MAJOR, this._pageMode);
    }
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._pageMode === PageModes.STATISTICS) {
      this._pageMode = PageModes.FILMS;
      this._statisticsPresenter.destroy();
      this._filmListPresenter.init();
      this._pageModeModel.setMode(UpdateTypes.MAJOR, this._pageMode);
    }

    this._filterModel.setFilter(UpdateTypes.MAJOR, filterType);
  }
}
