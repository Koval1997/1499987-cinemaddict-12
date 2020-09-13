import MenuView from '../view/site-menu';
import {render, replace, remove} from '../utils/render';
import {FilterTypes, UpdateTypes} from '../const';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new MenuView(filters, this._currentFilter);
    this._filterComponent.setFilterChangeHandler(this._handleFilterChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, `afterbegin`);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateTypes.MAJOR, filterType);
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
}
