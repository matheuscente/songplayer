import SongService from "../../services/song.service";
import {
  ISongRepository,
  IDatabaseSong,
  UpdateSong
} from "../../models/song.model";
import { ValidationError } from "../../errors/validation.error";
import TimeConverter from "../../utils/timeConverter.utils";

describe("testes unitários do método create do service de song", () => {
  let service: SongService;
  let mockRepository: jest.Mocked<ISongRepository>;
  let songs: IDatabaseSong[];

  beforeEach(() => {

    songs = [
            {
            id: 1,
            name: 'teste',
            year: 2000,
            duration: 15000
        },
        {
            id: 2,
            name: 'teste2',
            year: 2000,
            duration: 20000
        }
    ];

    //mockando repository
    mockRepository = {
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    //comportamento do mock
    mockRepository.update.mockImplementation(async (item: UpdateSong) => {
      songs.forEach(song => {
        if(song.id === item.id) {
            song.name = item.name ?? song.name,
            song.year = item.year ?? song.year,
            song.duration = item.duration ?? song.duration
        }
      })
    });

    mockRepository.getById.mockImplementation(async (id: number) => {
        return songs.find(song => 
            song.id === id
        )
    })

    //instância de service com repositório mockado
    service = new SongService(mockRepository);
  });

  afterEach(async () => {
    songs = [
            {
            id: 1,
            name: 'teste',
            year: 2000,
            duration: 15000
        },
        {
            id: 2,
            name: 'teste2',
            year: 2000,
            duration: 20000
        }
    ];
  })

  it("success case: deve atualizar o ano do song com o id especificado", async () => {
      const song: UpdateSong = {
        id: 1,
        year: 2001
      }
      
      const oldSong = {...songs[0]}

        await service.update(song);
    console.log(
      `deve atualizar o ano do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].name).toBe(oldSong.name);
    expect(songs[0].year).toBe(2001)
    expect(songs[0].duration).toBe(oldSong.duration)

  });

  it("success case: deve atualizar o nome do song com o id especificado", async () => {
      const song: UpdateSong = {
        id: 1,
        name: "teste UPDATE"
      }
      
      const oldSong = {...songs[0]}

        await service.update(song);
    console.log(
      `deve atualizar o nome do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].name).toBe('teste UPDATE');
    expect(songs[0].year).toBe(oldSong.year)
    expect(songs[0].duration).toBe(oldSong.duration)

  });

  it("success case: deve atualizar a duração do song com o id especificado", async () => {
      const song: UpdateSong = {
        id: 1,
        duration: "00:03:00"
      }
      
      const oldSong = {...songs[0]}

        await service.update(song);
    console.log(
      `deve atualizar a duração do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].name).toBe(oldSong.name);
    expect(songs[0].year).toBe(oldSong.year)
    expect(songs[0].duration).toBe(TimeConverter.timeToMilliseconds(song.duration as string))

  });

   it("success case: deve atualizar todos os dados do song com o id especificado", async () => {
      const song: UpdateSong = {
        id: 1,
        duration: "00:03:00",
        name: "teste UPDATE",
        year: 2001
      }
      
      const oldSong = {...songs[0]}

        await service.update(song);
    console.log(
      `deve atualizar a duração do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].name).toBe(song.name);
    expect(songs[0].year).toBe(song.year)
    expect(songs[0].duration).toBe(TimeConverter.timeToMilliseconds(song.duration as string))

  });

    it("error case: deve dar erro por receber um song sem propriedades", async () => {
      try {
        await service.update({id: 1} as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um song sem propriedades\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual(
          '"value" must contain at least one of [name, year, duration, albums]'
        );
      }
    });
  
    it("error case: deve dar erro por receber um song com propriedade inválida", async () => {
      try {
        await service.update({ id: 1, name: "teste Update", invalidField: "true!" } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um song com propriedade inválida\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"invalidField" is not allowed');
      }
    });
  
    it("error case: deve dar erro por receber um song com nome como number", async () => {
      try {
        await service.update({id: 1, name: 1} as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um song com nome como number\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"name" must be a string');
      }
    });

    
  
    it("error case: deve dar erro por receber um song com ano como string", async () => {
      try {
        await service.update({
          id: 1,
          year: "2000a",
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um song com ano como string\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"year" must be a number');
      }
    });
  
    it("error case: deve dar erro por receber um song com duração inválida", async () => {
      try {
        await service.update({
          id: 1,
          duration: "invalid"
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um song duração inválida\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual("O campo deve estar no formato HH:MM:SS");
      }
    });
  
    it("error case: deve dar erro por receber ano maior que ano atual", async () => {
      try {
        await service.update({
          id: 1,
          year: 2026
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              ddeve dar erro por receber ano maior que ano atual\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"year" must be less than or equal to 2025');
      }
    });

    it("error case: deve dar erro por receber id sem ser number", async () => {
      try {
        await service.update({
          id: "a1",
          year: 2025
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber id sem ser number\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"id" must be a number');
      }
    });
});
