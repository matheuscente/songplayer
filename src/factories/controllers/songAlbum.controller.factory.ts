import { ISongAlbumController } from "../../models/songAlbum.model";
import SongAlbumController from "../../controllers/songAlbum.controller";
import songAlbumService from "../services/songAlbum.service.factory";

const  songAlbumController: ISongAlbumController = new SongAlbumController(songAlbumService)

export default songAlbumController
