import { NextFunction, Request, Response } from "express"
import { IComposerService, IDatabaseComposer } from "./composer.model"
import { ISongComposerService } from "./songComposer.model"

//composer com seus songs correspondentes
export interface IComposerWithSongs extends IDatabaseComposer {
    songs: number[]
}

export interface IGetComposerWithRelationshipService {
    setDependencies(
        composerService: IComposerService,
        songComposerService: ISongComposerService,
    ): void
    getAll(): IComposerWithSongs[]
    getById(composerId: number): IComposerWithSongs | undefined
}

export interface IGetComposerWithRelationshipController {
    getAll(req: Request, res: Response, next: NextFunction): void
    getById(req: Request, res: Response, next: NextFunction): void
}
