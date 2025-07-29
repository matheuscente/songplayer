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
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: 15000
        },
        {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: 20000
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
    mockRepository.update.mockImplementation((item: UpdateSong) => {
      songs.forEach(song => {
        if(song.songId === item.songId) {
            song.songName = item.songName ?? song.songName,
            song.songYear = item.songYear ?? song.songYear,
            song.songDuration = item.songDuration ?? song.songDuration
        }
      })
    });

    mockRepository.getById.mockImplementation((id: number) => {
        return songs.find(song => 
            song.songId === id
        )
    })

    //instância de service com repositório mockado
    service = new SongService(mockRepository);
  });

  afterEach(() => {
    songs = [
            {
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: 15000
        },
        {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: 20000
        }
    ];
  })

  it("success case: deve atualizar o ano do song com o id especificado", () => {
      const song: UpdateSong = {
        songId: 1,
        songYear: 2001
      }
      
      const oldSong = {...songs[0]}

        service.update(song);
    console.log(
      `deve atualizar o ano do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].songName).toBe(oldSong.songName);
    expect(songs[0].songYear).toBe(2001)
    expect(songs[0].songDuration).toBe(oldSong.songDuration)

  });

  it("success case: deve atualizar o nome do song com o id especificado", () => {
      const song: UpdateSong = {
        songId: 1,
        songName: "teste UPDATE"
      }
      
      const oldSong = {...songs[0]}

        service.update(song);
    console.log(
      `deve atualizar o nome do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].songName).toBe('teste UPDATE');
    expect(songs[0].songYear).toBe(oldSong.songYear)
    expect(songs[0].songDuration).toBe(oldSong.songDuration)

  });

  it("success case: deve atualizar a duração do song com o id especificado", () => {
      const song: UpdateSong = {
        songId: 1,
        songDuration: "00:03:00"
      }
      
      const oldSong = {...songs[0]}

        service.update(song);
    console.log(
      `deve atualizar a duração do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].songName).toBe(oldSong.songName);
    expect(songs[0].songYear).toBe(oldSong.songYear)
    expect(songs[0].songDuration).toBe(TimeConverter.timeToMilliseconds(song.songDuration as string))

  });

   it("success case: deve atualizar todos os dados do song com o id especificado", () => {
      const song: UpdateSong = {
        songId: 1,
        songDuration: "00:03:00",
        songName: "teste UPDATE",
        songYear: 2001
      }
      
      const oldSong = {...songs[0]}

        service.update(song);
    console.log(
      `deve atualizar a duração do song com o id especificado\n
            dados passados para atualização: ${JSON.stringify(song)}
            dados no banco: ${JSON.stringify(oldSong)}
            dados após atualização: ${JSON.stringify(songs[0])}
            `
    );
    expect(songs[0].songName).toBe(song.songName);
    expect(songs[0].songYear).toBe(song.songYear)
    expect(songs[0].songDuration).toBe(TimeConverter.timeToMilliseconds(song.songDuration as string))

  });

    it("error case: deve dar erro por receber um song sem propriedades", () => {
      try {
        service.update({songId: 1} as any);
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
          '"value" must contain at least one of [songName, songYear, songDuration, albums]'
        );
      }
    });
  
    it("error case: deve dar erro por receber um song com propriedade inválida", () => {
      try {
        service.update({ songId: 1, songName: "teste Update", invalidField: "true!" } as any);
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
  
    it("error case: deve dar erro por receber um song com nome como number", () => {
      try {
        service.update({songId: 1, songName: 1} as any);
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
        expect((err as Error).message).toEqual('"songName" must be a string');
      }
    });

    
  
    it("error case: deve dar erro por receber um song com ano como string", () => {
      try {
        service.update({
          songId: 1,
          songYear: "2000a",
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
        expect((err as Error).message).toEqual('"songYear" must be a number');
      }
    });
  
    it("error case: deve dar erro por receber um song com duração inválida", () => {
      try {
        service.update({
          songId: 1,
          songDuration: "invalid"
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
  
    it("error case: deve dar erro por receber ano maior que ano atual", () => {
      try {
        service.update({
          songId: 1,
          songYear: 2026
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
        expect((err as Error).message).toEqual('"songYear" must be less than or equal to 2025');
      }
    });

    it("error case: deve dar erro por receber id sem ser number", () => {
      try {
        service.update({
          songId: "a1",
          songYear: 2025
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
        expect((err as Error).message).toEqual('"songId" must be a number');
      }
    });
});
