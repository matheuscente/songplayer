import SongService from "../../services/song.service";
import { ISongRepository, IDatabaseSong } from "../../models/song.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método delete do service de song", () => {
  let service: SongService;
  let mockRepository: jest.Mocked<ISongRepository>;
  let songs: IDatabaseSong[];

  beforeEach(() => {
        songs = [
            {
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: 150
        },
        {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: 200
        }
    ];

    //mockando repository
    mockRepository = {
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

   

    //instância de service com repositório mockado
    service = new SongService(mockRepository);

    //comportamento do mock repository
    mockRepository.getById.mockImplementation((id: number) => {
      const song = songs.find((song) => song.songId === id);

      if (!song) return undefined;

      return song;
    });

    mockRepository.delete.mockImplementation((id: number) => {
      const index = songs.findIndex((song) => song.songId === id);
      songs.splice(index, 1);
    });
  });

  afterEach(() => {
      songs = [
            {
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: 15000
        },
        {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: 20000
        }
    ];

  });

  it("success: deve deletar um song de acordo com o id", () => {
    const oldRepo = [...songs];
    service.delete(1);

    console.log(`
            deve deletar um song de acordo com o id
            dados repository: ${JSON.stringify(oldRepo)}
            dados após a deleção: ${JSON.stringify(songs)}
            `);

    expect(songs.length).toBe(1);
    expect(songs).toEqual([
      {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: 200
        },
    ]);
  });

  it("error case: deve dar erro caso id não seja number", () => {
    try {
      service.delete('1a' as any);
    } catch (err) {
      console.log(
        `deve dar erro caso id não seja number\n
            retorno: ${err}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        `"id" must be a number`
      );
    }
  });

  it("error case: deve dar erro caso song não exista", () => {
    try {
      service.delete(3);
    } catch (err) {
      console.log(
        `error case: deve dar erro caso song não exista\n
            retorno: ${err}
            `
      );
      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toBe(
        `música não encontrada`
      );
    }
  });
});
