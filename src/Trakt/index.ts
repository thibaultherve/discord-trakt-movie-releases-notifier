import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { delay } from "../Utils";
import { Logger } from "../Utils/Logger";
import { TraktQuery } from "./TraktQuery";

const logger = Logger.getLogger();

export class Trakt {
  private readonly _key: string;
  private readonly _token: string | undefined;
  private readonly _version: string;
  private readonly _requestConfig: AxiosRequestConfig;

  constructor(key: string | undefined, token: string | undefined, version = "2") {
    if (key === undefined) {
      throw new Error("No Trakt API key given.");
    }

    /*if (token === undefined) {
      throw new Error("No Trakt token given.");
    }*/

    this._key = key;
    this._token = token;
    this._version = version;
    this._requestConfig = {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": this._version,
        "trakt-api-key": this._key,
        Authorization: this._token ? `Bearer ${this._token}` : "",
      },
    };
  }

  public createQuery(): TraktQuery {
    return new TraktQuery();
  }

  public async get(url: string): Promise<AxiosResponse> {
    //await delay(100);

    logger.debug(`Fetching ${url}...`);

    try {
      const response = await axios.get<AxiosResponse>(url, this._requestConfig);

      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        //console.log(error.);
        throw new Error(`Trakt API error : ${error.response?.status} ${error.response?.statusText}.`);
      } else {
        throw new Error(error);
      }
    }
  }
}
