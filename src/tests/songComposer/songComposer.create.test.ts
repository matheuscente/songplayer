import { IComposerService } from "../../models/composer.model";

import {
  ISongComposer,
  ISongComposerRepository,
  ISongComposerService,
} from "../../models/songComposer.model";
import { ISongService } from "../../models/song.model";
import SongComposerService from "../../services/songComposer.service";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método create do service de songComposer", () => {
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
  const composerService: jest.Mocked<IComposerService> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(() => {
    service.setDependencies(songService, composerService);
  });

  beforeEach(() => {
    songComposerDB = [];

    //comportamento do mock
    mockRepository.create.mockImplementation(async (item: ISongComposer) => {
      songComposerDB.push(item);
    });
  });

  it("success case: deve criar uma relação", async () => {
    songService.getById.mockResolvedValue({
      id: 1,
      duration: "00:00:00",
      name: "teste",
      year: 2000
    });
    composerService.getById.mockResolvedValue({
      id: 1,
      name: "teste"
    });

    const relation: ISongComposer = { song_id: 1, composer_id: 1 , composition: "letra"};
    await service.create(relation);
    console.log(
      `deve criar uma relação\n
            dados passados para criação: ${JSON.stringify(relation)}
            dados no banco: ${JSON.stringify(songComposerDB)}
            `
    );

    expect(songComposerDB[0]).toEqual(relation);
    expect(songComposerDB.length).toBe(1);
  });

  it("error case: deve dar erro pois o id de song não é um número", async () => {
    try {
      const relation: ISongComposer = {
        song_id: "a1" as unknown as number,
        composer_id: 1,
        composition: "letra"
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
      expect(songComposerDB.length).toBe(0);
      expect((err as ValidationError).message).toBe(
        '"song_id" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de composer não é um número", async () => {
    try {
      const relation: ISongComposer = {
        song_id: 1,
        composer_id: "a1" as unknown as number,
        composition: "letra"
      };

      await service.create(relation);

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
      expect(songComposerDB.length).toBe(0);
      expect((err as ValidationError).message).toBe(
        '"composer_id" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois não existe song com id 1", async () => {
    try {
      songService.getById.mockResolvedValue(undefined);
      composerService.getById.mockResolvedValue({
        id: 1,
        name: "teste"
      });
      const relation: ISongComposer = {
        song_id: 1,
        composer_id: 1,
        composition: "letra"
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
      expect(songComposerDB.length).toBe(0);
      expect((err as NotFoundError).message).toBe("música não existente");
    }
  });

  it("error case: deve dar erro pois não existe Composer com id 1", async () => {
    try {
      songService.getById.mockResolvedValue({
      id: 1,
      duration: "00:00:00",
      name: "teste",
      year: 2000
    });
      composerService.getById.mockResolvedValue(undefined);
      const relation: ISongComposer = {
        song_id: 1,
        composer_id: 1,
        composition: "letra"
      };

      await service.create(relation);

      throw new Error("era pra retornar NotFoundError mas não retornou");
    } catch (err) {
      console.log(
        `deve dar erro pois não existe composer com id 1\n
            dados retornados: ${JSON.stringify((err as NotFoundError).message)}
            `
      );

      expect(err).toBeInstanceOf(NotFoundError);
      expect(songComposerDB.length).toBe(0);
      expect((err as NotFoundError).message).toBe("compositor não existente");
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
      composerService.getById.mockResolvedValue({
        id: 1,
        name: "teste"
      });

      mockRepository.getById.mockResolvedValue({song_id: 1, composer_id: 1, composition: "letra"})
      const relation: ISongComposer = {
        song_id: 1,
        composer_id: 1,
        composition: "letra"
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
      expect(songComposerDB.length).toBe(0);
      expect((err as ValidationError).message).toBe("relação já existente");
    }
  });

    it("error case: deve dar erro pois o song id nao foi passado", async () => {
    try {
      const relation: any = {
        composer_id: 1,
        composition: "letra"
      };


      await service.create(relation);

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

    it("error case: deve dar erro pois o composer id nao foi passado", async () => {
    try {
      const relation: any = {
        song_id: 1,
        composition: "letra"
      };
      await service.create(relation);

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
        '"composer_id" is required'
      );
    }
  });

      it("error case: deve dar erro pois o composition nao foi passado", async () => {
    try {
      const songComposer: any = {
        song_id: 1,
        composer_id: 1
      };

      await service.create(songComposer);

      throw new Error("era pra retornar ValidationError mas não retornou");
    } catch (err) {
      console.log(
        `ddeve dar erro pois o composition id nao foi passado\n
            dados retornados: ${JSON.stringify(
              (err as ValidationError).message
            )}
            `
      );

      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        '"composition" is required'
      );
    }
  });


});
