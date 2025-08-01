
import {ICrud, ICrudController} from "./global.model";
import { Joi } from "celebrate";


interface Song {
  year: number,
  name: string,
  duration: number | string
}

//musica armarzenada no database
export interface IDatabaseSong extends Song {
  id: number
  duration: number
}

export type UpdateSong = Partial<IClientSong> & Pick<IDatabaseSong, 'id'>


//musica vinda do cliente
export interface IClientSong extends Song {
  duration: number
}

//interface service
export interface ISongService extends ICrud<IClientSong, IDatabaseSong, UpdateSong> {}

//interface de controller
export interface ISongController extends ICrudController {}

//interface do repository de musicas
export interface ISongRepository extends ICrud<IClientSong, IDatabaseSong, UpdateSong> {}

//validação para musica vinda do cliente
export const songSchemaValidate = Joi.object().keys({
  name: Joi.string().max(150).min(1).required(),
  albums: Joi.array().items(Joi.number()),
  year: Joi.number().max(new Date().getFullYear()).required(),
  duration: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .messages({
      "string.pattern.base": "O campo deve estar no formato HH:MM:SS",
      "string.empty": "O campo é obrigatório"
    }).required(),
})
 .options({ abortEarly: false });;

export const songUpdateSchemaValidate = songSchemaValidate.fork(
  ['name', 'year', 'duration', 'albums'],
  (schema) => schema.optional()
).keys({
  songId: Joi.number().min(1).required()
}).or('name', 'year', 'duration', 'albums')
 .options({ abortEarly: false });


