import MutationQuery, { MutationResult } from "./MutationQuery";

export type InsertionResult = Required<MutationResult>;

export default abstract class InsertionQuery extends MutationQuery<InsertionResult> {}
