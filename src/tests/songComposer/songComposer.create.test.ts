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
    mockRepository.create.mockImplementation((item: ISongComposer) => {
      songComposerDB.push(item);
    });
  });

  it("success case: deve criar uma relação", () => {
    songService.getById.mockReturnValue({
      songId: 1,
      songDuration: "00:00:00",
      songName: "teste",
      songYear: 2000
    });
    composerService.getById.mockReturnValue({
      composerId: 1,
      composerName: "teste"
    });

    const relation: ISongComposer = { songId: 1, composerId: 1 , composition: "letra"};
    service.create(relation);
    console.log(
      `deve criar uma relação\n
            dados passados para criação: ${JSON.stringify(relation)}
            dados no banco: ${JSON.stringify(songComposerDB)}
            `
    );

    expect(songComposerDB[0]).toEqual(relation);
    expect(songComposerDB.length).toBe(1);
  });

  it("error case: deve dar erro pois o id de song não é um número", () => {
    try {
      const relation: ISongComposer = {
        songId: "a1" as unknown as number,
        composerId: 1,
        composition: "letra"
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
      expect(songComposerDB.length).toBe(0);
      expect((err as ValidationError).message).toBe(
        '"songId" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de composer não é um número", () => {
    try {
      const relation: ISongComposer = {
        songId: 1,
        composerId: "a1" as unknown as number,
        composition: "letra"
      };

      service.create(relation);

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
        '"composerId" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois não existe song com id 1", () => {
    try {
      songService.getById.mockReturnValue(undefined);
      composerService.getById.mockReturnValue({
        composerId: 1,
        composerName: "teste"
      });
      const relation: ISongComposer = {
        songId: 1,
        composerId: 1,
        composition: "letra"
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
      expect(songComposerDB.length).toBe(0);
      expect((err as NotFoundError).message).toBe("música não existente");
    }
  });

  it("error case: deve dar erro pois não existe Composer com id 1", () => {
    try {
      songService.getById.mockReturnValue({
      songId: 1,
      songDuration: "00:00:00",
      songName: "teste",
      songYear: 2000
    });
      composerService.getById.mockReturnValue(undefined);
      const relation: ISongComposer = {
        songId: 1,
        composerId: 1,
        composition: "letra"
      };

      service.create(relation);

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

  it("error case: deve dar erro pois a relação já existe", () => {
    try {
      songService.getById.mockReturnValue({
      songId: 1,
      songDuration: "00:00:00",
      songName: "teste",
      songYear: 2000
    });
      composerService.getById.mockReturnValue({
        composerId: 1,
        composerName: "teste"
      });

      mockRepository.getById.mockReturnValue({songId: 1, composerId: 1, composition: "letra"})
      const relation: ISongComposer = {
        songId: 1,
        composerId: 1,
        composition: "letra"
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
      expect(songComposerDB.length).toBe(0);
      expect((err as ValidationError).message).toBe("relação já existente");
    }
  });

    it("error case: deve dar erro pois o song id nao foi passado", () => {
    try {
      const relation: any = {
        composerId: 1,
        composition: "letra"
      };


      service.create(relation);

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
      const relation: any = {
        songId: 1,
        composition: "letra"
      };
      service.create(relation);

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

      it("error case: deve dar erro pois o composition nao foi passado", () => {
    try {
      const songComposer: any = {
        songId: 1,
        composerId: 1
      };

      service.create(songComposer);

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
