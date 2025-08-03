import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { IClientComposer, IComposerController, IComposerService } from "../models/composer.model";
import trimString from "../utils/trimString.utils";
import { IGetComposerWithRelationshipService } from "../models/getComposersWithRelationship.model";

class ComposerController implements IComposerController {
  private composerService: IComposerService
  private composerWithRelationship: IGetComposerWithRelationshipService
  constructor(composerService: IComposerService, composerWithRelationship: IGetComposerWithRelationshipService) {
    this.composerService = composerService;
    this.composerWithRelationship = composerWithRelationship
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = await this.composerWithRelationship.getAll()
        if(data.length === 0) throw new NotFoundError('não existem compositores')
        res.status(200).json(data)
        return
      }
      const composers = await this.composerService.getAll();
      if (composers.length === 0) throw new NotFoundError("não existem compositores");
      res.status(200).json(composers);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const composerId: number = Number(req.params.id);
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = await this.composerWithRelationship.getById(composerId)
        if(!data) new NotFoundError('compositor não existente')
        res.status(200).json(data)
        return
      }
      const composer = await this.composerService.getById(composerId);

      if (!composer) {
        throw new NotFoundError("compositor não encontrado ");
      }
      res.status(200).json(composer);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const composer: IClientComposer = req.body;
      const trimmedComposer = trimString(composer)
      await this.composerService.create(trimmedComposer);
      res.status(201).json({ message: "compositor criado com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const composer = req.body;
      const trimmedComposer = trimString(composer)

      await this.composerService.update(trimmedComposer);

      res.status(200).json({ message: "compositor atualizada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const composerId: number = Number(req.params.id);
      await this.composerService.delete(composerId);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default ComposerController
