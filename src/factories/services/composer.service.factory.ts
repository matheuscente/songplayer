import { IComposerService } from "../../models/composer.model";
import ComposerService from "../../services/composer.service";
import composerRepository from "../repositories/composer.repository.factory";

const composerService: IComposerService = new ComposerService(composerRepository)

export default composerService
