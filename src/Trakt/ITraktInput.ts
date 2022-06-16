import { ITraktRelease } from "./ITraktResponse";

export interface ITraktReleaseInput {
  idMovie: number;
  releases: ITraktRelease[];
}
