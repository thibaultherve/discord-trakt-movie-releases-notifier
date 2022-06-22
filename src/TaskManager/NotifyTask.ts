import Database from "../Database";
import TraktRepository from "../Database/Repository/TraktRepository";
import DiscordNotifier from "../DiscordNotifier";

import { IArgv } from "../Utils/ArgvHelper";
import { Constants, Release } from "../Utils/Constants";
import { Task } from "./Task";

export class NotifyTask extends Task {
  private readonly _repository: TraktRepository;
  private readonly _release: Release;
  private readonly _country: string;
  constructor(args: IArgv, database: Database) {
    super(args, database);

    if (Constants.TRAKT_COUNTRY === undefined) {
      throw new Error("Language must be defined.");
    }

    this._repository = new TraktRepository(database);
    this._country = Constants.TRAKT_COUNTRY;
    this._release = args.release;
  }

  public async execute(): Promise<void> {
    const data = await this._repository.moviesAggregate(this._release, this._country);
    console.log(data);
    const discordWebhook = new DiscordNotifier(this._release, data);
    discordWebhook.sendMessage();
  }
}
