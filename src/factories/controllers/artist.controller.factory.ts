import { IArtistController } from "../../models/artist.model";
import ArtistController from "../../controllers/artist.controller";
import artistService from "../services/artist.service.factory";
import artistWithRelationshipService from "../services/artistWithRelationship.factory";


const artistController: IArtistController = new ArtistController(artistService, artistWithRelationshipService)

export default artistController
