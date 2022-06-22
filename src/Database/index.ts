import SQL from "sql-template-strings";
import { Database as SQLiteDatabase, open } from "sqlite";
import sqlite3 from "sqlite3";
import { Constants } from "../Utils/Constants";
import { Logger } from "../Utils/Logger";

const logger = Logger.getLogger();

export default class Database {
  private _db: SQLiteDatabase | undefined;

  public get db(): SQLiteDatabase {
    if (!this._db) {
      throw new Error("Database is not open.");
    }

    return this._db;
  }

  public async open(): Promise<void> {
    if (this._db) {
      throw new Error("Database is already open");
    }

    this._db = await open({
      driver: sqlite3.Database,
      filename: Constants.DEFAULT_DATABASE_FILE,
      mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    });

    if (Constants.DEVELOPMENT_ENV) {
      this._db.on("profile", (query: string, time: number) => {
        logger.debug(`(${time}ms) ${query.trim()}`);
      });
    }

    // Performance tuning queries to run on every database connect.
    await this.db.exec(SQL`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = normal;
      PRAGMA temp_store = memory;
      PRAGMA mmap_size = 30000000000;
      PRAGMA foreign_keys = ON;
    `);

    // Run pending migrations, if any.
    await this.db.migrate({
      migrationsPath: Constants.DEFAULT_DATABASE_MIGRATIONS_DIRECTORY,
    });
  }

  public async close(): Promise<void> {
    if (!this._db) {
      return;
    }

    // Performance tuning queries to run before closing each database.
    await this.db.exec(SQL`
      PRAGMA optimize;
      PRAGMA incremental_vacuum;
    `);

    await this.db.close();

    this._db = undefined;
  }
}
