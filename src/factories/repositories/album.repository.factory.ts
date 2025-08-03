import AlbumRepository from "../../repositories/album.repository";
import database from "../../prismaUtils/client";

const albumRepository: AlbumRepository = new AlbumRepository(database)

export default albumRepository