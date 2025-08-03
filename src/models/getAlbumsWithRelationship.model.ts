import { NextFunction, Request, Response } from "express"
import { IAlbumService, IDatabaseAlbum } from "./album.model"
import { IArtistWithAlbums, IGetArtistWithRelationshipService } from "./getArtistsWithRelationship.model"
import { ISongAlbumService } from "./songAlbum.model"
import { ISongService } from "./song.model"

//album com seu artista e musicas correspondentes
export interface IAlbumWithArtistAndSongs extends IDatabaseAlbum {
    artist: IArtistWithAlbums
    songs:  number[]
}

export interface IGetAlbumWithRelationshipService {
    setDependencies(
        artistsWithRelationship: IGetArtistWithRelationshipService,
        albumService: IAlbumService,
        songAlbumService: ISongAlbumService,
        songService: ISongService):void,
    getAll(): Promise<IAlbumWithArtistAndSongs[]>
    getById(composerId: number): Promise<IAlbumWithArtistAndSongs | undefined>
}

export interface IGetAlbumWithRelationshipController {
    getAll(req: Request, res: Response, next: NextFunction): void
    getById(req: Request, res: Response, next: NextFunction): void
}