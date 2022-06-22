import { WebhookClient } from "discord.js";
import { TraktMoviesAggregate } from "../Database/Query/Trakt/MoviesAggregate";
import { DiscordFormatter } from "../Formatters/DiscordFormatter";
import { Constants, Release } from "../Utils/Constants";
import { Logger } from "../Utils/Logger";

const logger = Logger.getLogger();

export default class DiscordNotifier {
  private readonly _formatter: DiscordFormatter;
  private readonly _data: TraktMoviesAggregate[];
  private readonly _webhookClient: WebhookClient;

  constructor(release: Release, data: TraktMoviesAggregate[]) {
    if (Constants.DISCORD_WEBHOOK_ID === undefined || Constants.DISCORD_WEBHOOK_TOKEN === undefined) {
      throw new Error(`Discord weebhook tokens must be defined.`);
    }

    this._formatter = new DiscordFormatter(release);
    this._data = data;

    this._webhookClient = new WebhookClient({
      id: Constants.DISCORD_WEBHOOK_ID,
      token: Constants.DISCORD_WEBHOOK_TOKEN,
    });
  }

  public async sendMessage(): Promise<void> {
    logger.info(`Posting message...`);

    this._webhookClient.send(this._formatter.formatMovies(this._data));
  }
}
