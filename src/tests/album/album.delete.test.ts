import AlbumService from "../../services/album.service";
import { IAlbumRepository, IDatabaseAlbum } from "../../models/album.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método delete do service de album", () => {
  let service: AlbumService;
  let mockRepository: jest.Mocked<IAlbumRepository>;
  let albums: IDatabaseAlbum[];

  beforeEach(() => {
albums = [
            {
            albumId: 1,
            albumTitle: 'teste',
            albumYear: 2000,
            artistId: 1
        },
        {
            albumId: 2,
            albumTitle: 'teste2',
            albumYear: 2000,
            artistId: 2
        }
    ]

    //mockando repository
    mockRepository = {
      getByArtistId: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

   

    //instância de service com repositório mockado
    service = new AlbumService(mockRepository);

    //comportamento do mock repository
    mockRepository.getById.mockImplementation((id: number) => {
      const album = albums.find((album) => album.albumId === id);

      if (!album) return undefined;

      return album;
    });

    mockRepository.delete.mockImplementation((id: number) => {
      const index = albums.findIndex((album) => album.albumId === id);
      albums.splice(index, 1);
    });
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
    ];
  });

  it("success: deve deletar um album de acordo com o id", () => {
    const oldRepo = [...albums];
    service.delete(1);

    console.log(`
            deve deletar um album de acordo com o id
            dados repository: ${JSON.stringify(oldRepo)}
            dados após a deleção: ${JSON.stringify(albums)}
            `);

    expect(albums.length).toBe(1);
    expect(albums).toEqual([
      {
        albumId: 2,
        albumTitle: "teste2",
        albumYear: 2000,
        artistId: 2
      },
    ]);
  });

  it("error case: deve dar erro caso id não seja number", () => {
    try {
      service.delete('1a' as any);
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

  it("error case: deve dar erro caso album não exista", () => {
    try {
      service.delete(3);
    } catch (err) {
      console.log(
        `error case: deve dar erro caso album não exista\n
            retorno: ${err}
            `
      );
      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toBe(
        `album não encontrado`
      );
    }
  });
});
