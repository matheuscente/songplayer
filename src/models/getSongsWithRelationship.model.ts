import { IDatabaseSong, ISongService} from "./song.model"
import { ISongAlbumService } from "./songAlbum.model"
import { ISongComposerService } from "./songComposer.model"
import { NextFunction, Request, Response } from "express"

//song com seus composers e albuns correspondentes
export interface ISongWithComposersAndAlbums extends IDatabaseSong {
    composers: ({composerId: number, composition: string})[]
    albums: number[]
}

export interface IGetSongWithRelationshipService {
    setDependencies(
        songService: ISongService,
        songAlbumService: ISongAlbumService,
        songComposerService: ISongComposerService,
    ): void
    getAll(): ISongWithComposersAndAlbums[]
    getById(composerId: number): ISongWithComposersAndAlbums | undefined
}

export interface IGetSongWithRelationshipController {
    getAll(req: Request, res: Response, next: NextFunction): void
    getById(req: Request, res: Response, next: NextFunction): void
}

