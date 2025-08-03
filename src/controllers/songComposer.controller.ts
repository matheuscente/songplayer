import { Request, Response, NextFunction } from "express";
import { ISongComposerController } from "../models/songComposer.model";
import { ISongComposerService } from "../models/songComposer.model";

class SongComposerController implements ISongComposerController {

    private songComposerService: ISongComposerService

    constructor(songComposerService: ISongComposerService) {
       this.songComposerService = songComposerService
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try{
            const {composer_id, song_id, composition} = req.body
           await this.songComposerService.create({composer_id: Number(composer_id), song_id: Number(song_id), composition})
            res.status(201).json({message: "relação criada com sucesso"})
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
         try{
            const {composerId, songId} = req.body
           await this.songComposerService.delete(Number(songId), Number(composerId))
            res.status(204).send()
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }
    
}

export default SongComposerController