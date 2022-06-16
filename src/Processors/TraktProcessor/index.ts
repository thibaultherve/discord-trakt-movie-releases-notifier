import { group } from "console";
import moment from "moment";
import Database from "../../Database";
import TraktRepository from "../../Database/Repository/TraktRepository";
import { Trakt } from "../../Trakt";
import { ITraktReleaseInput } from "../../Trakt/ITraktInput";
import {
  ITraktList,
  ITraktListMovieItem,
  ITraktMovie,
  ITraktRelease,
  TraktMediaExtendedInfo,
} from "../../Trakt/ITraktResponse";
import { Constants } from "../../Utils/Constants";
import { Logger } from "../../Utils/Logger";

const logger = Logger.getLogger();

export class TraktProcessor {
  private readonly _repository: TraktRepository;
  private readonly _trakt: Trakt;
  //private readonly _prioritizeCache: boolean;
  private readonly _traktUsername: string;
  private readonly _now: moment.Moment;

  constructor(database: Database) {
    this._repository = new TraktRepository(database);
    this._trakt = new Trakt(Constants.TRAKT_API_KEY, Constants.TRAKT_API_BEARER_TOKEN);
    //this._prioritizeCache = prioritizeCache !== undefined ? prioritizeCache : true;

    if (Constants.TRAKT_USERNAME === undefined) {
      throw new Error("Trakt username must be defined.");
    }

    this._traktUsername = Constants.TRAKT_USERNAME;
    this._now = moment();
  }

  public async process(): Promise<void> {
    const lists = await this.getLists();
    let movies = await this.getMoviesFromLists(lists);
    movies = movies.filter((movie) => this.isReleasedLessThanThreeYearAgo(movie));
    movies = movies.slice(0, 30);

    const moviesReleases: ITraktReleaseInput[] = [];

    for (const movie of movies) {
      const releases = await this.getReleases(movie);
      moviesReleases.push({
        idMovie: movie.ids.trakt,
        releases: releases,
      });
    }

    for (const movieReleases of moviesReleases) {
      console.log(movieReleases);
    }
  }

  private async getLists(): Promise<ITraktList[]> {
    const query = this._trakt.createQuery().user(this._traktUsername).lists();
    const response = await this._trakt.get(query.toQueryString());

    return response.data as ITraktList[];
  }

  private async getMoviesFromLists(lists: ITraktList[]): Promise<ITraktMovie[]> {
    logger.info(`Getting movies infos from ${this._traktUsername}'s Trakt lists ...`);

    let movies: ITraktMovie[] = [];

    for (const list of lists) {
      const actualMovieIds = movies.map((movie) => movie.ids.trakt);

      const foundedMovies = await this.getMoviesFromList(list);
      const missingMovies = foundedMovies.filter((movie) => !actualMovieIds.includes(movie.ids.trakt));

      movies = movies.concat(missingMovies);
    }

    return movies;
  }

  private async getMoviesFromList(list: ITraktList): Promise<ITraktMovie[]> {
    logger.info(`Getting movies infos from list : ${list.name} (${list.ids.trakt}) ...`);

    const query = this._trakt
      .createQuery()
      .user(this._traktUsername)
      .lists(list.ids.trakt)
      .items()
      .movies()
      .extended(TraktMediaExtendedInfo.FULL);

    const response = await this._trakt.get(query.toQueryString());

    const movieItems = response.data as ITraktListMovieItem[];

    return movieItems.map((movieItem) => movieItem.movie);
  }

  private async getReleases(movie: ITraktMovie): Promise<ITraktRelease[]> {
    logger.info(`Getting releases for movie : ${movie.title} (${movie.year}) ...`);

    const query = this._trakt.createQuery().movies(movie.ids.trakt).releases();
    const response = await this._trakt.get(query.toQueryString());

    return response.data as ITraktRelease[];
  }

  private isReleasedLessThanThreeYearAgo(movie: ITraktMovie): boolean {
    if (movie.year === null) return true;
    return this._now.year() - movie.year <= 3;
  }
}
