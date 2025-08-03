import albumRepository from "../repositories/album.repository.factory";
import AlbumService from "../../services/album.service";
import database from "../../prismaUtils/client"

const albumService = new AlbumService(albumRepository, database);

export default albumService;
