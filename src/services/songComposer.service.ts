import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { IComposerService } from "../models/composer.model";
import { idSchemaValidate } from "../models/global.model";
import { ISongService } from "../models/song.model";

import {

  ISongComposer,
  ISongComposerRepository,
  ISongComposerService,
  songComposerGetByIdSchemaValidate,
  songComposerSchemaValidate,
} from "../models/songComposer.model";
import DataValidator from "../utils/dataValidator.utils";
import { runInTransaction } from "../utils/runInTransaction.utils";

class SongComposerService implements ISongComposerService {
  private readonly songComposerRepository: ISongComposerRepository;
  private songService!: ISongService
  private composerService!: IComposerService

  constructor(songComposerRepository: ISongComposerRepository) {
    this.songComposerRepository = songComposerRepository;
  }

  setDependencies(songService: ISongService, composerService: IComposerService): void {
    this.songService = songService
    this.composerService = composerService
  }
  
  async getById(songId: number, composerId: number): Promise<ISongComposer | undefined> {
    DataValidator.validator(songComposerGetByIdSchemaValidate, {song_id: songId, composer_id: composerId})
    return this.songComposerRepository.getById(songId, composerId);

  }

  async create(songComposer: ISongComposer): Promise<void> {
    DataValidator.validator(songComposerSchemaValidate, songComposer)
    await runInTransaction(async  () => {

      const hasSong = await this.songService.getById(songComposer.song_id)
      const hasComposer = await this.composerService.getById(songComposer.composer_id)

      if(!hasSong) throw new NotFoundError("música não existente")
      else if(!hasComposer) throw new NotFoundError("compositor não existente")

      if(!songComposer.composition) throw new NotFoundError('informe a composição')

      const hasData = await this.getById(songComposer.song_id, songComposer.composer_id)

      if(hasData) throw new ValidationError("relação já existente")
        
      await this.songComposerRepository.create(songComposer);
    });
  }

  async delete(songId: number, composerId: number): Promise<void> {
    await runInTransaction(async  () => {
      const relationship = await this.getById(songId, composerId)
      if(!relationship) throw new NotFoundError('relação não existente')
      await this.songComposerRepository.delete(songId, composerId);
    });
  }

  async getByComposerId(composerId: number): Promise<ISongComposer[]> {
    DataValidator.validator(idSchemaValidate, {id: composerId})
    return this.songComposerRepository.getByComposerId(composerId);
  }

  async getBySongId(songId: number): Promise<ISongComposer[]> {
    DataValidator.validator(idSchemaValidate, {id: songId})
    return this.songComposerRepository.getBySongId(songId)
  }
}

export default SongComposerService;
