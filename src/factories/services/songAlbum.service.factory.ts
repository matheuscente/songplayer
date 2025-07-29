import { ISongAlbumService } from "../../models/songAlbum.model";
import SongAlbumService from "../../services/songAlbum.service";
import songAlbumRepository from "../repositories/songAlbum.repository.factory";

const songAlbumService: ISongAlbumService = new SongAlbumService(songAlbumRepository)

export default songAlbumService
