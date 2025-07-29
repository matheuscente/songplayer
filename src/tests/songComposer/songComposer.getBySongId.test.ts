import { IComposerService } from "../../models/composer.model";

import {
  ISongComposer,
  ISongComposerRepository,
  ISongComposerService,
} from "../../models/songComposer.model";
import { ISongService } from "../../models/song.model";
import SongComposerService from "../../services/songComposer.service";
import { ValidationError } from "../../errors/validation.error";

describe("testes unitários do método getBySongId do service de songComposer", () => {

    let songComposerDB: ISongComposer[]
  const mockRepository: jest.Mocked<ISongComposerRepository> = {
    getById: jest.fn(),
    getBySongId: jest.fn(),
    getByComposerId: jest.fn(),
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
  },

  {
    songId: 2,
    composerId: 2,
    composition: 'letra'
  }
]
    //comportamento do mock
    mockRepository.getBySongId.mockImplementation((songId) => {
      return songComposerDB.filter(item => 
        item.songId === songId
      ) 
    });
  });

  it("success case: deve retornar a relação de acordo com o songId: 2", () => {

    const expected: ISongComposer[] = [

  {
    songId: 2,
    composerId: 2,
    composition: 'letra'
  }
]

    const relations = service.getBySongId(2);
    console.log(
      `deve retornar a relação de acordo com o songId: 2\n
            dados que devem ser retornados: ${JSON.stringify(expected)}
            `
    );

    expect(expected).toEqual(relations);
  });

   it("error case: deve dar erro pois o id passado não é um número", () => {
    try {

      service.getBySongId('1a' as unknown as number);

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

  it("error case: deve retornar array vazio pois a relação não existe", () => {

      const data = service.getBySongId(3);
      console.log(
        `deve retornar array vazio pois a relação não existe\n
            dados retornados: ${data}
            `
      )

      expect(data.length).toBe(0);

  });

});
