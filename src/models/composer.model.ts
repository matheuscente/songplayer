import { Joi } from "celebrate";
import { ICrud, ICrudController} from "./global.model";

export interface IClientComposer {
  name: string
}

export interface IDatabaseComposer extends IClientComposer {
  id: number
}

export type UpdateComposer = Partial<IClientComposer> & Pick<IDatabaseComposer, 'id'>


//interface repository
export interface IComposerRepository extends ICrud<IClientComposer, IDatabaseComposer, UpdateComposer> {}

//interface de controller
export interface IComposerController extends ICrudController {}

//interface service
export interface IComposerService extends ICrud<IClientComposer, IDatabaseComposer, UpdateComposer> {}

//validação para compositor vindo do cliente
export const composerSchemaValidate = Joi.object().keys({
  name: Joi.string().max(255).min(1).required()
})
.options({abortEarly: false});

export const composerUpdateSchemaValidate = Joi.object().keys({
  name: Joi.string().max(255).min(1).required(),
  id: Joi.number().min(1).required()
})
.options({abortEarly: false});


