import { Request, Response, NextFunction } from "express";
import { ISongComposerController } from "../models/songComposer.model";
import { ISongComposerService } from "../models/songComposer.model";

class SongComposerController implements ISongComposerController {

    private songComposerService: ISongComposerService

    constructor(songComposerService: ISongComposerService) {
        this.songComposerService = songComposerService
    }

    create(req: Request, res: Response, next: NextFunction): void {
        try{
            const {composerId, songId, composition} = req.body
            this.songComposerService.create({composerId: Number(composerId), songId: Number(songId), composition})
            res.status(201).json({message: "relação criada com sucesso"})
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }
    delete(req: Request, res: Response, next: NextFunction): void {
         try{
            const {composerId, songId} = req.body
            this.songComposerService.delete(Number(songId), Number(composerId))
            res.status(204).send()
        } catch(err) {
            console.log(err);
            next(err); 
        }
    }
    
}

export default SongComposerController