import { iSongRepository, DatabaseSong, ClientSong } from "../models/song.model";
import Database from "better-sqlite3";

class SongRepository implements iSongRepository {
    constructor(private readonly database: Database.Database) {}
getAll(): DatabaseSong[] {
        return this.database.prepare(`
            SELECT s.name, s.year, s.duration
            FROM songs AS s
            ORDER BY s.year DESC;
            `).all() as DatabaseSong[]
    }
    getById(id: number): DatabaseSong | undefined {
        const song =  this.database.prepare(`
            SELECT s.name, s.year, s.duration
            FROM songs AS s
            WHERE s.id = ?;
            `).get(id)

            if(!song) return undefined
            return song as DatabaseSong
    }
    create(song: ClientSong): void {
        this.database.prepare(`
            INSERT INTO songs (name, year, duration)
            VALUES (?, ?, ?);
            `).run(song.name, song.year, song.duration)
    }
    update(song: DatabaseSong): void {
        this.database.prepare(`
            UPDATE songs
            SET name = ?, year = ?, duration = ?
            WHERE songs.id = ?;
            `).run(song.name, song.year, song.duration, song.id)
    }
    delete(id: number): void {
        this.database.prepare(`
            DELETE FROM songs
            WHERE id = ?;
            `).run(id)
    }
}

export default SongRepository