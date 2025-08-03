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
import { idSchemaValidate, PrismaTransactionClient } from "../models/global.model";
import DataValidator from "../utils/dataValidator.utils";
import runInTransaction from "../utils/runInTransaction.utils";

class ComposerService implements IComposerService {
  private readonly composerRepository: IComposerRepository;
  constructor(composerRepository: IComposerRepository) {
    this.composerRepository = composerRepository;
  }
  async getAll(tx?: PrismaTransactionClient): Promise<IDatabaseComposer[]> {
    return this.composerRepository.getAll();

  }
  async getById(id: number, tx?: PrismaTransactionClient): Promise<IDatabaseComposer | undefined> {
    DataValidator.validator(idSchemaValidate, {id})
    return this.composerRepository.getById(id);
  }
  async create(item: IClientComposer): Promise<number> {
    DataValidator.validator(composerSchemaValidate, item)
    let composerId: number = 0
    await runInTransaction(async  (tx) => {
      composerId = await this.composerRepository.create(item, tx);
    });
    return composerId
  }

  async update(item: UpdateComposer): Promise<void> {
    DataValidator.validator(composerUpdateSchemaValidate, item)
    await runInTransaction(async  (tx) => {
      const composer = await this.getById(item.id, tx)
      if(!composer) throw new NotFoundError('compositor não encontrado')
      await this.composerRepository.update(
    {
      id: composer.id,
      name: item.name
    }, tx
  );
    });
  }
  async delete(id: number): Promise<void> {
    DataValidator.validator(idSchemaValidate,{id})
    await runInTransaction(async  (tx) => {
      const composer = await this.getById(id, tx)
      if(!composer) throw new NotFoundError('compositor não encontrado')
      await this.composerRepository.delete(id, tx);
    });
  }
}

export default ComposerService;
