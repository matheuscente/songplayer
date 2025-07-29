import { Joi } from "celebrate"
import { NextFunction, Request, Response } from "express"
import { ISongService } from "./song.model"
import { IComposerService } from "./composer.model"

//interface da entidade sem id
export interface ISongComposer {
    songId: number,
    composerId: number,
    composition: string
}



//interface de controller
export interface ISongComposerController {
    create(req: Request, res: Response, next: NextFunction): void,
    delete(req: Request, res: Response, next: NextFunction): void
}



//interface de service
export interface ISongComposerService{
    setDependencies(songService: ISongService, composerService: IComposerService): void
    getById(songId: number, composerId: number): ISongComposer |  undefined,
    getByComposerId(composerId: number): ISongComposer[],
    getBySongId(songId: number): ISongComposer[],
    create(songComposer: ISongComposer): void,
    delete(songId: number, composerId: number): void,
}

//interface de repository
export interface ISongComposerRepository {
    getById(songId: number, composerId: number): ISongComposer | undefined,
    getByComposerId(composerId: number): ISongComposer[],
    getBySongId(songId: number): ISongComposer[],
    create(songComposer: ISongComposer): void,
    delete(songId: number, composerId: number): void
}

//validação para songAlbum vinda do cliente
export const songComposerSchemaValidate = Joi.object().keys({
  songId: Joi.number().min(1).required(),
  composerId: Joi.number().min(1).required(),
  composition: Joi.string().min(3).max(255).required()
})

export const songComposerGetByIdSchemaValidate = Joi.object().keys({
  songId: Joi.number().min(1).required(),
  composerId: Joi.number().min(1).required()
})
.options({
    abortEarly: false
});
