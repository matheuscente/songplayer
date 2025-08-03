import { NextFunction, Request, Response } from "express"
import { IAlbumService, IDatabaseAlbum } from "./album.model"
import { IDatabaseSong, ISongService } from "./song.model"
import { Joi } from "celebrate"
import { PrismaTransactionClient } from "./global.model"

//interface da entidade sem id
export interface ISongAlbum {
    song_id: number,
    album_id: number 
}

//musica com seus albuns correspondentes
export interface ISongWithAlbums extends IDatabaseSong {
    albums: IDatabaseAlbum[]
}

//interface de retorno do repository da relação
export type AlbumAndSongReturns = IDatabaseAlbum & IDatabaseSong


//interface de service
export interface ISongAlbumService{
    setDependencies(songService: ISongService, albumService: IAlbumService): void,
    create(songAlbum: ISongAlbum): Promise<void>,
    delete(songId: number, albumId: number): Promise<void>,
    getById(songId: number, albumId: number):  Promise<ISongAlbum | undefined>,
    getByAlbumId(albumId: number): Promise<ISongAlbum[]>,
    getBySongId(songId: number):  Promise<ISongAlbum[]>
}

//interface de controller
export interface ISongAlbumController {
    create(req: Request, res: Response, next: NextFunction): void,
    delete(req: Request, res: Response, next: NextFunction): void
}

//interface de repository
export interface ISongAlbumRepository {
    create(songAlbum: ISongAlbum, tx: PrismaTransactionClient): Promise<void>,
    delete(songId: number, albumId: number, tx: PrismaTransactionClient): Promise<void>,
    getById(songId: number, albumId: number, tx?: PrismaTransactionClient):  Promise<ISongAlbum | undefined>,
    getByAlbumId(albumId: number, tx?: PrismaTransactionClient): Promise<ISongAlbum[]>,
    getBySongId(songId: number, tx?: PrismaTransactionClient):  Promise<ISongAlbum[]>
}



//validação para songAlbum vinda do cliente

export const songAlbumSchemaValidate = Joi.object().keys({
    song_id: Joi.number().min(1).required(),
    album_id: Joi.number().min(1).required()
})
.options({abortEarly: false})
