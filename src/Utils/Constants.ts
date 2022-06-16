import path from "path";

export class Constants {
  public static readonly PRODUCTION_ENV = process.env.NODE_ENV === "production";
  public static readonly DEVELOPMENT_ENV = process.env.NODE_ENV !== "production";

  public static readonly DEFAULT_DATABASE_FILE = path.resolve("./db/db.sqlite");
  public static readonly DEFAULT_DATABASE_MIGRATIONS_DIRECTORY = path.resolve("./src/Database/Migrations/");

  public static readonly TRAKT_API_KEY = process.env.TRAKT_API_KEY;
  public static readonly TRAKT_API_BEARER_TOKEN = process.env.TRAKT_API_BEARER_TOKEN;

  public static readonly TRAKT_USERNAME = process.env.TRAKT_USERNAME;
  public static readonly TRAKT_COUNTRY_RELEASE = process.env.TRAKT_COUNTRY_RELEASE;
  public static readonly TRAKT_LANGUAGE = process.env.TRAKT_LANGUAGE;
}

export enum Release {
  THEATRICAL = "theatrical",
  PHYSICAL = "physical",
  DIGITAL = "digital",
}
