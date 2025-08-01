import { PrismaClient } from "@prisma/client"
import {ISongAlbumRepository, ISongAlbum} from "../models/songAlbum.model"

class SongAlbumRepository implements ISongAlbumRepository {
    constructor(private readonly database: PrismaClient) {}
    async getById(songId: number, albumId: number): Promise<ISongAlbum | undefined> {
        const data = await this.database.song_album.findUnique({where: {song_id_album_id: {song_id: songId, album_id: albumId}}})
        if(!data) return undefined
        return data
    }

    async create(songAlbum: ISongAlbum): Promise<void> {
        await this.database.song_album.create({data: songAlbum})
    }

    async delete(songId: number, albumId: number): Promise<void> {
        await this.database.song_album.delete({where: {song_id_album_id: {song_id: songId, album_id: albumId}}})
    }
    async getByAlbumId(albumId: number): Promise<ISongAlbum[]> {
        return this.database.song_album.findMany({where: {album_id: albumId}})
    }
    async getBySongId(songId: number): Promise<ISongAlbum[]>  {
        return this.database.song_album.findMany({where: {song_id: songId}})
    }

}

export default SongAlbumRepository