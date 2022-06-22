import { ITraktMoviesInsert } from "../Schema/ITraktMovies";
import Transaction from "../Query/Transaction";
import Repository from "./Repository";
import InsertMovie from "../Query/Trakt/InsertMovie";
import InsertRelease from "../Query/Trakt/InsertRelease";
import InsertAlias from "../Query/Trakt/InsertAlias";
import { DeletionResult } from "../Query/DeletionQuery";
import DeleteRecords from "../Query/Trakt/DeleteRecords";
import { Release } from "../../Utils/Constants";
import MoviesAggregate, { TraktMoviesAggregate } from "../Query/Trakt/MoviesAggregate";

export default class TraktRepository extends Repository {
  public async moviesAggregate(release: Release, country: string): Promise<TraktMoviesAggregate[]> {
    return new MoviesAggregate(this.database, release, country).call();
  }

  public async saveToDatabase(data: ITraktMoviesInsert): Promise<void> {
    return new Transaction(this.database).call(async () => {
      for (const movie of data.movies) {
        try {
          const movieId = (await new InsertMovie(this.database, movie).call()).lastID;

          for (const release of movie.releases) {
            try {
              await new InsertRelease(this.database, movieId, release).call();
            } catch (releaseError: any) {
              releaseError.message = `Error while inserting release for movieId ${movieId}`;
              throw releaseError;
            }
          }

          for (const alias of movie.aliases) {
            try {
              await new InsertAlias(this.database, movieId, alias).call();
            } catch (aliasError: any) {
              aliasError.message = `Error while inserting alias for movieId ${movieId}`;
              throw aliasError;
            }
          }
        } catch (movieError: any) {
          movieError.message = `Error while inserting movie : ${movie.trakt_movie_id} : ${movie.title} (${movie.year})`;
          throw movieError;
        }
      }
      return;
    });
  }

  public async deleteRecords(): Promise<DeletionResult> {
    return new DeleteRecords(this.database).call();
  }
}
