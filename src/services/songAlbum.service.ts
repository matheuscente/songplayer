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

  async getById(songId: number, albumId: number): Promise<ISongAlbum | undefined> {
    DataValidator.validator(songAlbumSchemaValidate, {song_id: songId, album_id: albumId})
    return this.songAlbumRepository.getById(songId, albumId);

  }

  async create(songAlbum: ISongAlbum): Promise<void> {
    await runInTransaction(async  () => {

      const hasSong = await this.songService.getById(songAlbum.song_id)
      const hasAlbum = await this.albumService.getById(songAlbum.album_id)
      
      if(!hasSong) throw new NotFoundError("música não existente")
      else if(!hasAlbum) throw new NotFoundError("album não existente")

      const hasData = await this.getById(songAlbum.song_id, songAlbum.album_id)
      if(hasData) throw new ValidationError("relação já existente")
      await this.songAlbumRepository.create(songAlbum);
    });
    
  }

  async delete(songId: number, albumId: number): Promise<void> {
    await runInTransaction(async  () => {
      const hasData = await this.getById(songId, albumId)
      if(!hasData) throw new NotFoundError("relação não existente")
      await this.songAlbumRepository.delete(songId, albumId);
    });
  }

  async getByAlbumId(albumId: number): Promise<ISongAlbum[]>{
    DataValidator.validator(idSchemaValidate, {id: albumId})
    return this.songAlbumRepository.getByAlbumId(albumId);

  }
  async getBySongId(songId: number):  Promise<ISongAlbum[]> {
    DataValidator.validator(idSchemaValidate, {id: songId})
    return this.songAlbumRepository.getBySongId(songId);
  
  }
}

export default SongAlbumService;
