import { ISongController } from "../../models/song.model";
import SongController from "../../controllers/song.controller";
import songService from "../services/song.service.factory";
import songWithRelationshipService from "../services/songWithRelationship.factory"


const songController: ISongController = new SongController(songService, songWithRelationshipService)

export default songController
