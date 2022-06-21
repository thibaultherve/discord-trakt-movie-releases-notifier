import Query from "./Query";

export interface MutationResult {
  /**
   * Row id of the inserted row.
   *
   * Only contains valid information when the query was a successfully
   * completed INSERT statement.
   */
  lastID?: number;
  /**
   * Number of rows changed.
   *
   * Only contains valid information when the query was a
   * successfully completed UPDATE or DELETE statement.
   */
  changes?: number;
}

export default abstract class MutationQuery<T = MutationResult> extends Query<T> {}
