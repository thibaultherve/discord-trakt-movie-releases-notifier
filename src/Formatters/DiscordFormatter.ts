import { MessageEmbed, WebhookMessageOptions } from "discord.js";
import { TraktMoviesAggregate } from "../Database/Query/Trakt/MoviesAggregate";
import { Release } from "../Utils/Constants";
import IFormattable from "./IFormattable";

export class DiscordFormatter {
  private readonly _release: Release;

  constructor(release: Release) {
    this._release = release;
  }

  public formatMovies(data: TraktMoviesAggregate[]): WebhookMessageOptions {
    let title = "";

    switch (this._release) {
      case Release.THEATRICAL:
        title = "Sorties cinéma";
        break;
      case Release.DIGITAL:
        title = "Sorties en version digitale";
        break;
      case Release.PHYSICAL:
        title = "Sorties en version physique";
        break;
    }

    const description = data.map((d) => d.title + " " + d.release_date).join("\n");

    const embed = new MessageEmbed().setTitle(title).setDescription(description);

    return {
      username: "Releases Trakt Notifier",
      avatarURL: "https://cdn.iconscout.com/icon/free/png-256/trakt-3627343-3029751.png",
      embeds: [embed],
    };
  }
}
