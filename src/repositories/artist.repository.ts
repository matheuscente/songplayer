import { IArtistRepository, IClientArtist, IDatabaseArtist } from "../models/artist.model";
import Database from "better-sqlite3";

class ArtistRepository implements IArtistRepository {
    constructor(private readonly database: Database.Database) {}
getAll(): IDatabaseArtist[] {
        return this.database.prepare(`
            SELECT a.id AS artistId, a.name AS artistName, a.nationality AS artistNationality
            FROM artists AS a;
            `).all() as IDatabaseArtist[]
    }
    getById(id: number): IDatabaseArtist | undefined {
        const artist =  this.database.prepare(`
            SELECT a.id AS artistId, a.name AS artistName, a.nationality AS artistNationality
            FROM artists AS a
            WHERE a.id = ?;
            `).get(id)

            if(!artist) return undefined
            return artist as IDatabaseArtist
    }

    create(artist: IClientArtist): number {
        const data = this.database.prepare(`
            INSERT INTO artists (name, nationality)
            VALUES (?,?);
            `).run(artist.artistName,artist.artistNationality).lastInsertRowid

        return Number(data)
    }
    update(artist: IDatabaseArtist): void {
        this.database.prepare(`
            UPDATE artists AS a
            SET name = ?, nationality = ?
            WHERE a.id = ?;
            `).run(artist.artistName, artist.artistNationality, artist.artistId)
    }
    delete(id: number): void {
        this.database.prepare(`
            DELETE FROM artists
            WHERE id = ?;
            `).run(id)
    }
}

export default ArtistRepository