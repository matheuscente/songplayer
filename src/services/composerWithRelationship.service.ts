import { IComposerService } from "../models/composer.model";
import { IComposerWithSongs, IGetComposerWithRelationshipService } from "../models/getComposersWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import { ISongComposer, ISongComposerService } from "../models/songComposer.model";
import DataValidator from "../utils/dataValidator.utils";


class ComposerWithRelationship implements IGetComposerWithRelationshipService {
    private composerService!: IComposerService
    private songComposerService!: ISongComposerService

    setDependencies(
        composerService: IComposerService,
        songComposerService: ISongComposerService,
    ): void {
        this.composerService = composerService,
        this.songComposerService = songComposerService
    }

    async getAll(): Promise<IComposerWithSongs[]> {

        const composers = await this.composerService.getAll()

        if(composers.length === 0) return []

        const returnComposers = await Promise.all(
             composers.map((composer) => this.getById(composer.id))
        )

        return returnComposers.filter((item): item is IComposerWithSongs => item !== undefined)
    }
    
    async getById(composerId: number): Promise<IComposerWithSongs | undefined> {
        DataValidator.validator(idSchemaValidate, {id: composerId})

        const composer = await this.composerService.getById(composerId)

        if(!composer) return undefined

        const relations: ISongComposer[] = await this.songComposerService.getByComposerId(composerId)

        if(relations.length === 0) return {...composer, songs: []}
        
        const songs = relations.map((item) => ({song: item.song_id, composition: item.composition}))

        return {...composer, songs}
    }

    
}

export default ComposerWithRelationship