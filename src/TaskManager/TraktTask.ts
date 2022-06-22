import Database from "../Database";
import { TraktProcessor } from "../Processors/TraktProcessor";

import { IArgv } from "../Utils/ArgvHelper";
import { Task } from "./Task";

export class TraktTask extends Task {
  constructor(args: IArgv, database: Database) {
    super(args, database);
  }

  public async execute(): Promise<void> {
    await this.processData();
  }

  private async processData(): Promise<void> {
    const processor = new TraktProcessor(this.database);
    await processor.process();
  }
}
