import ComposerRepository from "../../repositories/composer.repository";
import database from "../../database";

const composerRepository: ComposerRepository = new ComposerRepository(database)

export default composerRepository