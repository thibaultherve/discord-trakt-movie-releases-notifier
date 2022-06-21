import IFormattable from "../../Formatters/IFormattable";
import { ITraktReleaseInsert } from "./ITraktRelease";
import { ITraktAliasInsert } from "./ITraktAlias";

export default interface ITraktMovie extends IFormattable {
  id: number;
  title: string;
  year: number;
}

export interface ITraktMovieInsert extends ITraktMovie {
  releases: ITraktReleaseInsert[];
  aliases: ITraktAliasInsert[];
}
