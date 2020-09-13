import HeaderProfile from './view/header-profile';
import FooterStatistic from './view/footer-statistic';
import {generateFilm} from './mock/films/film';
import {render, RenderPosition} from './utils/render';
import FilmListPresenter from './presenter/filmList';
import FilmsModel from './model/films';
import FilterModel from './model/filters';
import FilterPresenter from './presenter/menu';

const FILMS_COUNT = 30;
const USER_RANK_TITLE = `Movie Buff`;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const pageHeaderElement = document.querySelector(`.header`);
render(pageHeaderElement, new HeaderProfile(USER_RANK_TITLE), RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector(`.main`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(pageMainElement, filterModel, filmsModel);
filterPresenter.init();

const movieListPresenter = new FilmListPresenter(pageMainElement, filterModel, filmsModel);
movieListPresenter.init(films);

const pageFooterElement = document.querySelector(`.footer`);
const pageFooterStatisticsElement = pageFooterElement.querySelector(`.footer__statistics`);
render(pageFooterStatisticsElement, new FooterStatistic(films.length), RenderPosition.BEFOREEND);
