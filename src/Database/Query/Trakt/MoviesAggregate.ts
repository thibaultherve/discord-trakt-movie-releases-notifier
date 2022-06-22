import { Constants } from "discord.js";
import moment from "moment";
import Database from "../..";
import { Release } from "../../../Utils/Constants";
import Query from "../Query";

export interface TraktMoviesAggregate {
  title: string;
  release_date: number;
}

export default class MoviesAggregate extends Query<TraktMoviesAggregate[]> {
  private readonly _release: Release;
  private readonly _country: string;
  private readonly _limit: number;
  private readonly _today: string;

  constructor(database: Database, release: Release, country: string, limit = 20) {
    super(database);

    this._release = release;
    this._country = country;
    this._limit = limit;

    this._today = moment().format("YYYY-MM-DD");

    console.log(this._country);
  }

  public async call(): Promise<TraktMoviesAggregate[]> {
    return this.database.db.all<TraktMoviesAggregate[]>(
      `
      SELECT m.title, r.release_date
      FROM trakt_releases r INNER JOIN trakt_movies m ON r.trakt_movie_id = m.trakt_movie_id
      WHERE r.release_type = ?
      AND r.country = ?
      AND r.release_date >= ?
      ORDER BY release_date ASC
      LIMIT ?
      `,
      this._release,
      this._country,
      this._today,
      this._limit
    );
  }
}
