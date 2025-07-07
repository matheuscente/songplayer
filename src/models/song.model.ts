import { iId, Duration, iName } from "./global.model";
import { Joi } from "celebrate";

type Song = {
  year: number;
} & iName;

//musica armarzenada no database
export type DatabaseSong = Song & iId & Duration<number>;

//musica vinda do cliente
export type ClientSong = Song & Duration<string>;

//validação para musica vinda do cliente
export const songSchemaValidate = Joi.object().keys({
  name: Joi.string().max(150).min(1).required(),
  year: Joi.number().max(new Date().getFullYear()).required(),
  duration: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .messages({
      "string.pattern.base": "O campo deve estar no formato HH:MM:SS",
      "string.empty": "O campo é obrigatório"
    }).required(),
});
