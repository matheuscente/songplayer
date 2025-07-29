import ArtistRepository from "../../repositories/artist.repository";
import database from "../../database";

const artistRepository: ArtistRepository = new ArtistRepository(database)

export default artistRepository