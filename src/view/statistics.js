import SmartView from './smart';
import {StatisticPeriods} from '../const';
import {getWatchedFilmsCount, getUserRank} from '../utils/common';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const BAR_HEIGHT = 50;
const DAY_AGO = `day`;
const WEEK_AGO = moment().subtract(7, `days`);
const MONTH_AGO = moment().subtract(1, `month`);
const YEAR_AGO = moment().subtract(1, `years`);

const renderChart = (chartContainer, films) => {
  const genres = Object.keys(getAllGenres(films));
  const genresCount = Object.values(getAllGenres(films));
  chartContainer.height = BAR_HEIGHT * genres.length;

  return new Chart(chartContainer, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getAllGenres = (films) => {
  const allGenres = [];
  films.map((film) => allGenres.push(film.genres));

  let count = {};
  allGenres.flat().forEach((x) => {
    count[x] = (count[x] || 0) + 1;
  });

  return count;
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._films = films;
    this._data = {
      watchedFilms: films.filter((film) => film.isWatched),
      currentPeriod: StatisticPeriods.ALL_TIME
    };

    this._genreChart = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setChart();
  }

  getTemplate() {
    const {watchedFilms, currentPeriod} = this._data;
    const userRank = getUserRank(this._films);
    const watchedFilmsCount = getWatchedFilmsCount(watchedFilms);
    const filmsDuration = this._getAllFilmsDuration(watchedFilms);
    const totalDurationHours = Math.floor(filmsDuration / 60);
    const totalDurationMinutes = filmsDuration % 60;
    const topGenre = watchedFilms.length > 0 ? this._getTopGenre(watchedFilms) : ``;

    return `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentPeriod === StatisticPeriods.ALL_TIME ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentPeriod === StatisticPeriods.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentPeriod === StatisticPeriods.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentPeriod === StatisticPeriods.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentPeriod === StatisticPeriods.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`;
  }

  restoreHandlers() {
    this._setChart();
    this._setInnerHandlers();
  }

  _getAllFilmsDuration(films) {
    return films.reduce((sum, film) => {
      return sum + film.duration;
    }, 0);
  }

  _getTopGenre(films) {
    const genres = getAllGenres(films);

    return Object.keys(genres).reduce((a, b) => genres[a] > genres[b] ? a : b);
  }

  _setChart() {
    const chartContainer = this.getElement().querySelector(`.statistic__chart`);

    this._genreChart = renderChart(chartContainer, this._data.watchedFilms);
  }

  _filterByDate(film, period) {
    return film.isWatched && moment(film.watchingDate).isBetween(period, new Date());
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    if (evt.target.classList.contains(`statistic__filters-input`)) {
      evt.preventDefault();

      let statisticsData;

      switch (evt.target.value) {
        case StatisticPeriods.ALL_TIME:
          statisticsData = {
            watchedFilms: this._films.filter((film) => film.isWatched),
            currentPeriod: StatisticPeriods.ALL_TIME
          };
          break;
        case StatisticPeriods.TODAY:
          statisticsData = {
            watchedFilms: this._films.filter((film) => film.isWatched && moment(film.watchingDate).isSame(new Date(), DAY_AGO)),
            currentPeriod: StatisticPeriods.TODAY
          };
          break;
        case StatisticPeriods.WEEK:
          statisticsData = {
            watchedFilms: this._films.filter((film) => this._filterByDate(film, WEEK_AGO)),
            currentPeriod: StatisticPeriods.WEEK
          };
          break;
        case StatisticPeriods.MONTH:
          statisticsData = {
            watchedFilms: this._films.filter((film) => this._filterByDate(film, MONTH_AGO)),
            currentPeriod: StatisticPeriods.MONTH
          };
          break;
        case StatisticPeriods.YEAR:
          statisticsData = {
            watchedFilms: this._films.filter((film) => this._filterByDate(film, YEAR_AGO)),
            currentPeriod: StatisticPeriods.YEAR
          };
          break;
      }

      this.updateData(statisticsData);
      this._setChart();
    }
  }
}
