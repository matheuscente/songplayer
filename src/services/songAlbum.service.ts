import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { IAlbumService } from "../models/album.model";
import { idSchemaValidate, PrismaTransactionClient } from "../models/global.model";
import { ISongService } from "../models/song.model";
import {
  ISongAlbum,
  ISongAlbumRepository,
  ISongAlbumService,
  songAlbumSchemaValidate,
} from "../models/songAlbum.model";
import DataValidator from "../utils/dataValidator.utils";
import runInTransaction from "../utils/runInTransaction.utils";

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

  async getById(songId: number, albumId: number, tx?: PrismaTransactionClient): Promise<ISongAlbum | undefined> {
    DataValidator.validator(songAlbumSchemaValidate, {song_id: songId, album_id: albumId})
    return this.songAlbumRepository.getById(songId, albumId, tx);

  }

  async create(songAlbum: ISongAlbum): Promise<void> {
    await runInTransaction(async  (tx) => {

      const hasSong = await this.songService.getById(songAlbum.song_id, tx)
      const hasAlbum = await this.albumService.getById(songAlbum.album_id, tx)
      
      if(!hasSong) throw new NotFoundError("música não existente")
      else if(!hasAlbum) throw new NotFoundError("album não existente")

      const hasData = await this.getById(songAlbum.song_id, songAlbum.album_id, tx)
      if(hasData) throw new ValidationError("relação já existente")
      await this.songAlbumRepository.create(songAlbum, tx);
    });
    
  }

  async delete(songId: number, albumId: number): Promise<void> {
    await runInTransaction(async (tx) => {
      const hasData = await this.getById(songId, albumId, tx)
      if(!hasData) throw new NotFoundError("relação não existente")
      await this.songAlbumRepository.delete(songId, albumId, tx);
    });
  }

  async getByAlbumId(albumId: number, tx?: PrismaTransactionClient): Promise<ISongAlbum[]>{
    DataValidator.validator(idSchemaValidate, {id: albumId})
    return this.songAlbumRepository.getByAlbumId(albumId, tx);

  }
  async getBySongId(songId: number, tx?: PrismaTransactionClient):  Promise<ISongAlbum[]> {
    DataValidator.validator(idSchemaValidate, {id: songId})
    return this.songAlbumRepository.getBySongId(songId, tx);
  
  }
}

export default SongAlbumService;
