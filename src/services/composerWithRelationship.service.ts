import { IComposerService } from "../models/composer.model";
import { IComposerWithSongs, IGetComposerWithRelationshipService } from "../models/getComposersWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import { ISongComposer, ISongComposerService } from "../models/songComposer.model";
import DataValidator from "../utils/dataValidator.utils";


class ComposerWithRelationship implements IGetComposerWithRelationshipService {
    composerService!: IComposerService
    songComposerService!: ISongComposerService

    setDependencies(
        composerService: IComposerService,
        songComposerService: ISongComposerService,
    ): void {
        this.composerService = composerService,
        this.songComposerService = songComposerService
    }

    getAll(): IComposerWithSongs[] {

        const composers = this.composerService.getAll()

        if(composers.length === 0) return [] as IComposerWithSongs[]

        return composers.map((composer) => {
            return this.getById(composer.composerId)
        }).filter((composer) => composer !== undefined)
    }
    
    getById(composerId: number): IComposerWithSongs | undefined {
        DataValidator.validator(idSchemaValidate, {id: composerId})

        const composer = this.composerService.getById(composerId)

        if(!composer) return undefined

        const relations: ISongComposer[] = this.songComposerService.getByComposerId(composerId)

        if(relations.length === 0) return {...composer, songs: []}
        
        const songs: number[] = relations.map((item) => item.songId)

        return {...composer, songs}
    }

    
}

export default ComposerWithRelationship