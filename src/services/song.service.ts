import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { idSchemaValidate, PrismaTransactionClient } from "../models/global.model";
import {
  IClientSong,
  IDatabaseSong,
  ISongRepository,
  ISongService,
  songSchemaValidate,
  songUpdateSchemaValidate,
  UpdateSong,
} from "../models/song.model";
import DataValidator from "../utils/dataValidator.utils";
import runInTransaction from "../utils/runInTransaction.utils";
import TimeConverter from "../utils/timeConverter.utils";

class SongService implements ISongService {
  private readonly songRepository: ISongRepository;
  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }



  async getAll(tx?: PrismaTransactionClient): Promise<IDatabaseSong[]> {
    const songs = await this.songRepository.getAll();
    songs.forEach((song) => {
      song.duration
      song.duration = TimeConverter.millisecondsToTime(
        song.duration as number
      );
    });
    return songs;
  }
  async getById(id: number, tx?: PrismaTransactionClient): Promise<IDatabaseSong | undefined> {
    DataValidator.validator(idSchemaValidate, {id})
    const song = await this.songRepository.getById(id, tx);
    if (song) {
      song.duration = TimeConverter.millisecondsToTime(
        song.duration as unknown as number
      );
      return song;
    }
    return undefined;
  }
  async create(item: IClientSong): Promise<number> {
    const songToCreate = {...item} 
    DataValidator.validator(songSchemaValidate, songToCreate)
    let songId: number = 0;
    await runInTransaction(async  (tx) => {
      if (typeof songToCreate.duration === "string") {
        songToCreate.duration = TimeConverter.timeToMilliseconds(songToCreate.duration);
      } else if (!Number.isInteger(songToCreate.duration)) {
        throw new ValidationError("duração da música inválida");
      }

      songId = await this.songRepository.create(songToCreate, tx);
    });
    return songId;
  }

  async update(item: UpdateSong): Promise<void> {
    const songToUpdate = {...item} 
    DataValidator.validator(songUpdateSchemaValidate, songToUpdate)
    await runInTransaction(async  (tx) => {
      const song = await this.getById(songToUpdate.id, tx);
      if (!song) throw new NotFoundError("música não encontrada");
      if (songToUpdate.duration && typeof songToUpdate.duration === "string") {
        songToUpdate.duration = TimeConverter.timeToMilliseconds(songToUpdate.duration);
      } else if (songToUpdate.duration && !Number.isInteger(songToUpdate.duration)) {
        throw new ValidationError("duração da música inválida");
      }
      this.songRepository.update({
        id: song.id,
        duration:
          songToUpdate.duration ??
          TimeConverter.timeToMilliseconds(song.duration as unknown as string),
        name: songToUpdate.name ?? song.name,
        year: songToUpdate.year ?? song.year,
      }, tx);
    });
  }
  async delete(id: number): Promise<void> {
    DataValidator.validator(idSchemaValidate, {id})
    await runInTransaction(async  (tx) => {
      const song = await this.getById(id, tx);
      if (!song) throw new NotFoundError("música não encontrada");
      await this.songRepository.delete(id, tx);
    });
  }
}

export default SongService;
