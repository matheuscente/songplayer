import { Joi } from "celebrate";
import { iId, Duration } from "./global.model"

export interface iAlbum {
    title: string,
    year: number,
    songsNumber: number,
    artistId: number
}



//album armarzenado no database
export type DatabaseAlbum = iAlbum & iId & Duration<number>

//album vindo do cliente
export type ClientAlbum = iAlbum & Duration<string>

//interface do repository de albums
export interface iSongRepository {
  getAll(): DatabaseAlbum[],
  getById(id: number): DatabaseAlbum | undefined,
  create(song: ClientAlbum): void,
  update(id: number, song: ClientAlbum): void,
  delete(id: number): void,
  
}


//validação para album vindo do cliente
export const albumSchemaValidate = Joi.object().keys({
  title: Joi.string().max(255).min(1).required(),
  year: Joi.number().max(new Date().getFullYear()).required(),
  songsNumber: Joi.number().min(1).required(),
  artistId: Joi.number().min(1).required(),
  duration: Joi.string()
    .pattern(/^\d{1,3}:[0-5]\d:[0-5]\d$/)
    .messages({
      "string.pattern.base": "O campo deve estar no formato HH:MM:SS",
      "string.empty": "O campo é obrigatório"
    }).required(),
});

