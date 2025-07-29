import SongService from "../../services/song.service";
import {
  ISongRepository,
  IClientSong,
  IDatabaseSong
} from "../../models/song.model";
import { ValidationError } from "../../errors/validation.error";
import TimeConverter from "../../utils/timeConverter.utils";

describe("testes unitários do método create do service de song", () => {
  let service: SongService;
  let mockRepository: jest.Mocked<ISongRepository>;
  let songs: IDatabaseSong[];
  let song: IClientSong;



  beforeEach(() => {
    song = {
            songName: 'teste3',
            songYear: 2000,
            songDuration: "00:03:00"
    };

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

    //mockando repository
    mockRepository = {
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    //comportamento do mock
    mockRepository.create.mockImplementation((item: IClientSong) => {
      const newItem: IDatabaseSong = {
        songId: 3,
        ...item,
      };
      songs.push(newItem);
      return newItem.songId;
    });

    //instância de service com repositório mockado
    service = new SongService(mockRepository);
  });

  afterEach(() => {
    songs = [
            {
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: "00:02:00"
        },
        {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: "00:02:00"
        }
    ];
  })

  it("success case: deve criar um song e receber o indice do song criado", () => {
    const data = service.create(song);
    const songInBd: IDatabaseSong = {...songs[2]}
    console.log(
      `deve criar um song e receber o indice do song criado: 3\n
            dados passados para criação: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(songs[2])}
            indice retornado: ${data}
            `
    );
    expect(data).toBe(3);
    expect({ songId: 3, songName: song.songName, songYear: song.songYear, songDuration: TimeConverter.timeToMilliseconds((song.songDuration as string))}).toEqual(songInBd);
  });

  it("error case: deve dar erro por receber um song sem nome", () => {
    try {
      const songWithOutTitle = {
        songYear: 2000,
        songDuration: "00:03:20"
      };
      service.create(songWithOutTitle as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song sem nome\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"songName" is required');
    }
  });

  it("error case: deve dar erro por receber um song sem ano", () => {
    try {
      const songWithOutTitle = {
        songName: "teste",
        songDuration: "00:03:20"
      };
      service.create(songWithOutTitle as any);
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song sem ano\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"songYear" is required');
    }
  });

  it("error case: deve dar erro por receber um song sem propriedades", () => {
    try {
      service.create({} as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song sem propriedades\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual(
        '"songName" is required, "songYear" is required, "songDuration" is required'
      );
    }
  });

  it("error case: deve dar erro por receber um song com propriedade inválida", () => {
    try {
      service.create({ ...song, invalidField: "true!" } as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song com propriedade inválida\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"invalidField" is not allowed');
    }
  });

  it("error case: deve dar erro por receber um song com nome como number", () => {
    try {
      service.create({songName: 1, songYear: 2000,
            songDuration: "00:03:20"} as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song com nome como number\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"songName" must be a string');
    }
  });

  it("error case: deve dar erro por receber um song com ano como string", () => {
    try {
      service.create({
        songName: "teste3",
        songYear: "2000a",
        songDuration: "00:03:20",
      } as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song com ano como string\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"songYear" must be a number');
    }
  });

  it("error case: deve dar erro por receber um song com duração inválida", () => {
    try {
      service.create({
        songName: "teste3",
        songYear: 2000,
        songDuration: "invalid"
      } as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song duração inválida\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual("O campo deve estar no formato HH:MM:SS");
    }
  });

  it("error case: deve dar erro por receber ano maior que ano atual", () => {
    try {
      service.create({
        songName: "teste3",
        songYear: 2026,
        songDuration: "00:03:20"
      } as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            ddeve dar erro por receber ano maior que ano atual\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"songYear" must be less than or equal to 2025');
    }
  });
});
