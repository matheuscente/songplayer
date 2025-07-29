
import {ICrud, ICrudController} from "./global.model";
import { Joi } from "celebrate";


interface Song {
  songYear: number,
  songName: string,
  songDuration: number | string
}

//musica armarzenada no database
export interface IDatabaseSong extends Song {
  songId: number
}

export type UpdateSong = Partial<IClientSong> & Pick<IDatabaseSong, 'songId'>


//musica vinda do cliente
export interface IClientSong extends Song {
}

//interface service
export interface ISongService extends ICrud<IClientSong, IDatabaseSong, UpdateSong> {}

//interface de controller
export interface ISongController extends ICrudController {}

//interface do repository de musicas
export interface ISongRepository extends ICrud<IClientSong, IDatabaseSong, UpdateSong> {}

//validação para musica vinda do cliente
export const songSchemaValidate = Joi.object().keys({
  songName: Joi.string().max(150).min(1).required(),
  albums: Joi.array().items(Joi.number()),
  songYear: Joi.number().max(new Date().getFullYear()).required(),
  songDuration: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .messages({
      "string.pattern.base": "O campo deve estar no formato HH:MM:SS",
      "string.empty": "O campo é obrigatório"
    }).required(),
})
 .options({ abortEarly: false });;

export const songUpdateSchemaValidate = songSchemaValidate.fork(
  ['songName', 'songYear', 'songDuration', 'albums'],
  (schema) => schema.optional()
).keys({
  songId: Joi.number().min(1).required()
}).or('songName', 'songYear', 'songDuration', 'albums')
 .options({ abortEarly: false });


