import { Joi } from "celebrate";
import { ICrud, ICrudController, ICrudRepository } from "./global.model"
import { IAlbumService } from "./album.model";

export interface IClientArtist {
    nationality: string
    name: string
}

//artista armarzenado no database
export interface IDatabaseArtist extends IClientArtist {
  id: number
}

export type UpdateArtist = Partial<IClientArtist> & Pick<IDatabaseArtist, 'id'>


//interface de artista repository
export interface IArtistRepository extends ICrudRepository<IClientArtist, IDatabaseArtist, UpdateArtist> {}

//interface de controller
export interface IArtistController extends ICrudController {}

//interface de artista service
export interface IArtistService extends ICrud<IClientArtist, IDatabaseArtist, UpdateArtist> {
  setDependencies(albumService: IAlbumService): void
}



//validação para artista vindo do cliente
export const artistSchemaValidate = Joi.object().keys({
  name: Joi.string().max(255).min(1).required(),
  nationality: Joi.string().max(255).min(2).required()
})
 .options({ abortEarly: false });;

export const artistUpdateSchemaValidate = artistSchemaValidate.fork(
  ['name', 'nationality'],
  (schema) => schema.optional()
).keys({
 id: Joi.number().min(1).required()
}).or('name', 'nationality')
 .options({ abortEarly: false });
