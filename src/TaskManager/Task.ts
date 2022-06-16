import Database from "../Database";
import { IArgv } from "../Utils/ArgvHelper";

export abstract class Task {
  private readonly _args: IArgv;
  private readonly _database: Database;

  constructor(args: IArgv, database: Database) {
    this._args = args;
    this._database = database;
  }

  protected get args(): IArgv {
    return this._args;
  }

  protected get database(): Database {
    return this._database;
  }

  public abstract execute(): Promise<void>;
}
