import HeaderProfile from './view/header-profile';
import SiteMenu from './view/site-menu';
import FilmsList from './view/films-list';
import FilmCard from './view/film-card';
import FilmDetails from './view/film-details';
import ShowMoreButton from './view/show-more-button';
import ExtraFilmsList from './view/extra-films-list';
import FooterStatistic from './view/footer-statistic';
import {generateFilm} from './mock/films/film';
import {generateFilter} from './mock/filters/filter';
import {render, RenderPosition} from './utils';

const FILMS_COUNT = 30;
const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const TOP_RATED_BLOCK_TITLE = `Top rated`;
const MOST_COMMENTED_BLOCK_TITLE = `Most commented`;

const USER_RANK_TITLE = `Movie Buff`;
const FILMS_LIST_TITLE = `All movies. Upcoming`;

const FILMS_LIST_CONTAINER_SELECTOR = `.films-list__container`;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCard(film);
  const filmDetailComponent = new FilmDetails(film);
  const filmComponentElement = filmComponent.getElement();
  const bodyElement = document.querySelector(`body`);

  const openPopup = () => {
    bodyElement.appendChild(filmDetailComponent.getElement());
  };

  const closePopup = () => {
    bodyElement.removeChild(filmDetailComponent.getElement());
  };

  [
    filmComponentElement.querySelector(`.film-card__poster`),
    filmComponentElement.querySelector(`.film-card__title`),
    filmComponentElement.querySelector(`.film-card__comments`)
  ].map((element) => element.addEventListener(`click`, () => {
    openPopup();
  }));

  filmDetailComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    closePopup();
  });

  render(filmListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const pageHeaderElement = document.querySelector(`.header`);
render(pageHeaderElement, new HeaderProfile(USER_RANK_TITLE).getElement(), RenderPosition.BEFOREEND);

const pageMainElement = document.querySelector(`.main`);
render(pageMainElement, new SiteMenu(filters).getElement(), RenderPosition.BEFOREEND);
render(pageMainElement, new FilmsList(FILMS_LIST_TITLE).getElement(), RenderPosition.BEFOREEND);

const pageMainFilmsContainer = pageMainElement.querySelector(`.films`);
const pageFilmsListContainerElement = pageMainFilmsContainer.querySelector(FILMS_LIST_CONTAINER_SELECTOR);

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilm(pageFilmsListContainerElement, films[i]);
}

const pageFilmsListElement = pageMainFilmsContainer.querySelector(`.films-list`);

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFimsCount = FILM_COUNT_PER_STEP;

  const showMoreButton = new ShowMoreButton();

  render(pageFilmsListElement, showMoreButton.getElement(), RenderPosition.BEFOREEND);

  showMoreButton.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFimsCount, renderedFimsCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(pageFilmsListContainerElement, film));

    renderedFimsCount += FILM_COUNT_PER_STEP;

    if (renderedFimsCount >= films.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  });
}

const findContainerInExtraFilmsBlockByTitle = (title) => {
  return Array.from(document.querySelectorAll(`.films-list--extra`))
    .filter((el) => el.innerText.includes(title))[0];
};

const renderExtraFilmCard = (container, cardsCount) => {
  for (let i = 0; i < cardsCount; i++) {
    renderFilm(container, films[i]);
  }
};

render(pageMainFilmsContainer, new ExtraFilmsList(TOP_RATED_BLOCK_TITLE).getElement(), RenderPosition.BEFOREEND);
const pageTopRatedFilmsListElement = findContainerInExtraFilmsBlockByTitle(TOP_RATED_BLOCK_TITLE);
const pageTopRatedFilmsContainerElement = pageTopRatedFilmsListElement.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderExtraFilmCard(pageTopRatedFilmsContainerElement, EXTRA_FILMS_COUNT);

render(pageMainFilmsContainer, new ExtraFilmsList(MOST_COMMENTED_BLOCK_TITLE).getElement(), RenderPosition.BEFOREEND);
const pageMostCommentedFilmsListElement = findContainerInExtraFilmsBlockByTitle(MOST_COMMENTED_BLOCK_TITLE);
const pageMostCommentedFilmsContainerElement = pageMostCommentedFilmsListElement.querySelector(FILMS_LIST_CONTAINER_SELECTOR);
renderExtraFilmCard(pageMostCommentedFilmsContainerElement, EXTRA_FILMS_COUNT);

const pageFooterElement = document.querySelector(`.footer`);
const pageFooterStatisticsElement = pageFooterElement.querySelector(`.footer__statistics`);
render(pageFooterStatisticsElement, new FooterStatistic(films.length).getElement(), RenderPosition.BEFOREEND);
