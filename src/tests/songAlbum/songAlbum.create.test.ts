import { IAlbumService } from "../../models/album.model";

import {
  ISongAlbum,
  ISongAlbumRepository,
  ISongAlbumService,
} from "../../models/songAlbum.model";
import { ISongService } from "../../models/song.model";
import SongAlbumService from "../../services/songAlbum.service";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método create do service de songAlbum", () => {
  let songAlbumDB: ISongAlbum[];

  const mockRepository: jest.Mocked<ISongAlbumRepository> = {
    getById: jest.fn(),
    getByAlbumId: jest.fn(),
    getBySongId: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };
  const service: ISongAlbumService = new SongAlbumService(mockRepository);
  const songService: jest.Mocked<ISongService> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const albumService: jest.Mocked<IAlbumService> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByArtistId: jest.fn(),
    setDependencies: jest.fn(),
  };

  beforeAll(() => {
    service.setDependencies(songService, albumService);
  });

  beforeEach(() => {
    songAlbumDB = [];

    //comportamento do mock
    mockRepository.create.mockImplementation(async (item: ISongAlbum) => {
      songAlbumDB.push(item);
    });
  });

  it("success case: deve criar uma relação", async () => {
    songService.getById.mockResolvedValue({
      id: 1,
      duration: "00:00:00",
      name: "teste",
      year: 2000
    });
    albumService.getById.mockResolvedValue({
      id: 1,
      title: "teste",
      year: 2000,
      artist_id: 1
    });

    const relation: ISongAlbum = { song_id: 1, album_id: 1 };
    await service.create(relation);
    console.log(
      `deve criar uma relação\n
            dados passados para criação: ${JSON.stringify(relation)}
            dados no banco: ${JSON.stringify(songAlbumDB)}
            `
    );

    expect(songAlbumDB[0]).toEqual(relation);
    expect(songAlbumDB.length).toBe(1);
  });

  it("error case: deve dar erro pois o id de song não é um número", async () => {
    try {
      const relation: ISongAlbum = {
        song_id: "a1" as unknown as number,
        album_id: 1,
      };

      await service.create(relation);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois o id de song não é um número\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect(songAlbumDB.length).toBe(0);
      expect((err as ValidationError).message).toBe(
        '"song_id" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de album não é um número", async () => {
    try {
      const relation: ISongAlbum = {
        song_id: 1,
        album_id: "a1" as unknown as number,
      };

      await service.create(relation);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois o id de album não é um número\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect(songAlbumDB.length).toBe(0);
      expect((err as ValidationError).message).toBe(
        '"album_id" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois não existe song com id 1", async () => {
    try {
      songService.getById.mockResolvedValue(undefined);
      albumService.getById.mockResolvedValue({
        id: 1,
        title: "teste",
        year: 2000,
        artist_id: 1,
      });
      const relation: ISongAlbum = {
        song_id: 1,
        album_id: 1,
      };

      await service.create(relation);

      throw new Error("era pra retornar NotFoundError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois não existe song com id 1\n
            dados retornados: ${JSON.stringify((err as NotFoundError).message)}
            `
      );

      expect(err).toBeInstanceOf(NotFoundError);
      expect(songAlbumDB.length).toBe(0);
      expect((err as NotFoundError).message).toBe("música não existente");
    }
  });

  it("error case: deve dar erro pois não existe album com id 1", async () => {
    try {
      songService.getById.mockResolvedValue({
      id: 1,
      duration: "00:00:00",
      name: "teste",
      year: 2000
    });
      albumService.getById.mockResolvedValue(undefined);
      const relation: ISongAlbum = {
        song_id: 1,
        album_id: 1,
      };

      await service.create(relation);

      throw new Error("era pra retornar NotFoundError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois não existe album com id 1\n
            dados retornados: ${JSON.stringify((err as NotFoundError).message)}
            `
      );

      expect(err).toBeInstanceOf(NotFoundError);
      expect(songAlbumDB.length).toBe(0);
      expect((err as NotFoundError).message).toBe("album não existente");
    }
  });

  it("error case: deve dar erro pois a relação já existe", async () => {
    try {
      songService.getById.mockResolvedValue({
      id: 1,
      duration: "00:00:00",
      name: "teste",
      year: 2000
    });
      albumService.getById.mockResolvedValue({
        id: 1,
        title: "teste",
        year: 2000,
        artist_id: 1,
      });

      mockRepository.getById.mockResolvedValue({song_id: 1, album_id: 1})
      const relation: ISongAlbum = {
        song_id: 1,
        album_id: 1,
      };

      await service.create(relation);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois a relação já existe\n
            dados retornados: ${JSON.stringify((err as ValidationError).message)}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect(songAlbumDB.length).toBe(0);
      expect((err as ValidationError).message).toBe("relação já existente");
    }
  });

    it("error case: deve dar erro pois o song id nao foi passado", async () => {
    try {
      const songAlbum: any = {
        album_id: 1,
      };

      await service.create(songAlbum);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois o song id nao foi passado\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        '"song_id" is required'
      );
    }
  });

    it("error case: deve dar erro pois o album id nao foi passado", async () => {
    try {
      const songAlbum: any = {
        song_id: 1
      };

      await service.create(songAlbum);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `ddeve dar erro pois o album id nao foi passado\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        '"album_id" is required'
      );
    }
  });

});
