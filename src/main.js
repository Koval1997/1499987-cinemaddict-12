import HeaderProfile from './view/header-profile';
import SiteMenu from './view/site-menu';
import FilmCard from './view/film-card';
import FilmDetails from './view/film-details';
import ExtraFilmsList from './view/extra-films-list';
import FooterStatistic from './view/footer-statistic';
import {generateFilm} from './mock/films/film';
import {generateFilter} from './mock/filters/filter';
import {render, RenderPosition} from './utils/render';
import MovieList from './presenter/movieList';

const FILMS_COUNT = 30;
const EXTRA_FILMS_COUNT = 2;

const TOP_RATED_BLOCK_TITLE = `Top rated`;
const MOST_COMMENTED_BLOCK_TITLE = `Most commented`;
const USER_RANK_TITLE = `Movie Buff`;
const FILMS_LIST_CONTAINER_SELECTOR = `.films-list__container`;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const pageHeaderElement = document.querySelector(`.header`);
render(pageHeaderElement, new HeaderProfile(USER_RANK_TITLE), RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector(`.main`);
render(pageMainElement, new SiteMenu(filters), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieList(pageMainElement);
movieListPresenter.init(films);

const renderExtraFilmCard = (container, cardsCount) => {
  for (let i = 0; i < cardsCount; i++) {
    renderExtraFilm(container, films[i]);
  }
};

const renderExtraFilm = (filmListElement, film) => {
  const filmComponent = new FilmCard(film);
  const filmDetailComponent = new FilmDetails(film);
  const bodyElement = document.querySelector(`body`);

  const openPopup = () => {
    bodyElement.appendChild(filmDetailComponent.getElement());
  };

  const closePopup = () => {
    bodyElement.removeChild(filmDetailComponent.getElement());
  };

  filmComponent.setShowDetailsClickHandler(() => {
    openPopup();
  });

  filmDetailComponent.setClosePopupClickHandler(() => {
    closePopup();
  });

  render(filmListElement, filmComponent, RenderPosition.BEFOREEND);
};

const findContainerInExtraFilmsBlockByTitle = (title) => {
  return Array.from(document.querySelectorAll(`.films-list--extra`))
    .filter((el) => el.innerText.includes(title))[0];
};

const pageMainFilmsContainer = pageMainElement.querySelector(`.films`);

render(pageMainFilmsContainer, new ExtraFilmsList(TOP_RATED_BLOCK_TITLE), RenderPosition.BEFOREEND);
const pageTopRatedFilmsListElement = findContainerInExtraFilmsBlockByTitle(TOP_RATED_BLOCK_TITLE);
const pageTopRatedFilmsContainerElement = pageTopRatedFilmsListElement.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderExtraFilmCard(pageTopRatedFilmsContainerElement, EXTRA_FILMS_COUNT);

render(pageMainFilmsContainer, new ExtraFilmsList(MOST_COMMENTED_BLOCK_TITLE), RenderPosition.BEFOREEND);
const pageMostCommentedFilmsListElement = findContainerInExtraFilmsBlockByTitle(MOST_COMMENTED_BLOCK_TITLE);
const pageMostCommentedFilmsContainerElement = pageMostCommentedFilmsListElement.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderExtraFilmCard(pageMostCommentedFilmsContainerElement, EXTRA_FILMS_COUNT);

const pageFooterElement = document.querySelector(`.footer`);
const pageFooterStatisticsElement = pageFooterElement.querySelector(`.footer__statistics`);
render(pageFooterStatisticsElement, new FooterStatistic(films.length), RenderPosition.BEFOREEND);
