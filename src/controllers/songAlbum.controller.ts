import { Request, Response, NextFunction } from "express";
import { ISongAlbumController } from "../models/songAlbum.model";
import { ISongAlbumService } from "../models/songAlbum.model";

class SongAlbumController implements ISongAlbumController {

    private songAlbumService: ISongAlbumService

    constructor(songAlbumService: ISongAlbumService) {
        this.songAlbumService = songAlbumService
    }

    create(req: Request, res: Response, next: NextFunction): void {
        try{
            const {albumId, songId} = req.body
            this.songAlbumService.create({albumId: Number(albumId), songId: Number(songId)})
            res.status(204).json({message: "relação criada com sucesso"})
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }
    delete(req: Request, res: Response, next: NextFunction): void {
         try{
            const {albumId, songId} = req.body
            this.songAlbumService.delete(Number(songId), Number(albumId))
            res.status(204).send()
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }
    
}

export default SongAlbumController