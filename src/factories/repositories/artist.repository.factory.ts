import ArtistRepository from "../../repositories/artist.repository";
import database from "../../prismaUtils/client";


const artistRepository: ArtistRepository = new ArtistRepository(database)

export default artistRepository