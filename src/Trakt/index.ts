import axios, { AxiosRequestConfig } from "axios";
import { Logger } from "../Utils/Logger";
import { ITraktResponse } from "./ITraktResponse";
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

  public async collection(query: TraktQuery): Promise<any[]> {
    const collection: any[] = [];
    const results: ITraktResponse = await this.get(query.toQueryString());
    collection.push(...(results as any));
    return collection;
  }

  public async get(url: string): Promise<ITraktResponse> {
    logger.debug(`Fetching ${url}...`);

    let data: ITraktResponse;

    try {
      const response = await axios.get<ITraktResponse>(url, this._requestConfig);

      data = response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        data = error.response.data;
      } else {
        throw new Error(error);
      }
    }

    if (data.error) {
      throw new Error(`Trakt API error : ${data.error.id} (${data.error.message})`);
    }

    return data;
  }
}
