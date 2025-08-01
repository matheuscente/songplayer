import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import {
  IClientAlbum,
  IDatabaseAlbum,
  IAlbumRepository,
  IAlbumService,
  UpdateAlbum,
  albumSchemaValidate,
  albumUpdateSchemaValidate,
} from "../models/album.model";
import { IArtistService } from "../models/artist.model";
import { idSchemaValidate } from "../models/global.model";
import databaseErrorTranslator from "../utils/dataBaseErrorTransaltor";
import DataValidator from "../utils/dataValidator.utils";
import { runInTransaction } from "../utils/runInTransaction.utils";

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository;
  private artistService!: IArtistService;
  constructor(albumRepository: IAlbumRepository) {
    this.albumRepository = albumRepository;
  }

  setDependencies(
    artistService: IArtistService
  ) {
    this.artistService = artistService;
  }
  async getByArtistId(artistId: number): Promise<IDatabaseAlbum[]> {
    DataValidator.validator(idSchemaValidate, {id: artistId})
    return this.albumRepository.getByArtistId(artistId)
  }
  async getAll(): Promise<IDatabaseAlbum[]> {
    return this.albumRepository.getAll();
  }
  async getById(id: number): Promise<IDatabaseAlbum | undefined> {
    DataValidator.validator(idSchemaValidate, {id})
    const album = this.albumRepository.getById(id);
    if (!album) return undefined;
    return album
  }

  async create(item: IClientAlbum): Promise<number> {
    DataValidator.validator(albumSchemaValidate, item)

    let albumId: number = 0;
    try {
      runInTransaction(async () => {
      const artist = await this.artistService.getById(item.artist_id);
      if (!artist) throw new NotFoundError("artista não encontrado");

      albumId = await this.albumRepository.create(item);

    });
    }  catch (err) {

        if(err instanceof NotFoundError) throw err
        const errorMsg = databaseErrorTranslator(err as Error)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
          throw new ValidationError(errorMsg)
      }
    
    return albumId;
  }

  async update(item: UpdateAlbum): Promise<void> {
    DataValidator.validator(albumUpdateSchemaValidate, item)
    runInTransaction(async () => {
      const album = await this.getById(item.id);
      if (album) {
        if (item.artist_id) {
          const hasArtist = await this.artistService.getById(item.artist_id);
          if (!hasArtist) throw new NotFoundError("artista não encontrado");
        }

        const updateAlbum: IDatabaseAlbum = {
          id: item.id,
          title: item.title ?? album.title,
          year: item.year ?? album.year,
          artist_id: item.artist_id ?? album.artist_id,
        };
        await this.albumRepository.update(updateAlbum);
      } else {
        throw new NotFoundError("album não encontrado");
      }
    });
  }
  async delete(id : number): Promise<void> {
    DataValidator.validator(idSchemaValidate, {id})
    runInTransaction(async () => {
      const album = await this.getById(id);
      if (!album) throw new NotFoundError("album não encontrado");
      await this.albumRepository.delete(id);
    });
  }
}

export default AlbumService;
