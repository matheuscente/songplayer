import { IAlbumService } from "../../models/album.model";

import {
  ISongAlbum,
  ISongAlbumRepository,
  ISongAlbumService,
} from "../../models/songAlbum.model";
import { ISongService } from "../../models/song.model";
import SongAlbumService from "../../services/songAlbum.service";
import { ValidationError } from "../../errors/validation.error";

describe("testes unitários do método getById do service de songAlbum", () => {

    let songAlbumDB: ISongAlbum[]
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
       songAlbumDB = [
    {
        songId: 1,
        albumId: 1
  },
  {
    songId: 1,
    albumId: 2
  }
]
    //comportamento do mock
    mockRepository.getById.mockImplementation((songId, albumId) => {
      return songAlbumDB.find(item => 
        item.albumId === albumId && item.songId === songId
      ) 
    });
  });

  it("success case: deve retornar a relação de acordo com o songId e albumId", () => {

    const songAlbum: ISongAlbum = { songId: 1, albumId: 1 };
    const relation = service.getById(songAlbum.songId, songAlbum.albumId);
    console.log(
      `deve retornar a relação de acordo com o songId e albumId\n
            dados passados para busca: ${JSON.stringify(songAlbum)}
            dados que retornados: ${JSON.stringify(songAlbumDB[0])}
            `
    );

    expect(songAlbumDB[0]).toEqual(relation);
  });

   it("error case: deve dar erro pois o id de album não é um número", () => {
    try {
      const songAlbum: ISongAlbum = {
        songId: 1,
        albumId: "a1" as unknown as number,
      };

      service.getById(songAlbum.songId, songAlbum.albumId);

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
      expect((err as ValidationError).message).toBe(
        '"albumId" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de song não é um número", () => {
    try {
      const songAlbum: ISongAlbum = {
        songId: "a1" as unknown as number,
        albumId: 1,
      };

      service.getById(songAlbum.songId, songAlbum.albumId);

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
      expect((err as ValidationError).message).toBe(
        '"songId" must be a number'
      );
    }
  });

  it("error case: deve retornar undefined pois a relação não existe", () => {

    songAlbumDB.splice(0,1)
      const songAlbum: ISongAlbum = {
        songId: 1,
        albumId: 1
      };

      const data = service.getById(songAlbum.songId, songAlbum.albumId);
      console.log(
        `deve retornar undefined pois a relação não existe\n
            dados retornados: ${data}
            `
      )

      expect(data).toBe(undefined);

  });

  it("error case: deve dar erro pois o song id nao foi passado", () => {
    try {
      const songAlbum: any = {
        albumId: 1,
      };

      service.getById(songAlbum.songId, songAlbum.albumId);

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

      service.getById(songAlbum.songId, songAlbum.albumId);

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
