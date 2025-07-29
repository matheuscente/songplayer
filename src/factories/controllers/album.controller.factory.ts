import { IAlbumController } from "../../models/album.model";
import AlbumController from "../../controllers/album.controller";
import albumService from "../services/album.service.factory";
import albumWithRelationshipService from "../services/albumWithRelationship.factory";

const albumController: IAlbumController = new AlbumController(albumService, albumWithRelationshipService)

export default albumController
