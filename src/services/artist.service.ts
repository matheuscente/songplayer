import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { IAlbumService } from "../models/album.model";
import { idSchemaValidate } from "../models/global.model";
import {
  IClientArtist,
  IDatabaseArtist,
  IArtistRepository,
  IArtistService,
  UpdateArtist,
  artistUpdateSchemaValidate,
  artistSchemaValidate,
} from "../models/artist.model";
import { runInTransaction } from "../utils/runInTransaction.utils";
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
  getAll(): IDatabaseArtist[] {
    return this.artistRepository.getAll() as IDatabaseArtist[];
  }

  getById(id: number): IDatabaseArtist | undefined {
    DataValidator.validator(idSchemaValidate, { id });

    const artist = this.artistRepository.getById(id);
    if (!artist) {
      return undefined;
    }
    return artist as IDatabaseArtist;
  }

  create(item: IClientArtist): number {
    let artistId: number = 0;
    DataValidator.validator(artistSchemaValidate, item);
    runInTransaction(() => {
      try {
        artistId = this.artistRepository.create(item);
      } catch (err) {
        const errorMsg = databaseErrorTranslator(err as Error)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
          throw new ValidationError(errorMsg)
      }
    });

    return artistId;
  }

  update(item: UpdateArtist): void {
    DataValidator.validator(artistUpdateSchemaValidate, item);
    runInTransaction(() => {
      try{
        const artist = this.getById(item.artistId);
      if (!artist) throw new NotFoundError("artista não encontrado");
      this.artistRepository.update({
        artistId: artist.artistId,
        artistName: item.artistName ?? artist.artistName,
        artistNationality: item.artistNationality ?? artist.artistNationality,
      });
      }  catch(err) {
        if(err instanceof NotFoundError) throw err
        const errorMsg = databaseErrorTranslator(err as Error)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
        throw new ValidationError(errorMsg)
      }
    });
  }
  delete(id: number): void {
    DataValidator.validator(idSchemaValidate, { id });
    runInTransaction(() => {
      try{
        const artist = this.getById(id);
      if (!artist) throw new NotFoundError("artista não encontrado");
      const artistAlbum = this.albumService.getByArtistId(id);
      if (artistAlbum.length >= 1) {
        throw new ValidationError(
          `este artista tem os albums ${artistAlbum.map(album => album.albumId)}, exclua os albums ou mude de artista`
        );
      }
      this.artistRepository.delete(id);
      }catch(err){
        if(err instanceof ValidationError || err instanceof NotFoundError) throw err
        const errorMsg = databaseErrorTranslator(err as Error)
        if(!errorMsg) throw new InternalServerError('Ocorreu um erro interno')
        throw new ValidationError(errorMsg)
      }
    });
  }
}

export default ArtistService;
