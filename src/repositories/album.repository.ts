import { PrismaClient } from "@prisma/client";
import {PrismaTransactionClient} from "../models/global.model"
import {
  IAlbumRepository,
  IClientAlbum,
  IDatabaseAlbum,
} from "../models/album.model";

class AlbumRepository implements IAlbumRepository {
  constructor(private readonly database: PrismaClient) {}

  getByArtistId(id: number, tx = this.database): Promise<IDatabaseAlbum[]> {
    return tx.albums.findMany({
      where: {artist_id: id}
    })
  }

  async getAll(tx = this.database): Promise<IDatabaseAlbum[]> {
    return tx.albums.findMany()
  }
  async getById(id: number, tx = this.database): Promise<IDatabaseAlbum | undefined> {
    const album = await tx.albums.findUnique({
      where: {id}
    })

    if (!album) return undefined;
    return album
  }

  async create(album: IClientAlbum, prisma: PrismaTransactionClient): Promise<number> {
    const data = await prisma.albums.create({data: album})
    return Number(data.id);
  }
  async update(album: IDatabaseAlbum, prisma: PrismaTransactionClient): Promise<void> {
    await prisma.albums.update({data: album, where: {id: album.id}})
  }
  async delete(id: number, prisma: PrismaTransactionClient): Promise<void> {
    await prisma.albums.delete({where: {id}})
  }
}

export default AlbumRepository;
