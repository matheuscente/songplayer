import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { IClientArtist, IArtistController, IArtistService } from "../models/artist.model";
import trimString from "../utils/trimString.utils";
import { IGetArtistWithRelationshipService } from "../models/getArtistsWithRelationship.model";

class ArtistController implements IArtistController {
  private artistService: IArtistService
  private artistWithRelationship: IGetArtistWithRelationshipService
  constructor(artistService: IArtistService, artistWithRelationship: IGetArtistWithRelationshipService) {
    this.artistService = artistService;
    this.artistWithRelationship = artistWithRelationship
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = await this.artistWithRelationship.getAll()
        if(data.length === 0) throw new NotFoundError('não existem artistas')
        res.status(200).json(data)
        return
      }
      const artists = await this.artistService.getAll();
      if (artists.length === 0) throw new NotFoundError("não existem artistas");
      res.status(200).json(artists);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const artistId: number = Number(req.params.id);
       const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = await this.artistWithRelationship.getById(artistId)
        if(!data) new NotFoundError('artista não existente')
        res.status(200).json(data)
        return
      }
      const artist = await this.artistService.getById(artistId);

      if (!artist) {
        throw new NotFoundError("artista não encontrado ");
      }
      res.status(200).json(artist);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const artist: IClientArtist = req.body;
      const trimmedArtist = trimString(artist)
      await this.artistService.create(trimmedArtist);
      res.status(201).json({ message: "artista criado com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const artist = req.body;
      const trimmedArtist = trimString(artist)

      await this.artistService.update(trimmedArtist);

      res.status(200).json({ message: "artista atualizada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const artistId: number = Number(req.params.id);
      await this.artistService.delete(artistId);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default ArtistController
