import { IGetComposerWithRelationshipService } from "../../models/getComposersWithRelationship.model"
import ComposerWithRelationship from "../../services/composerWithRelationship.service"

const composerWithRelationshipService: IGetComposerWithRelationshipService = new ComposerWithRelationship()

export default composerWithRelationshipService
