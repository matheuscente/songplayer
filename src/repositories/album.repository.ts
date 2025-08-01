import { PrismaClient } from "@prisma/client";
import {
  IAlbumRepository,
  IClientAlbum,
  IDatabaseAlbum,
} from "../models/album.model";

class AlbumRepository implements IAlbumRepository {
  constructor(private readonly database: PrismaClient) {}

  getByArtistId(id: number): Promise<IDatabaseAlbum[]> {
    return this.database.albums.findMany({
      where: {artist_id: id}
    }) as Promise<IDatabaseAlbum[]>
  }

  async getAll(): Promise<IDatabaseAlbum[]> {
    return this.database.albums.findMany() as Promise<IDatabaseAlbum[]>
  }
  async getById(id: number): Promise<IDatabaseAlbum | undefined> {
    const album = await this.database.albums.findUnique({
      where: {id}
    })

    if (!album) return undefined;
    return album as IDatabaseAlbum;
  }

  async create(album: IClientAlbum): Promise<number> {
    const data = await this.database.albums.create({data: album})
    return Number(data.id);
  }
  async update(album: IDatabaseAlbum): Promise<void> {
    await this.database.albums.update({data: album, where: {id: album.id}})
  }
  async delete(id: number): Promise<void> {
    await this.database.albums.delete({where: {id}})
  }
}

export default AlbumRepository;
