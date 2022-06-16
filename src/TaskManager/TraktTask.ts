import moment from "moment";
import Database from "../Database";
import TraktRepository from "../Database/Repository/TraktRepository";
import { TraktProcessor } from "../Processors/TraktProcessor";

import { IArgv } from "../Utils/ArgvHelper";
import { Task } from "./Task";

export class TraktTask extends Task {
  private readonly _repository: TraktRepository;

  constructor(args: IArgv, database: Database) {
    super(args, database);

    this._repository = new TraktRepository(database);
  }

  public async execute(): Promise<void> {
    await this.processData();
  }

  private async processData(): Promise<void> {
    const processor = new TraktProcessor(this.database);
    await processor.process();
  }
}
