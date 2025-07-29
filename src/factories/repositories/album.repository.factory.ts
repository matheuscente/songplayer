import AlbumRepository from "../../repositories/album.repository";
import database from "../../database";

const albumRepository: AlbumRepository = new AlbumRepository(database)

export default albumRepository