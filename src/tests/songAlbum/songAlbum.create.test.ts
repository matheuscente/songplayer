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
    mockRepository.create.mockImplementation((item: ISongAlbum) => {
      songAlbumDB.push(item);
    });
  });

  it("success case: deve criar uma relação", () => {
    songService.getById.mockReturnValue({
      songId: 1,
      songDuration: "00:00:00",
      songName: "teste",
      songYear: 2000
    });
    albumService.getById.mockReturnValue({
      albumId: 1,
      albumTitle: "teste",
      albumYear: 2000,
      artistId: 1
    });

    const relation: ISongAlbum = { songId: 1, albumId: 1 };
    service.create(relation);
    console.log(
      `deve criar uma relação\n
            dados passados para criação: ${JSON.stringify(relation)}
            dados no banco: ${JSON.stringify(songAlbumDB)}
            `
    );

    expect(songAlbumDB[0]).toEqual(relation);
    expect(songAlbumDB.length).toBe(1);
  });

  it("error case: deve dar erro pois o id de song não é um número", () => {
    try {
      const relation: ISongAlbum = {
        songId: "a1" as unknown as number,
        albumId: 1,
      };

      service.create(relation);

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
        '"songId" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de album não é um número", () => {
    try {
      const relation: ISongAlbum = {
        songId: 1,
        albumId: "a1" as unknown as number,
      };

      service.create(relation);

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
        '"albumId" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois não existe song com id 1", () => {
    try {
      songService.getById.mockReturnValue(undefined);
      albumService.getById.mockReturnValue({
        albumId: 1,
        albumTitle: "teste",
        albumYear: 2000,
        artistId: 1,
      });
      const relation: ISongAlbum = {
        songId: 1,
        albumId: 1,
      };

      service.create(relation);

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

  it("error case: deve dar erro pois não existe album com id 1", () => {
    try {
      songService.getById.mockReturnValue({
      songId: 1,
      songDuration: "00:00:00",
      songName: "teste",
      songYear: 2000
    });
      albumService.getById.mockReturnValue(undefined);
      const relation: ISongAlbum = {
        songId: 1,
        albumId: 1,
      };

      service.create(relation);

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

  it("error case: deve dar erro pois a relação já existe", () => {
    try {
      songService.getById.mockReturnValue({
      songId: 1,
      songDuration: "00:00:00",
      songName: "teste",
      songYear: 2000
    });
      albumService.getById.mockReturnValue({
        albumId: 1,
        albumTitle: "teste",
        albumYear: 2000,
        artistId: 1,
      });

      mockRepository.getById.mockReturnValue({songId: 1, albumId: 1})
      const relation: ISongAlbum = {
        songId: 1,
        albumId: 1,
      };

      service.create(relation);

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

    it("error case: deve dar erro pois o song id nao foi passado", () => {
    try {
      const songAlbum: any = {
        albumId: 1,
      };

      service.create(songAlbum);

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
        '"songId" is required'
      );
    }
  });

    it("error case: deve dar erro pois o album id nao foi passado", () => {
    try {
      const songAlbum: any = {
        songId: 1,
      };

      service.create(songAlbum);

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
        '"albumId" is required'
      );
    }
  });

});
