import { PrismaClient } from "@prisma/client";
import {ISongComposerRepository, ISongComposer } from "../models/songComposer.model";
import { PrismaTransactionClient } from "../models/global.model";

class SongComposerRepository implements ISongComposerRepository {
    constructor(private readonly database: PrismaClient) {}
    
    async getById(songId: number, composerId: number, tx = this.database): Promise<ISongComposer | undefined> {
        const data = await tx.song_composer.findUnique({where: {song_id_composer_id: {song_id: songId, composer_id: composerId}}})
            if(!data) return undefined
            return data
    }
    async create(songComposer: ISongComposer, tx: PrismaTransactionClient): Promise<void> {
        await tx.song_composer.create({data: songComposer})
    }

    async delete(songId: number, composerId: number, tx: PrismaTransactionClient): Promise<void> {
        await tx.song_composer.delete({where: {song_id_composer_id: {song_id: songId, composer_id: composerId}}})
    }
    async getByComposerId(composerId: number, tx = this.database): Promise<ISongComposer[]> {
        return tx.song_composer.findMany({where: {composer_id: composerId}})
    }
    async getBySongId(songId: number, tx = this.database): Promise<ISongComposer[]> {
        return tx.song_composer.findMany({where: {song_id: songId}})
    }

}

export default SongComposerRepository