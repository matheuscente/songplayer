import { IComposerRepository, IClientComposer, IDatabaseComposer } from "../models/composer.model";
import Database from "better-sqlite3";

class ComposerRepository implements IComposerRepository {
    constructor(private readonly database: Database.Database) {}
getAll(): IDatabaseComposer[] {
        return this.database.prepare(`
            SELECT c.id AS composerId, c.name AS composerName
            FROM composers AS c
            `).all() as IDatabaseComposer[]
    }
    getById(id: number): IDatabaseComposer | undefined {
        const composer =  this.database.prepare(`
            SELECT c.id AS composerId, c.name AS composerName
            FROM composers AS c
            WHERE c.id = ?;
            `).get(id)

            if(!composer) return undefined
            return composer as IDatabaseComposer
    }
    create(composer: IClientComposer): number {
        const data = this.database.prepare(`
            INSERT INTO composers (name)
            VALUES (?);
            `).run(composer.composerName).lastInsertRowid

        return Number(data)
    }
    update(composer: IDatabaseComposer): void {
        this.database.prepare(`
            UPDATE composers AS c
            SET name = ?
            WHERE c.id = ?;
            `).run(composer.composerName, composer.composerId)
    }
    delete(id: number): void {
        this.database.prepare(`
            DELETE FROM composers
            WHERE id = ?;
            `).run(id)
    }
}

export default ComposerRepository