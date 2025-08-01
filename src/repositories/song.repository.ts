import { PrismaClient } from "@prisma/client";
import { ISongRepository, IDatabaseSong, IClientSong } from "../models/song.model";

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
    async create(song: IClientSong): Promise<number> {
        const data = await this.database.songs.create({data: song})
        return Number(data)
    }
    async update(song: IDatabaseSong): Promise<void> {

        this.database.songs.update({data: song, where: {id: song.id}})
    }
    async delete(id: number): Promise<void> {
        this.database.songs.delete({where: {id}})
    }
}

export default SongRepository