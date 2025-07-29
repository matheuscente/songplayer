import SongAlbumRepository from "../../repositories/songAlbum.repository";
import database from "../../database";

const songAlbumRepository: SongAlbumRepository = new SongAlbumRepository(database)

export default songAlbumRepository