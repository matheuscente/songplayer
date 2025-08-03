import AlbumService from "../../services/album.service";
import database from "../../prismaUtils/client"

import {
  IAlbumRepository,
  IDatabaseAlbum,
  UpdateAlbum,
} from "../../models/album.model";
//import { ValidationError } from "../../errors/validation.error";
import { IArtistService } from "../../models/artist.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";
//import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método update do service de album", () => {
  let service: AlbumService;
  let mockRepository: jest.Mocked<IAlbumRepository>;
  let albums: IDatabaseAlbum[];
  const artistService: jest.Mocked<IArtistService> = {
    setDependencies: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(() => {
    albums = [
      {
        id: 1,
        title: "teste",
        year: 2000,
        artist_id: 1,
      },
      {
        id: 2,
        title: "teste2",
        year: 2000,
        artist_id: 2,
      },
    ];

    //mockando repository
    mockRepository = {
      getByArtistId: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    //comportamento do mock
    mockRepository.update.mockImplementation(async (item: UpdateAlbum) => {
      albums.forEach((album, index) => {
        if (album.id === item.id) {
          albums[index] = item as IDatabaseAlbum;
        }
      });
    });

    mockRepository.getById.mockImplementation(async (id) => {
      return albums.find((album) => album.id === id);
    });

    //instância de service com repositório mockado
    service = new AlbumService(mockRepository, database);
    service.setDependencies(artistService);
  });

  beforeEach(() => {
    albums = [
      {
        id: 1,
        title: "teste",
        year: 2000,
        artist_id: 1,
      },
      {
        id: 2,
        title: "teste2",
        year: 2000,
        artist_id: 2,
      },
    ];
  });

  it("success case: deve atualizar o nome do album de acordo com o id", async () => {
    artistService.getById.mockResolvedValue({
      id: 1,
      name: "teste",
      nationality: "teste",
    });

    const oldBd = albums[0];
    await service.update({ id: 1, title: "UPDATE teste" });
    console.log(
      `deve atualizar o nome do album de acordo com o id: 1\n
        dados passados para autualização: ${JSON.stringify({
          id: 1,
          title: "UPDATE teste",
        })}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].title).toBe("UPDATE teste");
    expect(albums[0].id).toBe(oldBd.id);
    expect(albums[0].year).toBe(oldBd.year);
    expect(albums[0].artist_id).toBe(oldBd.artist_id);
  });

  it("success case: deve atualizar o ano do album de acordo com o id", async () => {
    artistService.getById.mockResolvedValue({
      id: 1,
      name: "teste",
      nationality: "teste",
    });

    const albumUpdate: UpdateAlbum = { id: 1, year: 2001 };
    const oldBd = albums[0];
    await await service.update(albumUpdate);
    console.log(
      `deve atualizar o ano do album de acordo com o id: 1\n
        dados passados para autualização: ${JSON.stringify(albumUpdate)}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].year).toBe(albumUpdate.year);
    expect(albums[0].id).toBe(oldBd.id);
    expect(albums[0].title).toBe(oldBd.title);
    expect(albums[0].artist_id).toBe(oldBd.artist_id);
  });

  it("success case: deve atualizar o artist_id do album de acordo com o id", async () => {
    artistService.getById.mockResolvedValue({
      id: 2,
      name: "teste",
      nationality: "teste",
    });

    const albumUpdate: UpdateAlbum = { id: 1, artist_id: 2 };
    const oldBd = albums[0];
    await service.update(albumUpdate);
    console.log(
      `deve atualizar o artist_id do album de acordo com o id: 1\n
        dados passados para autualização: ${JSON.stringify(albumUpdate)}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].artist_id).toBe(2);
    expect(albums[0].id).toBe(oldBd.id);
    expect(albums[0].title).toBe(oldBd.title);
    expect(albums[0].year).toBe(oldBd.year);
  });

  it("success case: deve atualizar todos os dados do album de acordo com o id", async () => {
    artistService.getById.mockResolvedValue({
      id: 2,
      name: "teste",
      nationality: "teste",
    });

    const albumUpdate: UpdateAlbum = {
      id: 1,
      artist_id: 2,
      title: "teste UPDATE",
      year: 2001,
    };
    const oldBd = albums[0];
    await service.update(albumUpdate);
    console.log(
      `deve atualizar todos os dados do album de acordo com o id: 1\n
        dados passados para autualização: ${JSON.stringify(albumUpdate)}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].artist_id).toBe(albumUpdate.artist_id);
    expect(albums[0].id).toBe(albumUpdate.id);
    expect(albums[0].title).toBe(albumUpdate.title);
    expect(albums[0].year).toBe(albumUpdate.year);
  });

  it("error case: deve dar erro por receber um album sem propriedades", async () => {
    try {
      await service.update({ id: 1 });
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um album sem propriedades\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual(
        '"value" must contain at least one of [title, year, artist_id]'
      );
    }
  });


    it("error case: deve dar erro por receber um albuma com propriedade inválida", async () => {
      try {
        await service.update({ id: 1, title: 'teste UPDATE', invalidField: "true!" } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um album com propriedade inválida\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"invalidField" is not allowed');
      }
    });
  
    it("error case: deve dar erro por receber um album com titulo como number", async () => {
      try {
        await service.update({ title: 2, year: 2000, artist_id: 1, id: 1 } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um album com titulo como number\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"title" must be a string');
      }
    });
  
    it("error case: deve dar erro por receber um album com artist_id como string", async () => {
      try {
        await service.update({
          title: "teste3",
          year: 2000,
          artist_id: "string",
          id: 1
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um album com artist_id como string\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"artist_id" must be a number');
      }
    });
  
    it("error case: deve dar erro por receber um album com ano como string", async () => {
      try {
        await service.update({
          title: "teste3",
          year: "2000a",
          artist_id: 1,
          id: 1
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um album com ano como string\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"year" must be a number');
      }
    });
  
    it("error case: deve dar erro por receber um album com artista não existente", async () => {
      try {
  
  
        artistService.getById.mockResolvedValue(undefined);
  
        await service.update({
          title: "teste3",
          year: 2000,
          artist_id: 3,
          id: 1

        } as any);
        throw new Error(
          "Era esperado que lançasse NotFoundError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um album com artista não existente\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(NotFoundError);
        expect((err as Error).message).toEqual("artista não encontrado");
      }
    });
  
    it("error case: deve dar erro por receber ano maior que ano atual", async () => {
      try {
  
  
        artistService.getById.mockResolvedValue({id: 1, name: "teste", nationality: "teste"});
  
        await service.update({
          title: "teste3",
          year: 2026,
          artist_id: 1,
          id: 1
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
});
