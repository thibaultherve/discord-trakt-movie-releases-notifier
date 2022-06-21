import IFormattable from "../../Formatters/IFormattable";
import { ITraktMovieInsert } from "./ITraktMovie";

export interface ITraktMoviesInsert extends IFormattable {
  movies: ITraktMovieInsert[];
}
