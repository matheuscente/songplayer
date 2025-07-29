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
  
  getById(songId: number, composerId: number): ISongComposer | undefined {
    DataValidator.validator(songComposerGetByIdSchemaValidate, {songId, composerId})
    const data = this.songComposerRepository.getById(songId, composerId);
    if (!data) return undefined;
    return data;
  }

  create(songComposer: ISongComposer): void {
    DataValidator.validator(songComposerSchemaValidate, songComposer)
    runInTransaction(() => {

      const hasSong = this.songService.getById(songComposer.songId)
      const hasComposer = this.composerService.getById(songComposer.composerId)

      if(!hasSong) throw new NotFoundError("música não existente")
      else if(!hasComposer) throw new NotFoundError("compositor não existente")

      if(!songComposer.composition) throw new NotFoundError('informe a composição')

      const hasData = this.getById(songComposer.songId, songComposer.composerId)

      if(hasData) throw new ValidationError("relação já existente")
        
      this.songComposerRepository.create(songComposer);
    });
  }

  delete(songId: number, composerId: number): void {
    runInTransaction(() => {
      const relationship = this.getById(songId, composerId)
      if(!relationship) throw new NotFoundError('relação não existente')
      this.songComposerRepository.delete(songId, composerId);
    });
  }

  getByComposerId(composerId: number): ISongComposer[] {
    DataValidator.validator(idSchemaValidate, {id: composerId})
    const data = this.songComposerRepository.getByComposerId(composerId);
    return data
  }

  getBySongId(songId: number): ISongComposer[] {
    DataValidator.validator(idSchemaValidate, {id: songId})
    const data = this.songComposerRepository.getBySongId(songId);
    return data
  }
}

export default SongComposerService;
