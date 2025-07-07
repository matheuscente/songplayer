import { Joi } from "celebrate";

export interface iId {
    id: number
}

export type Duration <T> = {
    duration: T
}

export interface iName {
    name: string
}

//validação para id vindo do cliente
export const idSchemaValidate = Joi.object().keys({
  name: Joi.number().min(1).required()
});
