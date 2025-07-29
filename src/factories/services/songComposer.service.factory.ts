import { ISongComposerService } from "../../models/songComposer.model";
import SongComposerService from "../../services/songComposer.service";
import songComposerRepository from "../repositories/songComposer.repository.factory";

const songComposerService: ISongComposerService = new SongComposerService(songComposerRepository)

export default songComposerService
