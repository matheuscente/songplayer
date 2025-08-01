import { PrismaClient } from "@prisma/client";
import { IArtistRepository, IClientArtist, IDatabaseArtist } from "../models/artist.model";

class ArtistRepository implements IArtistRepository {
    constructor(private readonly database: PrismaClient) {}
    async getAll(): Promise<IDatabaseArtist[]> {
        return this.database.artists.findMany() as Promise<IDatabaseArtist[]>
    }
     async getById(id: number): Promise<IDatabaseArtist | undefined> {
        const artist =  this.database.artists.findUnique({where: {id}})
            return artist as Promise<IDatabaseArtist>
    }

     async create(artist: IClientArtist): Promise<number> {
        const data = await this.database.artists.create({data: artist})
        return Number(data.id)
    }
     async update(artist: IDatabaseArtist): Promise<void> {
        this.database.artists.update({data: artist, where: {id: artist.id}})
    }
     async delete(id: number): Promise<void> {
        this.database.artists.delete({where: {id}})
     }
}

export default ArtistRepository