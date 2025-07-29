import { IComposerService } from "../../models/composer.model";

import {
  ISongComposer,
  ISongComposerRepository,
  ISongComposerService,
} from "../../models/songComposer.model";
import { ISongService } from "../../models/song.model";
import SongComposerService from "../../services/songComposer.service";
import { ValidationError } from "../../errors/validation.error";

describe("testes unitários do método getById do service de songComposer", () => {

    let songComposerDB: ISongComposer[]
  const mockRepository: jest.Mocked<ISongComposerRepository> = {
    getById: jest.fn(),
    getByComposerId: jest.fn(),
    getBySongId: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };
  const service: ISongComposerService = new SongComposerService(mockRepository);
  const songService: jest.Mocked<ISongService> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const ComposerService: jest.Mocked<IComposerService> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(() => {
    service.setDependencies(songService, ComposerService);
  });

  beforeEach(() => {
       songComposerDB = [
    {
        songId: 1,
        composerId: 1,
        composition: 'letra'
  },
  {
    songId: 1,
    composerId: 2,
    composition: 'letra'
  }
]
    //comportamento do mock
    mockRepository.getById.mockImplementation((songId, ComposerId) => {
      return songComposerDB.find(item => 
        item.composerId === ComposerId && item.songId === songId
      ) 
    });
  });

  it("success case: deve retornar a relação de acordo com o songId e composerId", () => {

    const songComposer: ISongComposer = { songId: 1, composerId: 1, composition: 'letra'};
    const relation = service.getById(songComposer.songId, songComposer.composerId);
    console.log(
      `deve retornar a relação de acordo com o songId e composerId\n
            dados passados para busca: ${JSON.stringify(songComposer)}
            dados que devem ser retornados: ${JSON.stringify(songComposerDB[0])}
            `
    );

    expect(songComposerDB[0]).toEqual(relation);
  });

   it("error case: deve dar erro pois o id de composer não é um número", () => {
    try {
      const songComposer: ISongComposer = {
        songId: 1,
        composerId: "a1" as unknown as number,
        composition: 'letra'
      };

      service.getById(songComposer.songId, songComposer.composerId);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois o id de composer não é um número\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        '"composerId" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de song não é um número", () => {
    try {
      const songComposer: ISongComposer = {
        songId: "a1" as unknown as number,
        composerId: 1,
        composition: 'letra'
      };

      service.getById(songComposer.songId, songComposer.composerId);

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

    songComposerDB.splice(0,1)
      const songComposer: ISongComposer = {
        songId: 1,
        composerId: 1,
        composition: 'letra'
      };

      const data = service.getById(songComposer.songId, songComposer.composerId);
      console.log(
        `deve retornar undefined pois a relação não existe\n
            dados retornados: ${data}
            `
      )

      expect(data).toBe(undefined);

  });

  it("error case: deve dar erro pois o song id nao foi passado", () => {
    try {
      const songComposer: any = {
        ComposerId: 1,
      };

      service.getById(songComposer.songId, songComposer.ComposerId);

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

    it("error case: deve dar erro pois o composer id nao foi passado", () => {
    try {
      const songComposer: any = {
        songId: 1,
      };

      service.getById(songComposer.songId, songComposer.ComposerId);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `ddeve dar erro pois o composer id nao foi passado\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        '"composerId" is required'
      );
    }
  });



});
