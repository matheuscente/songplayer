import { PrismaClient } from "@prisma/client";
import { ISongRepository, IDatabaseSong, IClientSong } from "../models/song.model";
import { PrismaTransactionClient } from "../models/global.model";

class SongRepository implements ISongRepository {
    constructor(private readonly database: PrismaClient) {}
    async getAll(): Promise<IDatabaseSong[]> {
        return this.database.songs.findMany()
    }
    async getById(id: number): Promise<IDatabaseSong | undefined> {
        const song =  await this.database.songs.findUnique({where: {id}})
            if(!song) return undefined
            return song
    }
    async create(song: IClientSong, tx: PrismaTransactionClient): Promise<number> {
        const data = await tx.songs.create({data: {
                name: song.name,
                year: song.year,
                duration: Number(song.duration)
            }})
        return Number(data.id)
    }
    async update(song: IDatabaseSong, tx: PrismaTransactionClient): Promise<void> {
            await tx.songs.update({data: {
                name: song.name,
                year: song.year,
                duration: Number(song.duration)
            }, where: {id: song.id}})
        }
    
    async delete(id: number, tx: PrismaTransactionClient): Promise<void> {
        await tx.songs.delete({where: {id}})
    }
}

export default SongRepository