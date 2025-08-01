import { Joi } from "celebrate";
import { NextFunction, Request, Response } from "express";
import { IDatabaseComposer } from "./composer.model";
import { IDatabaseSong } from "./song.model";

// interface crud padrão
export interface ICrud<C, D, U>{
  getAll(): Promise<D[]>,
  getById(id: number): Promise<D | undefined>,
  create(item: C): Promise<number>,
  update(item: U | D): Promise<void>,
  delete(id: number): Promise<void>
}


//interface de retorno do repository da relação
export type ComposerAndSongReturns = IDatabaseComposer & IDatabaseSong

//interface controller padrão 
export interface ICrudController {
  getAll(req: Request, res: Response, next: NextFunction): void,
  getById(req: Request, res: Response, next: NextFunction): void,
  create(req: Request, res: Response, next: NextFunction): void,
  update(req: Request, res: Response, next: NextFunction): void,
  delete(req: Request, res: Response, next: NextFunction): void
}

//validação para id vindo do cliente
export const idSchemaValidate = Joi.object().keys({
  id: Joi.number().min(1).required()
});