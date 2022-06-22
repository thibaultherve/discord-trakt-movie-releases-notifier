import MutationQuery, { MutationResult } from "./MutationQuery";

export type DeletionResult = Pick<Required<MutationResult>, "changes">;

export default abstract class DeletionQuery extends MutationQuery<DeletionResult> {}
