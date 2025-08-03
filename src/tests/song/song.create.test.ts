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
            name: 'teste3',
            year: 2000,
            duration: "00:03:00"
    };

    songs = [
            {
            id: 1,
            name: 'teste',
            year: 2000,
            duration: 15000
        },
        {
            id: 2,
            name: 'teste2',
            year: 2000,
            duration: 20000
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
    mockRepository.create.mockImplementation(async (item: IClientSong) => {
      const newItem: IDatabaseSong = {
        id: 3,
        ...item,
      };
      songs.push(newItem);
      return newItem.id;
    });

    //instância de service com repositório mockado
    service = new SongService(mockRepository);
  });

  afterEach(async () => {
    songs = [
            {
            id: 1,
            name: 'teste',
            year: 2000,
            duration: "00:02:00"
        },
        {
            id: 2,
            name: 'teste2',
            year: 2000,
            duration: "00:02:00"
        }
    ];
  })

  it("success case: deve criar um song e receber o indice do song criado", async () => {
    const data = await service.create(song);
    const songInBd: IDatabaseSong = {...songs[2]}
    console.log(
      `deve criar um song e receber o indice do song criado: 3\n
            dados passados para criação: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(songs[2])}
            indice retornado: ${data}
            `
    );
    expect(data).toBe(3);
    expect({ id: 3, name: song.name, year: song.year, duration: TimeConverter.timeToMilliseconds((song.duration as string))}).toEqual(songInBd);
  });

  it("error case: deve dar erro por receber um song sem nome", async () => {
    try {
      const songWithOutTitle = {
        year: 2000,
        duration: "00:03:20"
      };
      await service.create(songWithOutTitle as any);
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
      expect((err as Error).message).toEqual('"name" is required');
    }
  });

  it("error case: deve dar erro por receber um song sem ano", async () => {
    try {
      const songWithOutTitle = {
        name: "teste",
        duration: "00:03:20"
      };
      await service.create(songWithOutTitle as any);
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um song sem ano\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"year" is required');
    }
  });

  it("error case: deve dar erro por receber um song sem propriedades", async () => {
    try {
      await service.create({} as any);
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
        '"name" is required, "year" is required, "duration" is required'
      );
    }
  });

  it("error case: deve dar erro por receber um song com propriedade inválida", async () => {
    try {
      await service.create({ ...song, invalidField: "true!" } as any);
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

  it("error case: deve dar erro por receber um song com nome como number", async () => {
    try {
      await service.create({name: 1, year: 2000,
            duration: "00:03:20"} as any);
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
      expect((err as Error).message).toEqual('"name" must be a string');
    }
  });

  it("error case: deve dar erro por receber um song com ano como string", async () => {
    try {
      await service.create({
        name: "teste3",
        year: "2000a",
        duration: "00:03:20",
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
      expect((err as Error).message).toEqual('"year" must be a number');
    }
  });

  it("error case: deve dar erro por receber um song com duração inválida", async () => {
    try {
      await service.create({
        name: "teste3",
        year: 2000,
        duration: "invalid"
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

  it("error case: deve dar erro por receber ano maior que ano atual", async () => {
    try {
      await service.create({
        name: "teste3",
        year: 2026,
        duration: "00:03:20"
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
      expect((err as Error).message).toEqual('"year" must be less than or equal to 2025');
    }
  });
});
