import moment from "moment";
import Database from "../../Database";
import TraktRepository from "../../Database/Repository/TraktRepository";
import { ITraktAliasInsert } from "../../Database/Schema/ITraktAlias";
import { ITraktMovieInsert } from "../../Database/Schema/ITraktMovie";
import { ITraktMoviesInsert } from "../../Database/Schema/ITraktMovies";
import { ITraktReleaseInsert } from "../../Database/Schema/ITraktRelease";
import { Trakt } from "../../Trakt";
import {
  ITraktResponseAlias,
  ITraktResponseList,
  ITraktResponseListMovieItem,
  ITraktResponseMovie,
  ITraktResponseRelease,
  TraktMediaExtendedInfo,
} from "../../Trakt/ITraktResponse";
import { Constants } from "../../Utils/Constants";
import { Logger } from "../../Utils/Logger";

const logger = Logger.getLogger();

export class TraktProcessor {
  private readonly _repository: TraktRepository;
  private readonly _trakt: Trakt;
  private readonly _traktUsername: string;
  private readonly _now: moment.Moment;

  private _lists: ITraktResponseList[] | undefined;
  private _rawMovies: ITraktResponseMovie[] | undefined;

  constructor(database: Database) {
    this._repository = new TraktRepository(database);
    this._trakt = new Trakt(Constants.TRAKT_API_KEY, Constants.TRAKT_API_BEARER_TOKEN);

    if (Constants.TRAKT_USERNAME === undefined) {
      throw new Error("Trakt username must be defined.");
    }

    this._traktUsername = Constants.TRAKT_USERNAME;
    this._now = moment();
  }

  public async process(): Promise<void> {
    await this.getLists();
    await this.getMoviesFromLists();

    const data = await this.processMoviesData();

    await this._repository.saveToDatabase(data);
  }

  private async getLists(): Promise<void> {
    logger.info(`Getting lists ...`);
    const query = this._trakt.createQuery().user(this._traktUsername).lists();
    this._lists = await this._trakt.collection(query);
  }

  private async getMoviesFromLists(): Promise<void> {
    if (this._lists === undefined) {
      throw new Error("Cannot get movies if lists are not available.");
    }

    let movies: ITraktResponseMovie[] = [];

    for (const list of this._lists) {
      const actualMovieIds = movies.map((movie) => movie.ids.trakt);

      const foundedMoviesItems = await this.getMoviesItemsFromList(list);
      const foundedMovies = foundedMoviesItems.map((movieItem) => movieItem.movie);
      const missingMovies = foundedMovies.filter((movie) => !actualMovieIds.includes(movie.ids.trakt));

      movies = movies.concat(missingMovies);
    }

    this._rawMovies = movies;
  }

  private async getMoviesItemsFromList(list: ITraktResponseList): Promise<ITraktResponseListMovieItem[]> {
    logger.info(`Getting movies infos from list : ${list.name} (${list.ids.trakt}) ...`);

    const query = this._trakt
      .createQuery()
      .user(this._traktUsername)
      .lists(list.ids.trakt)
      .items()
      .movies()
      .extended(TraktMediaExtendedInfo.FULL);

    return await this._trakt.collection(query);
  }

  private async processMoviesData(): Promise<ITraktMoviesInsert> {
    if (this._rawMovies === undefined) {
      throw new Error("Cannot get releases if movies are not available.");
    }

    this._rawMovies = this._rawMovies.filter((movie) => this.isReleasedLessThanOneYearAgo(movie));
    this._rawMovies = this._rawMovies.slice(0, 20);
    const movies: ITraktMovieInsert[] = [];

    for (const rawMovie of this._rawMovies) {
      const movieInsert = await this.processMovie(rawMovie);

      movies.push(movieInsert);
    }

    const moviesInsert: ITraktMoviesInsert = { movies };

    return moviesInsert;
  }

  private async processMovie(movie: ITraktResponseMovie): Promise<ITraktMovieInsert> {
    const rawReleases = await this.getReleases(movie);
    const rawAliases = await this.getAliases(movie);

    const releases = rawReleases.map<ITraktReleaseInsert>((release) => {
      return {
        country: release.country,
        certification: release.certification,
        release_date: release.release_date,
        release_type: release.release_type,
        note: release.note,
      };
    });

    const aliases = rawAliases.map<ITraktAliasInsert>((release) => {
      return {
        title: release.title,
        country: release.country,
      };
    });

    return {
      trakt_movie_id: movie.ids.trakt,
      title: movie.title,
      year: movie.year,
      releases,
      aliases,
    };
  }

  private async getReleases(movie: ITraktResponseMovie): Promise<ITraktResponseRelease[]> {
    logger.info(`Getting releases for movie : ${movie.title} (${movie.year}) ...`);

    const query = this._trakt.createQuery().movies(movie.ids.trakt).releases();
    return await this._trakt.collection(query);
  }

  private async getAliases(movie: ITraktResponseMovie): Promise<ITraktResponseAlias[]> {
    logger.info(`Getting aliases for movie : ${movie.title} (${movie.year}) ...`);

    const query = this._trakt.createQuery().movies(movie.ids.trakt).aliases();
    return await this._trakt.collection(query);
  }

  private isReleasedLessThanOneYearAgo(movie: ITraktResponseMovie): boolean {
    if (movie.year === null) return true;
    return this._now.year() - movie.year <= 1;
  }
}
