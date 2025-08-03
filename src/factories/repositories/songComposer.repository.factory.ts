import SongComposerRepository from "../../repositories/songComposer.repository";
import database from "../../prismaUtils/client";


const songComposerRepository: SongComposerRepository = new SongComposerRepository(database)

export default songComposerRepository