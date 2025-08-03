import { Joi } from "celebrate";
import { ICrud, ICrudController, ICrudRepository, PrismaTransactionClient } from "./global.model"
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
export interface IAlbumRepository extends ICrudRepository<IClientAlbum, IDatabaseAlbum, UpdateAlbum> {
    getByArtistId(id: number, tx?: PrismaTransactionClient): Promise<IDatabaseAlbum[]>
}

//interface de controller
export interface IAlbumController extends ICrudController {}

//interface service
export interface IAlbumService extends ICrud<IClientAlbum, IDatabaseAlbum, UpdateAlbum> {
  setDependencies(
      artistService: IArtistService,
      ): void
  getByArtistId(id: number, tx?: PrismaTransactionClient): Promise<IDatabaseAlbum[]>
}

//validação para album vindo do cliente
export const albumSchemaValidate = Joi.object().keys({
  title: Joi.string().max(255).min(1).required(),
  songs: Joi.array().items(Joi.number()),
  year: Joi.number().max(new Date().getFullYear()).required(),
  artist_id: Joi.number().min(1).required()
})
 .options({ abortEarly: false });;

export const albumUpdateSchemaValidate = albumSchemaValidate.fork(
  ['title', 'year', 'artist_id'],
  (schema) => schema.optional()
).keys({
  id: Joi.number().min(1).required()
}).or('title', 'year', 'artist_id').options({ abortEarly: false });;

