import Database from "better-sqlite3";
export class DbManager {
  private createTable(
    database: Database.Database,
    tableName: string,
    settings: string
  ): { success: true } | { success: false; error: Error } {
    try {
      database
        .prepare(
          `
                CREATE TABLE IF NOT EXISTS ${tableName} (
                ${settings}
            )
                `
        )
        .run();
      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }

  createAllTables(
    database: Database.Database
  ): { success: true } | { success: false; error: Error } {
    try {
      const songs = this.createTable(
        database,
        "songs",
        `   
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                year INT NOT NULL,
                duration INT NOT NULL`
      );

      const albums = this.createTable(
        database,
        "albums",
        `
         id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INT NOT NULL,
        songs_number INT NOT NULL,
        duration INT NOT NULL,
        artist_id INT NOT NULL,
        CONSTRAINT fk_artist_album FOREIGN KEY (artist_id)
        REFERENCES artists(id)
        `
      );

      const artists = this.createTable(
        database,
        "artists",
        `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        nationality TEXT NOT NULL
        `
      );

      const composers = this.createTable(
        database,
        "composers",
        `  
         id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        `
      );

       const songAlbum = this.createTable(
        database,
        "song_album",
        `  
         id INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id INT NOT NULL,
        album_id INT NOT NULL,
        CONSTRAINT fk_song_album FOREIGN KEY (song_id)
        REFERENCES songs(id),
        CONSTRAINT fk_album_song FOREIGN KEY (album_id)
        REFERENCES albums(id)
        `
      );

       const songComposer = this.createTable(
        database,
        "song_composer",
        `  
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id INT NOT NULL,
        composer_id INT NOT NULL,
        CONSTRAINT fk_song_composer FOREIGN KEY (song_id)
        REFERENCES songs(id),
        CONSTRAINT fk_composer_song FOREIGN KEY (composer_id)
        REFERENCES composers(id)
        `
      );

      if ("error" in songs) {
        return songs;
      } else if ("error" in albums) {
        return albums;
      } else if ("error" in artists) {
        return artists;
      }  else if ("error" in composers) {
        return composers;
      } else if ("error" in songAlbum) {
        return songAlbum;
      } else if ("error" in songComposer) {
        return songComposer;
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }

  testDatabase(database: Database.Database) {
    const allTables = database
      .prepare("SELECT name FROM sqlite_master WHERE type='table';")
      .all();
    const acceptNames: string[] = [
      "songs",
      "composers",
      "albums",
      "artists",
      "song_composer",
      "song_album",
      "sqlite_sequence",
    ];

    const hasErrors = allTables.filter(
      (table) => !acceptNames.includes((table as { name: string }).name)
    );
    if (hasErrors.length >= 1 || allTables.length < 5) {
      return { success: false, error: new Error("invalid table name") };
    }
    return { success: true };
  }
}
