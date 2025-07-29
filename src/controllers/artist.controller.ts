import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { IClientArtist, IDatabaseArtist, IArtistController, IArtistService } from "../models/artist.model";
import trimString from "../utils/trimString.utils";
import { IGetArtistWithRelationshipService } from "../models/getArtistsWithRelationship.model";

class ArtistController implements IArtistController {
  private artistService: IArtistService
  private artistWithRelationship: IGetArtistWithRelationshipService
  constructor(artistService: IArtistService, artistWithRelationship: IGetArtistWithRelationshipService) {
    this.artistService = artistService;
    this.artistWithRelationship = artistWithRelationship
  }
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = this.artistWithRelationship.getAll()
        if(data.length === 0) throw new NotFoundError('não existem artistas')
        res.status(200).json({data})
        return
      }
      const artists = this.artistService.getAll();
      if (artists.length === 0) throw new NotFoundError("não existem artistas");
      res.status(200).json(artists);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const artistId: number = Number(req.params.id);
       const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = this.artistWithRelationship.getById(artistId)
        if(!data) new NotFoundError('artista não existente')
        res.status(200).json({data})
        return
      }
      const artist = this.artistService.getById(artistId);

      if (!artist) {
        throw new NotFoundError("artista não encontrado ");
      }
      res.status(200).json(artist);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const artist: IClientArtist = req.body;
      const trimmedArtist = trimString(artist)
      this.artistService.create(trimmedArtist);
      res.status(201).json({ message: "artista criado com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const artistId: number = Number(req.params.id);
      const artist = req.body;
      const trimmedArtist = trimString(artist)
      const artistToUpdate: IDatabaseArtist = {
        artistId,
        ...trimmedArtist
      }
      this.artistService.update(artistToUpdate);

      res.status(200).json({ message: "artista atualizada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const artistId: number = Number(req.params.id);
      this.artistService.delete(artistId);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default ArtistController
