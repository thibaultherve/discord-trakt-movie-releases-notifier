import Database from "../Database";
import TraktRepository from "../Database/Repository/TraktRepository";
import { IArgv } from "../Utils/ArgvHelper";
import { Logger } from "../Utils/Logger";
import { Task } from "./Task";

const logger = Logger.getLogger();

export default class DeleteRecordsTask extends Task {
  private readonly _repository: TraktRepository;

  constructor(args: IArgv, database: Database) {
    super(args, database);

    this._repository = new TraktRepository(database);
  }

  public async execute(): Promise<void> {
    logger.info(`Deleting records...`);

    const deletedRecords = await this._repository.deleteRecords();

    logger.info(`Deleted ${deletedRecords.changes} record(s).`);
  }
}
