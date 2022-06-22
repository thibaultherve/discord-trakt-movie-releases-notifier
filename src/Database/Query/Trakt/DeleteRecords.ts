import SQL from "sql-template-strings";
import Database from "../..";
import DeletionQuery, { DeletionResult } from "../DeletionQuery";

export default class DeleteRecords extends DeletionQuery {
  constructor(database: Database) {
    super(database);
  }

  call(): Promise<DeletionResult> {
    return this.database.db.run(SQL`
        DELETE
        FROM trakt_movies
    `) as Promise<DeletionResult>;
  }
}
