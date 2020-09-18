import HeaderProfile from './view/header-profile';
import FooterStatistic from './view/footer-statistic';
import {render, RenderPosition} from './utils/render';
import FilmListPresenter from './presenter/filmList';
import FilmsModel from './model/films';
import FilterModel from './model/filters';
import FilterPresenter from './presenter/filter';
import Api from "./api.js";
import {UpdateTypes} from './const';
import StatisticsPresenter from './presenter/statistics';
import PageModeModel from './model/page-mode';

const AUTHORIZATION_TOKEN = `Basic xlV0UYYqjqhrPphx4`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION_TOKEN);

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const pageFooterElement = document.querySelector(`.footer`);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const pageModeModel = new PageModeModel();

const movieListPresenter = new FilmListPresenter(pageMainElement, filterModel, filmsModel, api);
const statisticsPresenter = new StatisticsPresenter(pageMainElement, filmsModel);
const filterPresenter = new FilterPresenter(pageMainElement, filterModel, filmsModel, movieListPresenter, statisticsPresenter, pageModeModel);

filterPresenter.init();
movieListPresenter.init();

api.getFilms().then((films) => {
  filmsModel.setFilms(UpdateTypes.INIT, films);
  render(pageHeaderElement, new HeaderProfile(films), RenderPosition.BEFOREEND);
  render(pageFooterElement, new FooterStatistic(films.length), RenderPosition.BEFOREEND);
});

