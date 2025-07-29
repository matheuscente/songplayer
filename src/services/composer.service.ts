import { NotFoundError } from "../errors/not-found.error";
import {
  IClientComposer,
  IDatabaseComposer,
  IComposerRepository,
  IComposerService,
  UpdateComposer,
  composerSchemaValidate,
  composerUpdateSchemaValidate,
} from "../models/composer.model";
import { idSchemaValidate } from "../models/global.model";
import DataValidator from "../utils/dataValidator.utils";
import { runInTransaction } from "../utils/runInTransaction.utils";

class ComposerService implements IComposerService {
  private readonly composerRepository: IComposerRepository;
  constructor(composerRepository: IComposerRepository) {
    this.composerRepository = composerRepository;
  }
  getAll(): IDatabaseComposer[] {
    return this.composerRepository.getAll();

  }
  getById(id: number): IDatabaseComposer | undefined {
    DataValidator.validator(idSchemaValidate, {id})
    const composer = this.composerRepository.getById(id);
    if (!composer) {
      return undefined;
    }
    return composer;
  }
  create(item: IClientComposer): number {
    DataValidator.validator(composerSchemaValidate, item)
    let composerId: number = 0
    runInTransaction(() => {
      composerId = this.composerRepository.create(item);
    });
    return composerId
  }

  update(item: UpdateComposer): void {
    DataValidator.validator(composerUpdateSchemaValidate, item)
    runInTransaction(() => {
      const composer = this.getById(item.composerId)
      if(!composer) throw new NotFoundError('compositor não encontrado')
      this.composerRepository.update(
    {
      composerId: composer.composerId,
      composerName: item.composerName
    }
  );
    });
  }
  delete(id: number): void {
    DataValidator.validator(idSchemaValidate,{id})
    runInTransaction(() => {
      const composer = this.getById(id)
      if(!composer) throw new NotFoundError('compositor não encontrado')
      this.composerRepository.delete(id);
    });
  }
}

export default ComposerService;
