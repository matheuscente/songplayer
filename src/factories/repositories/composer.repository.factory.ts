import ComposerRepository from "../../repositories/composer.repository";
import database from "../../prismaUtils/client";


const composerRepository: ComposerRepository = new ComposerRepository(database)

export default composerRepository