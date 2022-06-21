import SQL from "sql-template-strings";
import Database from "../..";
import { ITraktMovieInsert } from "../../Schema/ITraktMovie";
import InsertionQuery, { InsertionResult } from "../InsertionQuery";

export default class InsertMovie extends InsertionQuery {
  private readonly _data: ITraktMovieInsert;

  constructor(database: Database, data: ITraktMovieInsert) {
    super(database);
    this._data = data;
  }

  public call(): Promise<InsertionResult> {
    return this.database.db.run(SQL`
    INSERT INTO trakt_movies (id, title, year)
    VALUES (${this._data.id},
            ${this._data.title},
            ${this._data.year})
    `) as Promise<InsertionResult>;
  }
}
