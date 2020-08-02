import {createUserRankTemplate} from './view/header-profile';
import {createMenuTemplate} from './view/site-menu';
import {createFilmsListContainerTemplate} from './view/films-list';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createExtraFilmsSectionTemplate} from './view/extra-film-section';
import {createFilmsCountTemplate} from './view/footer-statistics';

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const TOP_RATED_BLOCK_TITLE = `Top rated`;
const MOST_COMMENTED_BLOCK_TITLE = `Most commented`;

const FILMS_LIST_CONTAINER_SELECTOR = `.films-list__container`;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCard = (container, cardsCount) => {
  for (let i = 0; i < cardsCount; i++) {
    render(container, createFilmCardTemplate(), `beforeend`);
  }
};

const findContainerInExtraFilmsBlockByTitle = (title) => {
  return Array.from(document.querySelectorAll(`.films-list--extra`))
    .filter((el) => el.innerText.includes(title))[0];
};

const pageHeaderElement = document.querySelector(`.header`);
render(pageHeaderElement, createUserRankTemplate(), `beforeend`);

const pageMainElement = document.querySelector(`.main`);
render(pageMainElement, createMenuTemplate(), `beforeend`);
render(pageMainElement, createFilmsListContainerTemplate(), `beforeend`);

const pageMainFilmsContainer = pageMainElement.querySelector(`.films`);
const pageFilmsListContainerElement = pageMainFilmsContainer.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderFilmCard(pageFilmsListContainerElement, FILMS_COUNT);

const pageFilmsListElement = pageMainFilmsContainer.querySelector(`.films-list`);
render(pageFilmsListElement, createShowMoreButtonTemplate(), `beforeend`);

render(pageMainFilmsContainer, createExtraFilmsSectionTemplate(TOP_RATED_BLOCK_TITLE), `beforeend`);
const pageTopRatedFilmsListElement = findContainerInExtraFilmsBlockByTitle(TOP_RATED_BLOCK_TITLE);
const pageTopRatedFilmsContainerElement = pageTopRatedFilmsListElement.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderFilmCard(pageTopRatedFilmsContainerElement, EXTRA_FILMS_COUNT);

render(pageMainFilmsContainer, createExtraFilmsSectionTemplate(MOST_COMMENTED_BLOCK_TITLE), `beforeend`);
const pageMostCommentedFilmsListElement = findContainerInExtraFilmsBlockByTitle(MOST_COMMENTED_BLOCK_TITLE);
const pageMostCommentedFilmsContainerElement = pageMostCommentedFilmsListElement.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderFilmCard(pageMostCommentedFilmsContainerElement, EXTRA_FILMS_COUNT);

const pageFooterElement = document.querySelector(`.footer`);
const pageFooterStatisticsElement = pageFooterElement.querySelector(`.footer__statistics`);
render(pageFooterStatisticsElement, createFilmsCountTemplate(), `beforeend`);
