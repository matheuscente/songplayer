import {ISongAlbumRepository, ISongAlbum} from "../models/songAlbum.model";
import Database from "better-sqlite3";

class SongAlbumRepository implements ISongAlbumRepository {
    constructor(private readonly database: Database.Database) {}
    getById(songId: number, albumId: number): ISongAlbum | undefined {
        const data = this.database.prepare(`
            SELECT sa.album_id AS albumId, 
            sa.song_id AS songId
            FROM song_album AS sa
            WHERE sa.song_id = ? AND sa.album_id = ?;
            `).get(songId, albumId) 

        if(!data) return undefined

        return data as ISongAlbum
    }

    create(songAlbum: ISongAlbum): void {
        this.database.prepare(`
            INSERT INTO song_album (song_id, album_id)
            VALUES (?,?);
            `).run(songAlbum.songId, songAlbum.albumId)
    }

    delete(songId: number, albumId: number): void {
        this.database.prepare(`
            DELETE FROM song_album
            WHERE song_id = ? AND album_id = ?;
            `).run(songId, albumId)
    }
    getByAlbumId(albumId: number): ISongAlbum[] {
        return this.database.prepare(`
            SELECT sa.album_id AS albumId, 
            sa.song_id AS songId
            FROM song_album AS sa
            WHERE sa.album_id = ?;
            `).all(albumId) as ISongAlbum[] 
    }
    getBySongId(songId: number): ISongAlbum[]  {
        return this.database.prepare(`
            SELECT sa.album_id AS albumId, 
            sa.song_id AS songId
            FROM song_album AS sa
            WHERE sa.song_id = ?;
            `).all(songId)  as ISongAlbum[] 
    }

}

export default SongAlbumRepository