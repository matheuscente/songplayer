import { Joi } from "celebrate";
import { ICrud, ICrudController } from "./global.model"
import { IAlbumService } from "./album.model";

export interface IClientArtist {
    artistNationality: string
    artistName: string
}

//artista armarzenado no database
export interface IDatabaseArtist extends IClientArtist {
  artistId: number
}

export type UpdateArtist = Partial<IClientArtist> & Pick<IDatabaseArtist, 'artistId'>


//interface de artista repository
export interface IArtistRepository extends ICrud<IClientArtist, IDatabaseArtist, UpdateArtist> {}

//interface de controller
export interface IArtistController extends ICrudController {}

//interface de artista service
export interface IArtistService extends ICrud<IClientArtist, IDatabaseArtist, UpdateArtist> {
  setDependencies(albumService: IAlbumService): void
}



//validação para artista vindo do cliente
export const artistSchemaValidate = Joi.object().keys({
  artistName: Joi.string().max(255).min(1).required(),
  artistNationality: Joi.string().max(255).min(2).required()
})
 .options({ abortEarly: false });;

export const artistUpdateSchemaValidate = artistSchemaValidate.fork(
  ['artistName', 'artistNationality'],
  (schema) => schema.optional()
).keys({
  artistId: Joi.number().min(1).required()
}).or('artistName', 'artistNationality')
 .options({ abortEarly: false });
