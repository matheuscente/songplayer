import { ISongService } from "../../models/song.model";
import SongService from "../../services/song.service";
import songRepository from "../repositories/song.repository.factory";

const songService: ISongService = new SongService(songRepository)

export default songService
