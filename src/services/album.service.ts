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
  getByArtistId(artistId: number): IDatabaseAlbum[] {
    DataValidator.validator(idSchemaValidate, {id: artistId})
    return this.albumRepository.getByArtistId(artistId) as IDatabaseAlbum[];
  }
  getAll(): IDatabaseAlbum[] {
    return this.albumRepository.getAll();
  }
  getById(id: number): IDatabaseAlbum | undefined {
    DataValidator.validator(idSchemaValidate, {id})
    const album = this.albumRepository.getById(id);
    if (!album) return undefined;
    return album as IDatabaseAlbum;
  }

  create(item: IClientAlbum): number {
    DataValidator.validator(albumSchemaValidate, item)

    let albumId: number = 0;
    try {
      runInTransaction(() => {
      const artist = this.artistService.getById(item.artistId);
      if (!artist) throw new NotFoundError("artista não encontrado");

      albumId = this.albumRepository.create(item);

    });
    }  catch (err) {

        if(err instanceof NotFoundError) throw err
        const errorMsg = databaseErrorTranslator(err as Error)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
          throw new ValidationError(errorMsg)
      }
    
    return albumId;
  }

  update(item: UpdateAlbum): void {
    DataValidator.validator(albumUpdateSchemaValidate, item)
    runInTransaction(() => {
      const album = this.getById(item.albumId);
      if (album) {
        if (item.artistId) {
          const hasArtist = this.artistService.getById(item.artistId);
          if (!hasArtist) throw new NotFoundError("artista não encontrado");
        }

        const updateAlbum: IDatabaseAlbum = {
          albumId: item.albumId,
          albumTitle: item.albumTitle ?? album.albumTitle,
          albumYear: item.albumYear ?? album.albumYear,
          artistId: item.artistId ?? album.artistId,
        };
        this.albumRepository.update(updateAlbum);
      } else {
        throw new NotFoundError("album não encontrado");
      }
    });
  }
  delete(id : number): void {
    DataValidator.validator(idSchemaValidate, {id})
    runInTransaction(() => {
      const album = this.getById(id);
      if (!album) throw new NotFoundError("album não encontrado");
      this.albumRepository.delete(id);
    });
  }
}

export default AlbumService;
