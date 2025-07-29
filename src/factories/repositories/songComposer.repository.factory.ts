import SongComposerRepository from "../../repositories/songComposer.repository";
import database from "../../database";

const songComposerRepository: SongComposerRepository = new SongComposerRepository(database)

export default songComposerRepository