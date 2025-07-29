import { ISongRepository, IDatabaseSong, IClientSong } from "../models/song.model";
import Database from "better-sqlite3";

class SongRepository implements ISongRepository {
    constructor(private readonly database: Database.Database) {}
getAll(): IDatabaseSong[] {
        return this.database.prepare(`
            SELECT s.id AS songId, s.name AS songName, s.year AS songYear, s.duration AS songDuration
            FROM songs AS s
            ORDER BY s.year DESC;
            `).all() as IDatabaseSong[]
    }
    getById(id: number): IDatabaseSong | undefined {
        const song =  this.database.prepare(`
            SELECT s.id AS songId, s.name AS songName, s.year AS songYear, s.duration AS songDuration
            FROM songs AS s
            WHERE s.id = ?;
            `).get(id)

            if(!song) return undefined
            return song as IDatabaseSong
    }
    create(song: IClientSong): number {
        const data = this.database.prepare(`
            INSERT INTO songs (name, year, duration)
            VALUES (?, ?, ?);
            `).run(song.songName, song.songYear, song.songDuration).lastInsertRowid

        return Number(data)
    }
    update(song: IDatabaseSong): void {
        this.database.prepare(`
            UPDATE songs
            SET name = ?, year = ?, duration = ?
            WHERE songs.id = ?;
            `).run(song.songName, song.songYear, song.songDuration, song.songId)
    }
    delete(id: number): void {
        this.database.prepare(`
            DELETE FROM songs
            WHERE id = ?;
            `).run(id)
    }
}

export default SongRepository