import { PrismaClient } from "@prisma/client";
import {ISongComposerRepository, ISongComposer } from "../models/songComposer.model";

class SongComposerRepository implements ISongComposerRepository {
    constructor(private readonly database: PrismaClient) {}
    
    async getById(songId: number, composerId: number): Promise<ISongComposer | undefined> {
        const data = await this.database.song_composer.findUnique({where: {song_id_composer_id: {song_id: songId, composer_id: composerId}}})
            if(!data) return undefined
            return data
    }
    async create(songComposer: ISongComposer): Promise<void> {
        await this.database.song_composer.create({data: songComposer})
    }

    async delete(songId: number, composerId: number): Promise<void> {
        await this.database.song_composer.delete({where: {song_id_composer_id: {song_id: songId, composer_id: composerId}}})
    }
    async getByComposerId(composerId: number): Promise<ISongComposer[]> {
        return this.database.song_composer.findMany({where: {composer_id: composerId}})
    }
    async getBySongId(songId: number): Promise<ISongComposer[]> {
        return this.database.song_composer.findMany({where: {song_id: songId}})
    }

}

export default SongComposerRepository