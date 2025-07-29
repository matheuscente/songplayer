import SongRepository from "../../repositories/song.repository";
import database from "../../database";
import { ISongRepository } from "../../models/song.model";

const songRepository: ISongRepository = new SongRepository(database)

export default songRepository