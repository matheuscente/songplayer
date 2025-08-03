import { IComposerService } from "../../models/composer.model";

import {
  ISongComposer,
  ISongComposerRepository,
  ISongComposerService,
} from "../../models/songComposer.model";
import { ISongService } from "../../models/song.model";
import SongComposerService from "../../services/songComposer.service";
import { ValidationError } from "../../errors/validation.error";

describe("testes unitários do método getByComposerId do service de songComposer", () => {
  let songComposerDB: ISongComposer[];
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
    delete: jest.fn(),
  };

  beforeAll(() => {
    service.setDependencies(songService, ComposerService);
  });

  beforeEach(() => {
    songComposerDB = [
      {
        song_id: 1,
        composer_id: 1,
        composition: 'letra'
      },
      {
        song_id: 1,
        composer_id: 2,
        composition: 'letra'
      },

      {
        song_id: 2,
        composer_id: 2,
        composition: 'letra'
      },
    ];
    //comportamento do mock
    mockRepository.getByComposerId.mockImplementation(async (composerId) => {
      return songComposerDB.filter((item) => item.composer_id === composerId);
    });
  });

  it("success case: deve retornar a relação de acordo com o composerId: 2", async () => {
    const expected: ISongComposer[] = [
      {
        song_id: 1,
        composer_id: 2,
        composition: 'letra'
      },
      {
        song_id: 2,
        composer_id: 2,
        composition: 'letra'
      },
    ];

    const relations = await service.getByComposerId(2);
    console.log(
      `deve retornar a relação de acordo com o composerId: 2\n
            dados que devem ser retornados: ${JSON.stringify(expected)}
            `
    );

    expect(expected).toEqual(relations);
  });

  it("error case: deve dar erro pois o id passado não é um número", async () => {
    try {
      await service.getByComposerId("1a" as unknown as number);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois o id passado não é um número\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe('"id" must be a number');
    }
  });

  it("error case: deve retornar array vazio pois a relação não existe", async () => {
    const data = await service.getByComposerId(3);
    console.log(
      `deve retornar array vazio pois a relação não existe\n
            dados retornados: ${data}
            `
    );

    expect(data.length).toBe(0);
  });
});
