export default interface ITraktRelease {
  country: string;
  certification: string | null;
  release_date: string;
  release_type: string;
  note: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITraktReleaseInsert extends Omit<ITraktRelease, "certification"> {}
