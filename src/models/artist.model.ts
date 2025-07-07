import { Joi } from "celebrate";
import { iId, iName } from "./global.model"

export type ClientArtist = {
    nationality: string
} & iName



//artista armarzenado no database
export type DatabaseArtist = ClientArtist & iId

//validação para artista vindo do cliente
export const artistSchemaValidate = Joi.object().keys({
  name: Joi.string().max(255).min(1).required(),
  nationality: Joi.string().max(255).min(2).required()
});
