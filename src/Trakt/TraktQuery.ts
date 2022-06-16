import { TraktMediaExtendedInfo } from "./ITraktResponse";

export class TraktQuery {
  private _endpoint = "https://api.trakt.tv";
  private _path: string[] = [];
  private _parameters: Map<string, string> = new Map();

  public endpoint(endpoint: string): TraktQuery {
    this._endpoint = endpoint;
    return this;
  }

  public user(userName: string): TraktQuery {
    this.addPath(`users/${userName}`);
    return this;
  }

  public lists(id?: number): TraktQuery {
    this.addPath("lists");
    if (id !== undefined) {
      this.addPath(`${id}`);
    }
    return this;
  }

  public items(): TraktQuery {
    this.addPath("items");
    return this;
  }

  public movies(id?: number): TraktQuery {
    this.addPath("movies");
    if (id !== undefined) {
      this.addPath(`${id}`);
    }
    return this;
  }

  public releases(countryCode?: string): TraktQuery {
    this.addPath("releases");
    if (countryCode !== undefined) {
      this.addPath(`${countryCode}`);
    }
    return this;
  }

  public extended(extendedType: TraktMediaExtendedInfo): TraktQuery {
    this._parameters.set("extended", extendedType);
    return this;
  }

  public addPath(path: string): TraktQuery {
    if (this._path.indexOf(path) === -1) {
      this._path.push(path);
    }
    return this;
  }

  public toQueryString(): string {
    this.ensureValidQuery();

    let query = `${this._endpoint}/`;
    if (this._path.length > 0) {
      query += this._path.join("/") + "/";
    }
    if (this._parameters.size > 0) {
      query += "?";
      this._parameters.forEach((value, key) => {
        query += `${key}=${value}&`;
      });
    }

    return query;
  }

  private ensureValidQuery() {
    if (!this._endpoint) {
      throw new Error("An endpoint must be set.");
    }
  }
}
