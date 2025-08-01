import { Joi } from "celebrate";
import { ICrud, ICrudController } from "./global.model"
import { IArtistService } from "./artist.model";

export interface IAlbum {
    title: string,
    year: number,
    artist_id: number,
    duration?: string | number,
    songs_number?: number
}

export type UpdateAlbum = Partial<IClientAlbum> & Pick<IDatabaseAlbum, 'id'>


//album armarzenado no database
export interface IDatabaseAlbum extends IAlbum {
  id: number,
}

//album vindo do cliente
export interface IClientAlbum extends IAlbum {}

//interce repository
export interface IAlbumRepository extends ICrud<IClientAlbum, IDatabaseAlbum, UpdateAlbum> {
    getByArtistId(id: number): Promise<IDatabaseAlbum[]>
}

//interface de controller
export interface IAlbumController extends ICrudController {}

//interface service
export interface IAlbumService extends ICrud<IClientAlbum, IDatabaseAlbum, UpdateAlbum> {
  setDependencies(
      artistService: IArtistService,
      ): void
  getByArtistId(id: number): Promise<IDatabaseAlbum[]>
}

//validação para album vindo do cliente
export const albumSchemaValidate = Joi.object().keys({
  albumTitle: Joi.string().max(255).min(1).required(),
  songs: Joi.array().items(Joi.number()),
  albumYear: Joi.number().max(new Date().getFullYear()).required(),
  artistId: Joi.number().min(1).required()
})
 .options({ abortEarly: false });;

export const albumUpdateSchemaValidate = albumSchemaValidate.fork(
  ['title', 'year', 'artist_id'],
  (schema) => schema.optional()
).keys({
  albumId: Joi.number().min(1).required()
}).or('title', 'yar', 'artist_id').options({ abortEarly: false });;

