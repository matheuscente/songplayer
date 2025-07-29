import { NextFunction, Request, Response } from "express"
import { IAlbumService } from "./album.model"
import { IArtistService, IDatabaseArtist } from "./artist.model"

export interface IArtistWithAlbums extends IDatabaseArtist {
    albums:  number[]
}


export interface IGetArtistWithRelationshipService {
    setDependencies(
        artistService: IArtistService,
        albumService: IAlbumService,
    ): void
    getAll(): IArtistWithAlbums[]
    getById(composerId: number): IArtistWithAlbums | undefined
}

export interface IGetArtistWithRelationshipController {
    getAll(req: Request, res: Response, next: NextFunction): void
    getById(req: Request, res: Response, next: NextFunction): void
}