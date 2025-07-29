import {
  IAlbumRepository,
  IClientAlbum,
  IDatabaseAlbum,
} from "../models/album.model";
import Database from "better-sqlite3";

class AlbumRepository implements IAlbumRepository {
  constructor(private readonly database: Database.Database) {}

  getByArtistId(id: number): IDatabaseAlbum[]{
    return this.database
      .prepare(
        `
            SELECT a.id AS albumId, a.title AS albumTitle, a.artist_id AS artistId
            FROM albums AS a
            WHERE a.artist_Id = ?;
            `
      )
      .all(id)  as IDatabaseAlbum[];
  }

  getAll(): IDatabaseAlbum[] {
    return this.database
      .prepare(
        `
            SELECT a.id AS albumId, a.title AS albumTitle
            FROM albums AS a;
            `
      )
      .all() as IDatabaseAlbum[];
  }
  getById(id: number): IDatabaseAlbum | undefined {
    const album = this.database
      .prepare(
        `
            SELECT a.id AS albumId, a.title AS albumTitle, a.artist_id AS artistId, a.year AS albumYear
            FROM albums AS a
            WHERE a.id = ?;
            `
      )
      .get(id);

    if (!album) return undefined;
    return album as IDatabaseAlbum;
  }

  create(album: IClientAlbum): number {
    const data = this.database
      .prepare(
        `
            INSERT INTO albums (title, year, artist_id)
            VALUES (?,?,?);
            `
      )
      .run(album.albumTitle, album.albumYear, album.artistId).lastInsertRowid;
    return Number(data);
  }
  update(album: IDatabaseAlbum): void {
    this.database
      .prepare(
        `
            UPDATE albums AS a
            SET title = ?, year = ?, artist_id = ?
            WHERE a.id = ?;
            `
      )
      .run(album.albumTitle, album.albumYear, album.artistId, album.albumId);
  }
  delete(id: number): void {
    this.database
      .prepare(
        `
            DELETE FROM albums
            WHERE id = ?;
            `
      )
      .run(id);
  }
}

export default AlbumRepository;
