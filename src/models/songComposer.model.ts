import { Joi } from "celebrate"
import { NextFunction, Request, Response } from "express"
import { ISongService } from "./song.model"
import { IComposerService } from "./composer.model"
import { PrismaTransactionClient } from "./global.model"

//interface da entidade sem id
export interface ISongComposer {
    song_id: number,
    composer_id: number,
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
    getById(songId: number, composerId: number): Promise<ISongComposer |  undefined>,
    getByComposerId(composerId: number): Promise<ISongComposer[]>,
    getBySongId(songId: number): Promise<ISongComposer[]>,
    create(songComposer: ISongComposer): Promise<void>,
    delete(songId: number, composerId: number): Promise<void>,
}

//interface de repository
export interface ISongComposerRepository {
    getById(songId: number, composerId: number): Promise<ISongComposer | undefined>,
    getByComposerId(composerId: number): Promise<ISongComposer[]>,
    getBySongId(songId: number): Promise<ISongComposer[]>,
    create(songComposer: ISongComposer, tx: PrismaTransactionClient): Promise<void>,
    delete(songId: number, composerId: number, tx: PrismaTransactionClient): Promise<void>
}

//validação para songAlbum vinda do cliente
export const songComposerSchemaValidate = Joi.object().keys({
  song_id: Joi.number().min(1).required(),
  composer_id: Joi.number().min(1).required(),
  composition: Joi.string().min(3).max(255).required()
})

export const songComposerGetByIdSchemaValidate = Joi.object().keys({
  song_id: Joi.number().min(1).required(),
  composer_id: Joi.number().min(1).required()
})
.options({
    abortEarly: false
});
