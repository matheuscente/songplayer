import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { IClientComposer, IDatabaseComposer, IComposerController, IComposerService } from "../models/composer.model";
import trimString from "../utils/trimString.utils";
import { IGetComposerWithRelationshipService } from "../models/getComposersWithRelationship.model";

class ComposerController implements IComposerController {
  private composerService: IComposerService
  private composerWithRelationship: IGetComposerWithRelationshipService
  constructor(composerService: IComposerService, composerWithRelationship: IGetComposerWithRelationshipService) {
    this.composerService = composerService;
    this.composerWithRelationship = composerWithRelationship
  }
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = this.composerWithRelationship.getAll()
        if(data.length === 0) throw new NotFoundError('não existem compositores')
        res.status(200).json({data})
        return
      }
      const composers = this.composerService.getAll();
      if (composers.length === 0) throw new NotFoundError("não existem compositores");
      res.status(200).json(composers);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const composerId: number = Number(req.params.id);
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = this.composerWithRelationship.getById(composerId)
        if(!data) new NotFoundError('compositor não existente')
        res.status(200).json({data})
        return
      }
      const composer = this.composerService.getById(composerId);

      if (!composer) {
        throw new NotFoundError("compositor não encontrado ");
      }
      res.status(200).json(composer);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const composer: IClientComposer = req.body;
      const trimmedComposer = trimString(composer)
      this.composerService.create(trimmedComposer);
      res.status(201).json({ message: "compositor criado com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const composerId: number = Number(req.params.id);
      const composer = req.body;
      const trimmedComposer = trimString(composer)
      const composerToUpdate: IDatabaseComposer = {
        composerId,
        ...trimmedComposer
      }
      this.composerService.update(composerToUpdate);

      res.status(200).json({ message: "compositor atualizada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const composerId: number = Number(req.params.id);
      this.composerService.delete(composerId);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default ComposerController
