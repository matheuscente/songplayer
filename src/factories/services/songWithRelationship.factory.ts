import { IGetSongWithRelationshipService } from "../../models/getSongsWithRelationship.model"
import SongWithRelationship from "../../services/songWithRelationship.service"



const songWithRelationshipService: IGetSongWithRelationshipService = new SongWithRelationship()

export default songWithRelationshipService
