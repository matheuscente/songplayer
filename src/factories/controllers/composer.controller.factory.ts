import { IComposerController } from "../../models/composer.model";
import ComposerController from "../../controllers/composer.controller";
import composerService from "../services/composer.service.factory";
import composerWithRelationshipService from "../services/composerWithRelationship.factory"

const composerController: IComposerController = new ComposerController(composerService, composerWithRelationshipService)

export default composerController
