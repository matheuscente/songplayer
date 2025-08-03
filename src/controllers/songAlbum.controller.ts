import { Request, Response, NextFunction } from "express";
import { ISongAlbumController } from "../models/songAlbum.model";
import { ISongAlbumService } from "../models/songAlbum.model";

class SongAlbumController implements ISongAlbumController {

    private songAlbumService: ISongAlbumService

    constructor(songAlbumService: ISongAlbumService) {
        this.songAlbumService = songAlbumService
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try{
            const {album_id, song_id} = req.body
            await this.songAlbumService.create({album_id: Number(album_id), song_id: Number(song_id)})
            res.status(201).json({message: "relação criada com sucesso"})
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
         try{
            const {album_id, song_id} = req.body
            await this.songAlbumService.delete(Number(song_id), Number(album_id))
            res.status(204).send()
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }
    
}

export default SongAlbumController