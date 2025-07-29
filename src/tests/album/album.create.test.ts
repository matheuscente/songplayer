import AlbumService from "../../services/album.service";
import {
  IAlbumRepository,
  IClientAlbum,
  IDatabaseAlbum
} from "../../models/album.model";
import { ValidationError } from "../../errors/validation.error";
import { IArtistService } from "../../models/artist.model";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método create do service de album", () => {
  let service: AlbumService;
  let mockRepository: jest.Mocked<IAlbumRepository>;
  let albums: IDatabaseAlbum[];
  let album: IClientAlbum;
      const artistService: jest.Mocked<IArtistService> = {
      setDependencies: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };


  beforeEach(() => {
    album = {
      albumTitle: "teste3",
      albumYear: 2000,
      artistId: 1,
    };

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
    mockRepository.create.mockImplementation((item: IClientAlbum) => {
      const newItem: IDatabaseAlbum = {
        albumId: 3,
        ...item,
      };
      albums.push(newItem);
      return newItem.albumId;
    });

    //instância de service com repositório mockado
    service = new AlbumService(mockRepository);
    service.setDependencies(artistService)

  });

  afterEach(() => {
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
    ]
  })

  it("success case: deve criar um album e receber o indice do albuma criado", () => {

    artistService.getById.mockReturnValue({
      artistId: 3,
      artistName: "teste",
      artistNationality: "teste",
    });
    const data = service.create(album);
    console.log(
      `deve criar um album e receber o indice do albuma criado: 3\n
            dados passados para criação: ${JSON.stringify(album)}
            dados no banco: ${JSON.stringify(albums[2])}
            indice retornado: ${data}
            `
    );
    expect(data).toBe(3);
    expect({ albumId: 3, ...album }).toEqual(albums[2]);
  });

  it("error case: deve dar erro por receber um album sem titulo", () => {
    try {
      const albumWithOutTitle = {
        albumYear: 2000,
        artistId: 1,
      };
      service.create(albumWithOutTitle as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um album sem titulo\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"albumTitle" is required');
    }
  });

  it("error case: deve dar erro por receber um album sem artistId", () => {
    try {
      const albumWithOutTitle = {
        albumTitle: "teste",
        albumYear: 2000,
      };
      service.create(albumWithOutTitle as any);
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um album sem artistId\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"artistId" is required');
    }
  });

  it("error case: deve dar erro por receber um album sem propriedades", () => {
    try {
      service.create({} as any);
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
        '"albumTitle" is required, "albumYear" is required, "artistId" is required'
      );
    }
  });

  it("error case: deve dar erro por receber um albuma com propriedade inválida", () => {
    try {
      service.create({ ...album, invalidField: "true!" } as any);
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
      service.create({ albumTitle: 2, albumYear: 2000, artistId: 1 } as any);
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
      service.create({
        albumTitle: "teste3",
        albumYear: 2000,
        artistId: "string",
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
      service.create({
        albumTitle: "teste3",
        albumYear: "2000a",
        artistId: 1,
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

      service.create({
        albumTitle: "teste3",
        albumYear: 2000,
        artistId: 3,
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

      service.create({
        albumTitle: "teste3",
        albumYear: 2026,
        artistId: 1,
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
