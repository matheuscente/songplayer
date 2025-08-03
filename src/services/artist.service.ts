import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { IAlbumService } from "../models/album.model";
import { idSchemaValidate, PrismaTransactionClient } from "../models/global.model";
import {
  IClientArtist,
  IDatabaseArtist,
  IArtistRepository,
  IArtistService,
  UpdateArtist,
  artistUpdateSchemaValidate,
  artistSchemaValidate,
} from "../models/artist.model";
import runInTransaction from "../utils/runInTransaction.utils";
import DataValidator from "../utils/dataValidator.utils";
import databaseErrorTranslator from "../utils/dataBaseErrorTransaltor";
import { InternalServerError } from "../errors/internal-server.error";

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository;
  private albumService!: IAlbumService;
  constructor(artistRepository: IArtistRepository) {
    this.artistRepository = artistRepository;
  }

  setDependencies(albumService: IAlbumService) {
    this.albumService = albumService;
  }
  async getAll(tx?: PrismaTransactionClient): Promise<IDatabaseArtist[]> {
    return this.artistRepository.getAll()
  }

  async getById(id: number, tx?: PrismaTransactionClient): Promise<IDatabaseArtist | undefined> {
    DataValidator.validator(idSchemaValidate, { id });
    return this.artistRepository.getById(id);
  }

  async create(item: IClientArtist): Promise<number> {
    let artistId: number = 0;
    DataValidator.validator(artistSchemaValidate, item);
    await runInTransaction(async  (tx) => {
      try {
        artistId = await this.artistRepository.create(item, tx);
      } catch (err) {
        const errorMsg = databaseErrorTranslator(err)
        console.log(errorMsg)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
          throw new ValidationError(errorMsg)
      }
    });

    return artistId;
  }

  async update(item: UpdateArtist): Promise<void> {
    DataValidator.validator(artistUpdateSchemaValidate, item);
    await runInTransaction(async (tx) => {
      try{
        const artist = await this.getById(item.id);
      if (!artist) throw new NotFoundError("artista não encontrado");
      await this.artistRepository.update({
        id: artist.id,
        name: item.name ?? artist.name,
        nationality: item.nationality ?? artist.nationality,
      }, tx);
      }  catch(err) {
        if(err instanceof NotFoundError) throw err
        const errorMsg = databaseErrorTranslator(err)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
        throw new ValidationError(errorMsg)
      }
    });
  }
  async delete(id: number): Promise<void> {
    DataValidator.validator(idSchemaValidate, { id });
    await runInTransaction(async  (tx) => {
      try{
        const artist = await this.getById(id, tx);
      if (!artist) throw new NotFoundError("artista não encontrado");
      const artistAlbum = await this.albumService.getByArtistId(id, tx);
      if (artistAlbum.length >= 1) {
        throw new ValidationError(
          `este artista tem os albums ${artistAlbum.map(album => album.id)}, exclua os albums ou mude de artista`
        );
      }
      await this.artistRepository.delete(id, tx);
      }catch(err){
        if(err instanceof ValidationError || err instanceof NotFoundError) throw err
        const errorMsg = databaseErrorTranslator(err)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
        throw new ValidationError(errorMsg)
      }
    });
  }
}

export default ArtistService;
