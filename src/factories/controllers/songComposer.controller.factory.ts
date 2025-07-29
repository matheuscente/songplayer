import { ISongComposerController } from "../../models/songComposer.model";
import SongComposerController from "../../controllers/songComposer.controller";
import songComposerService from "../services/songComposer.service.factory";

const  songComposerController: ISongComposerController = new SongComposerController(songComposerService)

export default songComposerController
