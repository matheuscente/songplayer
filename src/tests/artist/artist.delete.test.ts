import ArtistService from "../../services/artist.service";
import { IArtistRepository, IDatabaseArtist } from "../../models/artist.model";
import { IAlbumService } from "../../models/album.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método delete do service de artist", () => {
  let service: ArtistService;
  let mockRepository: jest.Mocked<IArtistRepository>;
  let artists: IDatabaseArtist[];
  let mockAlbumService: jest.Mocked<IAlbumService>;

  beforeEach(() => {
    artists = [
      {
        id: 1,
        name: "teste",
        nationality: "teste",
      },
      {
        id: 2,
        name: "teste2",
        nationality: "teste2",
      },
    ];

    //mockando repository
    mockRepository = {
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    //mockando album service
    mockAlbumService = {
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      setDependencies: jest.fn(),
      getByArtistId: jest.fn(),
    };

    //instância de service com repositório mockado
    service = new ArtistService(mockRepository);
    service.setDependencies(mockAlbumService);

    //comportamento do mock repository
    mockRepository.getById.mockImplementation(async (id: number) => {
      const artist = artists.find((artist) => artist.id === id);

      if (!artist) return undefined;

      return artist;
    });

    mockRepository.delete.mockImplementation(async (id: number) => {
      const index = artists.findIndex((artist) => artist.id === id);
      artists.splice(index, 1);
    });
  });

  afterEach(async () => {
    artists = [
      {
        id: 1,
        name: "teste",
        nationality: "teste",
      },
      {
        id: 2,
        name: "teste2",
        nationality: "teste2",
      },
    ];
  });

  it("success: deve deletar um artista de acordo com o id", async () => {
    const oldRepo = [...artists];
    mockAlbumService.getByArtistId.mockResolvedValue([]);
    await service.delete(1);

    console.log(`
            deve deletar um artista de acordo com o id
            dados repository: ${JSON.stringify(oldRepo)}
            dados após a deleção: ${JSON.stringify(artists)}
            `);

    expect(artists.length).toBe(1);
    expect(artists).toEqual([
      {
        id: 2,
        name: "teste2",
        nationality: "teste2",
      },
    ]);
  });

  it("error case: deve dar erro pois artista tem uma relação", async () => {
    try {
      mockAlbumService.getByArtistId.mockResolvedValue([{
        id: 1,
        title: "teste",
        year: 1,
        artist_id: 1,
        duration: "teste",
      }]);

      await service.delete(1);
    } catch (err) {
      console.log(
        `deve dar erro pois artista tem uma relação\n
            retorno: ${err}
            `
      );
      expect(artists.length).toBe(2);
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        `este artista tem os albums 1, exclua os albums ou mude de artista`
      );
    }
  });

  it("error case: deve dar erro caso id não seja number", async () => {
    try {
      await service.delete('1a' as any);
    } catch (err) {
      console.log(
        `deve dar erro caso id não seja number\n
            retorno: ${err}
            `
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).message).toBe(
        `"id" must be a number`
      );
    }
  });

  it("error case: deve dar erro caso artista não exista", async () => {
    try {
      await service.delete(3);
    } catch (err) {
      console.log(
        `error case: deve dar erro caso artista não exista\n
            retorno: ${err}
            `
      );
      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toBe(
        `artista não encontrado`
      );
    }
  });
});
