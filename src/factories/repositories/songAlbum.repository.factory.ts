import SongAlbumRepository from "../../repositories/songAlbum.repository";
import database from "../../prismaUtils/client";


const songAlbumRepository: SongAlbumRepository = new SongAlbumRepository(database)

export default songAlbumRepository