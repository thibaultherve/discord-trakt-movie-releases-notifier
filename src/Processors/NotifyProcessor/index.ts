import moment from "moment";
import Database from "../../Database";
import TraktRepository from "../../Database/Repository/TraktRepository";
import { Release } from "../../Utils/Constants";
import { Trakt } from "../../Trakt";
import { Constants } from "../../Utils/Constants";
import { Logger } from "../../Utils/Logger";

const logger = Logger.getLogger();

export class NotifyProcessor {
  private readonly _repository: TraktRepository;
  private readonly _trakt: Trakt;
  //private readonly _prioritizeCache: boolean;
  private readonly _release: string;
  private readonly _now: moment.Moment;

  constructor(database: Database, release: Release) {
    this._repository = new TraktRepository(database);

    this._trakt = new Trakt(Constants.TRAKT_API_KEY, Constants.TRAKT_API_BEARER_TOKEN);
    //this._prioritizeCache = prioritizeCache !== undefined ? prioritizeCache : true;

    this._release = release;
    this._now = moment();
  }

  public async process(): Promise<void> {
    //
  }
}
