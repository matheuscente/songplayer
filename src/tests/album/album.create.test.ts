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
      title: "teste3",
      year: 2000,
      artist_id: 1,
    };

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
    mockRepository.create.mockImplementation(async (item: IClientAlbum) => {
      const newItem: IDatabaseAlbum = {
        id: 3,
        ...item,
      };
      albums.push(newItem);
      return newItem.id;
    });

    //instância de service com repositório mockado
    service = new AlbumService(mockRepository);
    service.setDependencies(artistService)

  });

  afterEach(() => {
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
    ]
  })

  it("success case: deve criar um album e receber o indice do albuma criado", async () => {

    artistService.getById.mockResolvedValue({
      id: 3,
      name: "teste",
      nationality: "teste",
    });
    const data = await service.create(album);
    console.log(
      `deve criar um album e receber o indice do albuma criado: 3\n
            dados passados para criação: ${JSON.stringify(album)}
            dados no banco: ${JSON.stringify(albums[2])}
            indice retornado: ${data}
            `
    );
    expect(data).toBe(3);
    expect({ id: 3, ...album }).toEqual(albums[2]);
  });

  it("error case: deve dar erro por receber um album sem titulo", async () => {
    try {
      const albumWithOutTitle = {
        year: 2000,
        artist_id: 1,
      };
      await service.create(albumWithOutTitle as any);
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
      expect((err as Error).message).toEqual('"title" is required');
    }
  });

  it("error case: deve dar erro por receber um album sem artist_id", async () => {
    try {
      const albumWithOutTitle = {
        title: "teste",
        year: 2000,
      };
      await service.create(albumWithOutTitle as any);
    } catch (err) {
      console.log(
        `
            deve dar erro por receber um album sem artist_id\n
            dados retornados: ${(err as Error).message}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"artist_id" is required');
    }
  });

  it("error case: deve dar erro por receber um album sem propriedades", async () => {
    try {
      await service.create({} as any);
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
        '"title" is required, "year" is required, "artist_id" is required'
      );
    }
  });

  it("error case: deve dar erro por receber um albuma com propriedade inválida", async () => {
    try {
      await service.create({ ...album, invalidField: "true!" } as any);
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
      await service.create({ title: 2, year: 2000, artist_id: 1 } as any);
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
      await service.create({
        title: "teste3",
        year: 2000,
        artist_id: "string",
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
      await service.create({
        title: "teste3",
        year: "2000a",
        artist_id: 1,
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

      await service.create({
        title: "teste3",
        year: 2000,
        artist_id: 3,
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

      await service.create({
        title: "teste3",
        year: 2026,
        artist_id: 1,
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
