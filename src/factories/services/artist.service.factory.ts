import { IArtistService } from "../../models/artist.model";
import ArtistService from "../../services/artist.service";
import ArtistRepository from "../repositories/artist.repository.factory";

const artistService: IArtistService = new ArtistService(ArtistRepository)

export default artistService
