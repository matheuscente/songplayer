import {ISongComposerRepository, ISongComposer } from "../models/songComposer.model";
import Database from "better-sqlite3";


class SongComposerRepository implements ISongComposerRepository {
    constructor(private readonly database: Database.Database) {}
    
    getById(songId: number, composerId: number): ISongComposer | undefined {
        const data = this.database.prepare(`
            SELECT sc.composer_id AS composerId, sc.song_id AS songId, sc.composition
            FROM song_composer AS sc
            WHERE sc.composer_id = ? AND sc.song_id = ?;
            `).get(composerId, songId)

            if(!data) return undefined
            return data as ISongComposer
    }
    create(songComposer: ISongComposer): void {
        this.database.prepare(`
            INSERT INTO song_composer (song_id, composer_id, composition)
            VALUES (?,?, ?);
            `).run(songComposer.songId, songComposer.composerId, songComposer.composition)
    }

    delete(songId: number, composerId: number): void {
        this.database.prepare(`
            DELETE FROM song_composer
            WHERE song_id = ? AND composerId = ?;
            `).run(songId, composerId)
    }
    getByComposerId(composerId: number): ISongComposer[] {
        return this.database.prepare(`
            SELECT sc.composer_id AS composerId, sc.song_id AS songId, sc.composition
            FROM song_composer AS sc
            WHERE sc.composer_id = ?;
            `).all(composerId) as ISongComposer[]
    }
    getBySongId(songId: number): ISongComposer[] {
        return this.database.prepare(`
            SELECT sc.composer_id AS composerId, sc.song_id AS songId, sc.composition
            FROM song_composer AS sc
            WHERE sc.song_id = ?;
            `).all(songId)  as ISongComposer[]
    }

}

export default SongComposerRepository