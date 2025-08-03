import { PrismaClient } from "@prisma/client";
import { IArtistRepository, IClientArtist, IDatabaseArtist } from "../models/artist.model";
import { PrismaTransactionClient } from "../models/global.model";

class ArtistRepository implements IArtistRepository {
    constructor(private readonly database: PrismaClient) {}
    async getAll(tx = this.database): Promise<IDatabaseArtist[]> {
        return tx.artists.findMany() as Promise<IDatabaseArtist[]>
    }
     async getById(id: number,tx = this.database): Promise<IDatabaseArtist | undefined> {
        const artist =  await tx.artists.findUnique({where: {id}})
        if(!artist) return undefined
        return artist
    }

     async create(artist: IClientArtist, tx: PrismaTransactionClient): Promise<number> {
        const data = await tx.artists.create({data: artist})
        return Number(data.id)
    }
     async update(artist: IDatabaseArtist, tx: PrismaTransactionClient): Promise<void> {
        await tx.artists.update({data: artist, where: {id: artist.id}})
    }
     async delete(id: number, tx: PrismaTransactionClient): Promise<void> {
        await tx.artists.delete({where: {id}})
     }
}

export default ArtistRepository