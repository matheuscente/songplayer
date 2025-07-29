import { IGetAlbumWithRelationshipService } from "../../models/getAlbumsWithRelationship.model"
import AlbumWithRelationship from "../../services/albumWithRelationship.service"


const albumWithRelationshipService: IGetAlbumWithRelationshipService = new AlbumWithRelationship()

export default albumWithRelationshipService
