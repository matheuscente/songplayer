import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";
import { idSchemaValidate } from "../models/global.model";
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
import { runInTransaction } from "../utils/runInTransaction.utils";
import TimeConverter from "../utils/timeConverter.utils";

class SongService implements ISongService {
  private readonly songRepository: ISongRepository;
  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }



  getAll(): IDatabaseSong[] {
    const songs = this.songRepository.getAll();
    songs.forEach((song) => {
      song.songDuration = TimeConverter.millisecondsToTime(
        song.songDuration as number
      );
    });
    return songs;
  }
  getById(id: number): IDatabaseSong | undefined {
    DataValidator.validator(idSchemaValidate, {id})
    const song = this.songRepository.getById(id);
    if (song) {
      song.songDuration = TimeConverter.millisecondsToTime(
        song.songDuration as number
      );
      return song;
    }
    return undefined;
  }
  create(item: IClientSong): number {
    const songToCreate = {...item} 
    DataValidator.validator(songSchemaValidate, songToCreate)
    let songId: number = 0;
    runInTransaction(() => {
      if (typeof songToCreate.songDuration === "string") {
        songToCreate.songDuration = TimeConverter.timeToMilliseconds(songToCreate.songDuration);
      } else if (!Number.isInteger(songToCreate.songDuration)) {
        throw new ValidationError("duração da música inválida");
      }

      songId = this.songRepository.create(songToCreate);
    });
    return songId;
  }

  update(item: UpdateSong): void {
    const songToUpdate = {...item} 
    DataValidator.validator(songUpdateSchemaValidate, songToUpdate)
    runInTransaction(() => {
      const song = this.getById(songToUpdate.songId);
      if (!song) throw new NotFoundError("música não encontrada");
      if (songToUpdate.songDuration && typeof songToUpdate.songDuration === "string") {
        songToUpdate.songDuration = TimeConverter.timeToMilliseconds(songToUpdate.songDuration);
      } else if (songToUpdate.songDuration && !Number.isInteger(songToUpdate.songDuration)) {
        throw new ValidationError("duração da música inválida");
      }
      this.songRepository.update({
        songId: song.songId,
        songDuration:
          songToUpdate.songDuration ??
          TimeConverter.timeToMilliseconds(song.songDuration as string),
        songName: songToUpdate.songName ?? song.songName,
        songYear: songToUpdate.songYear ?? song.songYear,
      });
    });
  }
  delete(id: number): void {
    DataValidator.validator(idSchemaValidate, {id})
    runInTransaction(() => {
      const song = this.getById(id);
      if (!song) throw new NotFoundError("música não encontrada");
      this.songRepository.delete(id);
    });
  }
}

export default SongService;
