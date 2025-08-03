import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { IClientAlbum, IAlbumController, IAlbumService, UpdateAlbum } from "../models/album.model";
import trimString from "../utils/trimString.utils";
import { IGetAlbumWithRelationshipService } from "../models/getAlbumsWithRelationship.model";

class AlbumController implements IAlbumController {
  private albumService: IAlbumService
  private albumWithRelationship: IGetAlbumWithRelationshipService
  constructor(albumService: IAlbumService, albumWithRelationship: IGetAlbumWithRelationshipService) {
    this.albumService = albumService;
    this.albumWithRelationship = albumWithRelationship
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = await this.albumWithRelationship.getAll()
        if(data.length === 0) throw new NotFoundError('não existem albuns')
        res.status(200).json(data)
        return
      }
      const albums = await this.albumService.getAll();
      if (albums.length === 0) throw new NotFoundError("não existem albuns");
      res.status(200).json(albums);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const albumId: number = Number(req.params.id);
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
        const data = await this.albumWithRelationship.getById(Number(albumId))
        if(!data) new NotFoundError('album não encontrado')
        res.status(200).json(data)
        return
      }
      const album = await this.albumService.getById(albumId);

      if (!album) {
        throw new NotFoundError("album não encontrado");
      }
      res.status(200).json(album);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const album: IClientAlbum = req.body;
      const trimmedAlbum = trimString(album)
      await this.albumService.create(trimmedAlbum);
      res.status(201).json({ message: "album criado com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const album: UpdateAlbum = req.body;
      const trimmedAlbum = trimString(album)

      await this.albumService.update(trimmedAlbum);

      res.status(200).json({ message: "album atualizada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const albumId: number = Number(req.params.id);
      await this.albumService.delete(albumId);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default AlbumController
