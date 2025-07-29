import AlbumService from "../../services/album.service";
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
        albumId: 1,
        albumTitle: "teste",
        albumYear: 2000,
        artistId: 1,
      },
      {
        albumId: 2,
        albumTitle: "teste2",
        albumYear: 2000,
        artistId: 2,
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
    mockRepository.update.mockImplementation((item: UpdateAlbum) => {
      albums.forEach((album, index) => {
        if (album.albumId === item.albumId) {
          albums[index] = item as IDatabaseAlbum;
        }
      });
    });

    mockRepository.getById.mockImplementation((id) => {
      return albums.find((album) => album.albumId === id);
    });

    //instância de service com repositório mockado
    service = new AlbumService(mockRepository);
    service.setDependencies(artistService);
  });

  beforeEach(() => {
    albums = [
      {
        albumId: 1,
        albumTitle: "teste",
        albumYear: 2000,
        artistId: 1,
      },
      {
        albumId: 2,
        albumTitle: "teste2",
        albumYear: 2000,
        artistId: 2,
      },
    ];
  });

  it("success case: deve atualizar o nome do album de acordo com o albumId", () => {
    artistService.getById.mockReturnValue({
      artistId: 1,
      artistName: "teste",
      artistNationality: "teste",
    });

    const oldBd = albums[0];
    service.update({ albumId: 1, albumTitle: "UPDATE teste" });
    console.log(
      `deve atualizar o nome do album de acordo com o albumId: 1\n
        dados passados para autualização: ${JSON.stringify({
          albumId: 1,
          albumTitle: "UPDATE teste",
        })}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].albumTitle).toBe("UPDATE teste");
    expect(albums[0].albumId).toBe(oldBd.albumId);
    expect(albums[0].albumYear).toBe(oldBd.albumYear);
    expect(albums[0].artistId).toBe(oldBd.artistId);
  });

  it("success case: deve atualizar o ano do album de acordo com o albumId", () => {
    artistService.getById.mockReturnValue({
      artistId: 1,
      artistName: "teste",
      artistNationality: "teste",
    });

    const albumUpdate: UpdateAlbum = { albumId: 1, albumYear: 2001 };
    const oldBd = albums[0];
    service.update(albumUpdate);
    console.log(
      `deve atualizar o ano do album de acordo com o albumId: 1\n
        dados passados para autualização: ${JSON.stringify(albumUpdate)}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].albumYear).toBe(albumUpdate.albumYear);
    expect(albums[0].albumId).toBe(oldBd.albumId);
    expect(albums[0].albumTitle).toBe(oldBd.albumTitle);
    expect(albums[0].artistId).toBe(oldBd.artistId);
  });

  it("success case: deve atualizar o artistId do album de acordo com o albumId", () => {
    artistService.getById.mockReturnValue({
      artistId: 2,
      artistName: "teste",
      artistNationality: "teste",
    });

    const albumUpdate: UpdateAlbum = { albumId: 1, artistId: 2 };
    const oldBd = albums[0];
    service.update(albumUpdate);
    console.log(
      `deve atualizar o artistId do album de acordo com o albumId: 1\n
        dados passados para autualização: ${JSON.stringify(albumUpdate)}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].artistId).toBe(2);
    expect(albums[0].albumId).toBe(oldBd.albumId);
    expect(albums[0].albumTitle).toBe(oldBd.albumTitle);
    expect(albums[0].albumYear).toBe(oldBd.albumYear);
  });

  it("success case: deve atualizar todos os dados do album de acordo com o albumId", () => {
    artistService.getById.mockReturnValue({
      artistId: 2,
      artistName: "teste",
      artistNationality: "teste",
    });

    const albumUpdate: UpdateAlbum = {
      albumId: 1,
      artistId: 2,
      albumTitle: "teste UPDATE",
      albumYear: 2001,
    };
    const oldBd = albums[0];
    service.update(albumUpdate);
    console.log(
      `deve atualizar todos os dados do album de acordo com o albumId: 1\n
        dados passados para autualização: ${JSON.stringify(albumUpdate)}
        dados no banco: ${JSON.stringify(oldBd)}
        dados no banco após a atualização ${JSON.stringify(albums[0])}
    `
    );
    expect(albums[0].artistId).toBe(albumUpdate.artistId);
    expect(albums[0].albumId).toBe(albumUpdate.albumId);
    expect(albums[0].albumTitle).toBe(albumUpdate.albumTitle);
    expect(albums[0].albumYear).toBe(albumUpdate.albumYear);
  });

  it("error case: deve dar erro por receber um album sem propriedades", () => {
    try {
      service.update({ albumId: 1 });
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
        '"value" must contain at least one of [albumTitle, albumYear, artistId]'
      );
    }
  });


    it("error case: deve dar erro por receber um albuma com propriedade inválida", () => {
      try {
        service.update({ albumId: 1, albumTitle: 'teste UPDATE', invalidField: "true!" } as any);
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
  
    it("error case: deve dar erro por receber um album com titulo como number", () => {
      try {
        service.update({ albumTitle: 2, albumYear: 2000, artistId: 1, albumId: 1 } as any);
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
        expect((err as Error).message).toEqual('"albumTitle" must be a string');
      }
    });
  
    it("error case: deve dar erro por receber um album com artistId como string", () => {
      try {
        service.update({
          albumTitle: "teste3",
          albumYear: 2000,
          artistId: "string",
          albumId: 1
        } as any);
        throw new Error(
          "Era esperado que lançasse ValidationError, mas não lançou"
        );
      } catch (err) {
        console.log(
          `
              deve dar erro por receber um album com artistId como string\n
              dados retornados: ${(err as Error).message}
              `
        );
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as Error).message).toEqual('"artistId" must be a number');
      }
    });
  
    it("error case: deve dar erro por receber um album com ano como string", () => {
      try {
        service.update({
          albumTitle: "teste3",
          albumYear: "2000a",
          artistId: 1,
          albumId: 1
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
        expect((err as Error).message).toEqual('"albumYear" must be a number');
      }
    });
  
    it("error case: deve dar erro por receber um album com artista não existente", () => {
      try {
  
  
        artistService.getById.mockReturnValue(undefined);
  
        service.update({
          albumTitle: "teste3",
          albumYear: 2000,
          artistId: 3,
          albumId: 1

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
  
    it("error case: deve dar erro por receber ano maior que ano atual", () => {
      try {
  
  
        artistService.getById.mockReturnValue({artistId: 1, artistName: "teste", artistNationality: "teste"});
  
        service.update({
          albumTitle: "teste3",
          albumYear: 2026,
          artistId: 1,
          albumId: 1
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
        expect((err as Error).message).toEqual('"albumYear" must be less than or equal to 2025');
      }
    });
});
