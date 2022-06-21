import SQL from "sql-template-strings";
import Database from "../..";
import { ITraktReleaseInsert } from "../../Schema/ITraktRelease";
import InsertionQuery, { InsertionResult } from "../InsertionQuery";

export default class InsertRelease extends InsertionQuery {
  private readonly _movieId: number;
  private readonly _data: ITraktReleaseInsert;

  constructor(database: Database, movieId: number, data: ITraktReleaseInsert) {
    super(database);
    this._movieId = movieId;
    this._data = data;
  }

  public call(): Promise<InsertionResult> {
    return this.database.db.run(SQL`
    INSERT INTO trakt_releases (trakt_movie_id, country, release_date, release_type, note)
    VALUES (${this._movieId},
            ${this._data.country},
            ${this._data.release_date},
            ${this._data.release_type},
            ${this._data.note})
    `) as Promise<InsertionResult>;
  }
}
