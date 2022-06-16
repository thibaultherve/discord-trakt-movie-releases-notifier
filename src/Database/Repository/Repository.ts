import Database from "../index";

export default class Repository {
  protected readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }
}
