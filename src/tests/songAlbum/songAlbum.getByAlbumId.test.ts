import { IAlbumService } from "../../models/album.model";

import {
  ISongAlbum,
  ISongAlbumRepository,
  ISongAlbumService,
} from "../../models/songAlbum.model";
import { ISongService } from "../../models/song.model";
import SongAlbumService from "../../services/songAlbum.service";
import { ValidationError } from "../../errors/validation.error";

describe("testes unitários do método getByAlbumId do service de songAlbum", () => {

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
        song_id: 1,
        album_id: 1
  },
  {
    song_id: 1,
    album_id: 2
  },

  {
    song_id: 2,
    album_id: 2
  }
]
    //comportamento do mock
    mockRepository.getByAlbumId.mockImplementation(async (albumId) => {
      return songAlbumDB.filter(item => 
        item.album_id === albumId
      ) 
    });
  });

  it("success case: deve retornar a relação de acordo com o albumId: 2", async () => {

    const expected: ISongAlbum[] = [
        {
    song_id: 1,
    album_id: 2
  },

  {
    song_id: 2,
    album_id: 2
  }
]

    const relations = await service.getByAlbumId(2);
    console.log(
      `deve retornar a relação de acordo com o albumId: 2\n
            dados que devem ser retornados: ${JSON.stringify(expected)}
            `
    );

    expect(expected).toEqual(relations);
  });

   it("error case: deve dar erro pois o id passado não é um número", async () => {
    try {

      await service.getByAlbumId('1a' as unknown as number);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois o id passado é um número\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        '"id" must be a number'
      );
    }
  });

  it("error case: deve retornar array vazio pois a relação não existe", async () => {

      const data = await service.getByAlbumId(3);
      console.log(
        `deve retornar array vazio pois a relação não existe\n
            dados retornados: ${data}
            `
      )

      expect(data.length).toBe(0);

  });

});
