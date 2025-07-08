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

// interface crud padrão
export interface iCrud<C, D>{
  getAll(): D[],
  getById(id: number): D | undefined,
  create(item: C): void,
  update(item: D): void,
  delete(id: number): void,
  
}

//validação para id vindo do cliente
export const idSchemaValidate = Joi.object().keys({
  name: Joi.number().min(1).required()
});
