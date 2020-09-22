import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilmCard(updateType, updatedFilm) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error(`Film is not exists`);
    }

    this._films = [
      ...this._films.slice(0, index),
      updatedFilm,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, updatedFilm);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          comments: film.comments,
          actors: film.film_info.actors,
          ageRating: film.film_info.age_rating,
          name: film.film_info.alternative_title,
          description: film.film_info.description,
          director: film.film_info.director,
          genres: film.film_info.genre,
          posterSrc: film.film_info.poster,
          releaseDate: new Date(film.film_info.release.date),
          country: film.film_info.release.release_country,
          duration: film.film_info.runtime,
          originalName: film.film_info.title,
          rating: film.film_info.total_rating,
          writers: film.film_info.writers,
          isWatched: film.user_details.already_watched,
          isInWatchlist: film.user_details.watchlist,
          isFavorite: film.user_details.favorite,
          watchingDate: new Date(film.user_details.watching_date),
        }
    );

    delete adaptedFilm.user_details;
    delete adaptedFilm.film_info;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "id": film.id,
          "comments": film.comments,
          "film_info": {
            "actors": film.actors,
            "age_rating": film.ageRating,
            "alternative_title": film.name,
            "description": film.description,
            "director": film.director,
            "genre": film.genres,
            "poster": film.posterSrc,
            "release": {
              "date": film.releaseDate.toISOString(),
              "release_country": film.country
            },
            "runtime": film.duration,
            "title": film.originalName,
            "total_rating": film.rating,
            "writers": film.writers,
          },
          "user_details": {
            "already_watched": film.isWatched,
            "watchlist": film.isInWatchlist,
            "favorite": film.isFavorite,
            "watching_date": film.watchingDate.toISOString()
          },
        }
    );

    delete adaptedFilm.actors;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.country;
    delete adaptedFilm.description;
    delete adaptedFilm.duration;
    delete adaptedFilm.director;
    delete adaptedFilm.genres;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.originalName;
    delete adaptedFilm.name;
    delete adaptedFilm.posterSrc;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.rating;
    delete adaptedFilm.writers;

    return adaptedFilm;
  }
}
