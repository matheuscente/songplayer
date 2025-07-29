import { Joi } from "celebrate";
import { ICrud, ICrudController} from "./global.model";

export interface IClientComposer {
  composerName: string
}

export interface IDatabaseComposer extends IClientComposer {
  composerId: number
}

export type UpdateComposer = Partial<IClientComposer> & Pick<IDatabaseComposer, 'composerId'>


//interface repository
export interface IComposerRepository extends ICrud<IClientComposer, IDatabaseComposer, UpdateComposer> {}

//interface de controller
export interface IComposerController extends ICrudController {}

//interface service
export interface IComposerService extends ICrud<IClientComposer, IDatabaseComposer, UpdateComposer> {}

//validação para compositor vindo do cliente
export const composerSchemaValidate = Joi.object().keys({
  composerName: Joi.string().max(255).min(1).required()
})
.options({abortEarly: false});

export const composerUpdateSchemaValidate = Joi.object().keys({
  composerName: Joi.string().max(255).min(1).required(),
  composerId: Joi.number().min(1).required()
})
.options({abortEarly: false});


