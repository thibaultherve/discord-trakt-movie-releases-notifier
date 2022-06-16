export interface ITraktList {
  name: string;
  description: string;
  privacy: TraktListPrivacy;
  type: TraktListType;
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by: TraktListSortBy;
  sort_how: TraktListSortHow;
  created_at: string;
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: {
    trakt: number;
    slug: string;
  };
}

export enum TraktListPrivacy {
  PRIVATE = "private",
  FRIENDS = "friends",
  PUBLIC = "public",
}

export enum TraktListType {
  PERSONAL = "personal",
}

export enum TraktListSortBy {
  RANK = "rank",
  ADDED = "added",
  TITLE = "title",
  RELEASED = "released",
  RUNTIME = "runtime",
  POPULARITY = "popularity",
  PERCENTAGE = "percentage",
  VOTES = "votes",
  MY_RATING = "my_rating",
  RANDOM = "random",
  WATCHED = "watched",
  COLLECTED = "collected",
}

export enum TraktListSortHow {
  ASC = "asc",
  DESC = "desc",
}

export interface ITraktListMovieItem {
  rank: number;
  id: number;
  listed_at: string;
  notes: string;
  type: string;
  movie: ITraktMovie;
}

export interface ITraktMovie {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  tagline: string;
  overview: string;
  released: string | null;
  runtime: number;
  country: string;
  trailer: string;
  homepage: string;
  status: string;
  rating: number;
  votes: number;
  comment_count: number;
  updated_at: string;
  language: string;
  available_translations: string[];
  genres: string[];
  certification: string;
}

export interface ITraktRelease {
  country: string;
  certification: string | null;
  release_date: string;
  release_type: string;
  note: number | null;
}

export enum TraktMediaExtendedInfo {
  FULL = "full",
  METADATA = "metadata",
}
