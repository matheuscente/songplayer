import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { IAlbumService } from "../models/album.model";
import { idSchemaValidate } from "../models/global.model";
import { ISongService } from "../models/song.model";
import {
  ISongAlbum,
  ISongAlbumRepository,
  ISongAlbumService,
  songAlbumSchemaValidate,
} from "../models/songAlbum.model";
import DataValidator from "../utils/dataValidator.utils";
import { runInTransaction } from "../utils/runInTransaction.utils";

class SongAlbumService implements ISongAlbumService {

  private readonly songAlbumRepository: ISongAlbumRepository;
  private songService!: ISongService
  private albumService!: IAlbumService

  constructor(songAlbumRepository: ISongAlbumRepository) {
    this.songAlbumRepository = songAlbumRepository;
  }

  setDependencies(songService: ISongService, albumService: IAlbumService): void {
    this.songService = songService
    this.albumService = albumService
  }

  getById(songId: number, albumId: number): ISongAlbum | undefined {
    DataValidator.validator(songAlbumSchemaValidate, {songId, albumId})
    const data = this.songAlbumRepository.getById(songId, albumId);
    if (!data) return undefined;
    return data;
  }

  create(songAlbum: ISongAlbum): void {
    runInTransaction(() => {

      const hasSong = this.songService.getById(songAlbum.songId)
      const hasAlbum = this.albumService.getById(songAlbum.albumId)
      
      if(!hasSong) throw new NotFoundError("música não existente")
      else if(!hasAlbum) throw new NotFoundError("album não existente")

      const hasData = this.getById(songAlbum.songId, songAlbum.albumId)
      if(hasData) throw new ValidationError("relação já existente")
      this.songAlbumRepository.create(songAlbum);
    });
    
  }

  delete(songId: number, albumId: number): void {
    runInTransaction(() => {
      const hasData = this.getById(songId, albumId)
      if(!hasData) throw new NotFoundError("relação não existente")
      this.songAlbumRepository.delete(songId, albumId);
    });
  }

  getByAlbumId(albumId: number): ISongAlbum[]{
    DataValidator.validator(idSchemaValidate, {id: albumId})
    return this.songAlbumRepository.getByAlbumId(albumId);

  }
  getBySongId(songId: number):  ISongAlbum[] {
    DataValidator.validator(idSchemaValidate, {id: songId})
    return this.songAlbumRepository.getBySongId(songId);
    
  }
}

export default SongAlbumService;
