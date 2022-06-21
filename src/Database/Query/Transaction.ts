import SQL from "sql-template-strings";
import Database from "../index";
import { Logger } from "../../Utils/Logger";

const logger = Logger.getLogger();

export default class Transaction {
  protected readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  public async call<T>(body: () => Promise<T>): Promise<T> {
    let result: T;

    try {
      await this.database.db.run(SQL`BEGIN TRANSACTION`);
    } catch (error: any) {
      error.message = `Error when beginning transaction: ${error.message}`;
      throw error;
    }

    try {
      result = await body();
    } catch (error: any) {
      console.log(error);
      logger.error(`Error in transaction body, rolling back...`);

      try {
        await this.database.db.run(SQL`ROLLBACK`);
      } catch (rollbackError: any) {
        rollbackError.message = `Error while rolling back: ${rollbackError.message}`;
        throw rollbackError;
      }

      error.message = `Error in transaction body: ${error.message}`;
      throw error;
    }

    try {
      await this.database.db.run(SQL`COMMIT`);
    } catch (error: any) {
      error.message = `Error when committing transaction : ${error.message}`;
      throw error;
    }

    return result;
  }
}
