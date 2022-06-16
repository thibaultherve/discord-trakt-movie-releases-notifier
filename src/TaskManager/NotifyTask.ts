import moment from "moment";
import Database from "../Database";
import TraktRepository from "../Database/Repository/TraktRepository";
import { NotifyProcessor } from "../Processors/NotifyProcessor";
import { TraktProcessor } from "../Processors/TraktProcessor";

import { IArgv } from "../Utils/ArgvHelper";
import { Release } from "../Utils/Constants";
import { Task } from "./Task";

export class NotifyTask extends Task {
  private readonly _repository: TraktRepository;
  private readonly _release: Release;

  constructor(args: IArgv, database: Database) {
    super(args, database);

    this._repository = new TraktRepository(database);
    this._release = args.release;
  }

  public async execute(): Promise<void> {
    await this.processData();
  }

  private async processData(): Promise<void> {
    const processor = new NotifyProcessor(this.database, this._release);
    await processor.process();
  }
}
