--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

PRAGMA auto_vacuum = incremental;

CREATE TABLE trakt_movies
(
    id      INTEGER PRIMARY KEY,
    title   TEXT NOT NULL,
    year    INTEGER
);
CREATE INDEX trakt_movie_ix_title ON trakt_movies (title);


CREATE TABLE trakt_releases
(
    id              INTEGER PRIMARY KEY,
    trakt_movie_id  INTEGER NOT NULL,
    country         TEXT    NOT NULL,
    release_date    TEXT,
    release_type    TEXT    NOT NULL,
    note            TEXT,

    UNIQUE(trakt_movie_id,country,release_type,note)

    CONSTRAINT trakt_release_fk_movie_id FOREIGN KEY (trakt_movie_id)
        REFERENCES trakt_movies (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX trakt_release_ix_movie_id ON trakt_releases (trakt_movie_id);
CREATE INDEX trakt_release_ix_country ON trakt_releases (country);
CREATE INDEX trakt_release_ix_release_type ON trakt_releases (release_type);


CREATE TABLE trakt_aliases
(
    id              INTEGER PRIMARY KEY,
    trakt_movie_id  INTEGER NOT NULL,
    title           TEXT NOT NULL,
    country         TEXT NOT NULL,

    UNIQUE(title,country),

    CONSTRAINT trakt_alias_fk_movie_id FOREIGN KEY (trakt_movie_id)
        REFERENCES trakt_movies (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX trakt_alias_ix_movie_id ON trakt_aliases (trakt_movie_id);
CREATE INDEX trakt_alias_ix_country ON trakt_aliases (country);



--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX trakt_movie_ix_title;
DROP TABLE trakt_movies;
DROP INDEX trakt_release_ix_movie_id;
DROP INDEX trakt_release_ix_country;
DROP INDEX trakt_release_ix_release_type;
DROP TABLE trakt_releases;
DROP INDEX trakt_alias_ix_movie_id;
DROP INDEX trakt_alias_ix_country;
DROP TABLE trakt_aliases;
