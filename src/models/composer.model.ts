import { Joi } from "celebrate";
import { iId, iName } from "./global.model";

export type Composer = iName

export type DatabaseComposer = Composer & iId

//validação para compositor vindo do cliente
export const composerSchemaValidate = Joi.object().keys({
  name: Joi.string().max(255).min(1).required(),
});

