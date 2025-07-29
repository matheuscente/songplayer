import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import {
  IClientSong,
  ISongController,
  ISongService,
} from "../models/song.model";
import trimString from "../utils/trimString.utils";
import { IGetSongWithRelationshipService } from "../models/getSongsWithRelationship.model";

class SongController implements ISongController {
  private songService: ISongService;
  private songWithRelationship: IGetSongWithRelationshipService
  constructor(songService: ISongService, songWithRelationship: IGetSongWithRelationshipService) {
    this.songService = songService;
    this.songWithRelationship = songWithRelationship
  }
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = this.songWithRelationship.getAll()
        if(data.length === 0) throw new NotFoundError('não existem músicas')
        res.status(200).json(data)
        return
      }
      const songs = this.songService.getAll();
      if (songs.length === 0) throw new NotFoundError("não existem músicas");
      res.status(200).json(songs);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const songId: number = Number(req.params.id);

      const {relations} = req.query
      if(relations) {
        if(relations !== "true") throw new NotFoundError('parametro query inválido')
         const data = this.songWithRelationship.getById(songId)
        if(!data) new NotFoundError('música não existente')

        res.status(200).json(data)
        return
      }
      const song = this.songService.getById(songId);

      if (!song) {
        throw new NotFoundError("música não encontrada ");
      }
      res.status(200).json(song);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const song: IClientSong = req.body;
      const trimmedSong: IClientSong = trimString(song)
      this.songService.create(trimmedSong);
      res.status(201).json({ message: "música criada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    try{
      const song = req.body;
      const trimmedSong = trimString(song)

      this.songService.update(trimmedSong);

      res.status(200).json({ message: "música atualizada com sucesso" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const songId: number = Number(req.params.id);
      this.songService.delete(songId);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default SongController;
