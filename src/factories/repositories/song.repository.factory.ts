import SongRepository from "../../repositories/song.repository";
import database from "../../prismaUtils/client";

import { ISongRepository } from "../../models/song.model";

const songRepository: ISongRepository = new SongRepository(database)

export default songRepository