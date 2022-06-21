import Database from "../index";

export default abstract class Query<T> {
  protected readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  public abstract call(): Promise<T>;
}
