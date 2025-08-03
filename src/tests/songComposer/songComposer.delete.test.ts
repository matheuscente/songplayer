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

describe("testes unitários do método delete do service de songComposer",() => {

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
        song_id: 1,
        composer_id: 1,
        composition: 'letra'
  },
  {
    song_id: 1,
    composer_id: 2,
    composition: 'letra'
  }
]
    //comportamento do mock
    mockRepository.getById.mockImplementation(async (songId, ComposerId) => {
      return songComposerDB.find(item => 
        item.composer_id === ComposerId && item.song_id === songId
      ) 
    });

    mockRepository.delete.mockImplementation(async (songId, composerId) => {
        const indexItem = songComposerDB.findIndex(item => item.composer_id === composerId && item.song_id === songId)
        if(indexItem === -1) throw new NotFoundError('relação não existente')
        songComposerDB.splice(indexItem, 1)
    })
  });

  it("success case: deve deletar a relação de acordo com o songId e composerId", async () => {
    const deletedData = {...songComposerDB[0]}
    const songComposer: ISongComposer = { song_id: 1, composer_id: 1 , composition: 'letra'};
    await service.delete(songComposer.song_id, songComposer.composer_id);
    console.log(
      `deve deletar a relação de acordo com o songId e composerId\n
            dados passados para deleção: ${JSON.stringify(songComposer)}
            dados que devem ser deletados: ${JSON.stringify(deletedData)}
            `
    );

    expect(songComposer).toEqual(deletedData);
    expect(songComposerDB.length).toBe(1)
  });

   it("error case: deve dar erro pois o id de composer não é um número", async () => {
    try {
      const songComposer: ISongComposer = {
        song_id: 1,
        composer_id: "a1" as unknown as number,
        composition: 'letra'
      };

      await service.delete(songComposer.song_id, songComposer.composer_id);

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
        '"composer_id" must be a number'
      );
    }
  });

  it("error case: deve dar erro pois o id de song não é um número", async () => {
    try {
      const songComposer: ISongComposer = {
        song_id: "a1" as unknown as number,
        composer_id: 1,
        composition: 'letra'
      };

      await service.delete(songComposer.song_id, songComposer.composer_id);

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
        '"song_id" must be a number'
      );
    }
  });

  it("error case: deve retornar erro pois a relação não existe", async () => {
    try {
         songComposerDB.splice(0,1)
      const songComposer: ISongComposer = {
        song_id: 1,
        composer_id: 1,
        composition: 'letra'
      };

      await service.delete(songComposer.song_id, songComposer.composer_id);
    } catch(err) {
        console.log(
        `deve retornar undefined pois a relação não existe\n
            dados retornados: ${JSON.stringify(err)}
            `
      )

      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toBe('relação não existente');
    }
   
      

  });

  it("error case: deve dar erro pois o song id nao foi passado", async () => {
    try {
      const songComposer: any = {
        composer_id: 1,
      };

      await service.delete(songComposer.songId, songComposer.composer_id);

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
      const songComposer: any = {
        song_Id: 1,
      };

      await service.delete(songComposer.song_Id, songComposer.ComposerId);

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



});
