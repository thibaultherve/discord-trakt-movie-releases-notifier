import SQL from "sql-template-strings";
import Database from "../..";
import { ITraktAliasInsert } from "../../Schema/ITraktAlias";
import InsertionQuery, { InsertionResult } from "../InsertionQuery";

export default class InsertAlias extends InsertionQuery {
  private readonly _movieId: number;
  private readonly _data: ITraktAliasInsert;

  constructor(database: Database, movieId: number, data: ITraktAliasInsert) {
    super(database);
    this._movieId = movieId;
    this._data = data;
  }

  public call(): Promise<InsertionResult> {
    return this.database.db.run(SQL`
    INSERT INTO trakt_aliases (trakt_movie_id, title, country)
    VALUES (${this._movieId},
            ${this._data.title},
            ${this._data.country})
    `) as Promise<InsertionResult>;
  }
}
