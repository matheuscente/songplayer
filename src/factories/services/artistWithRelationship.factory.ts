import { IGetArtistWithRelationshipService } from "../../models/getArtistsWithRelationship.model"
import ArtistWithRelationship from "../../services/artistWithRelationship.service"


const artistWithRelationshipService: IGetArtistWithRelationshipService = new ArtistWithRelationship()

export default artistWithRelationshipService
