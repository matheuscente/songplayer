import AlbumService from "../../services/album.service";
import { IAlbumRepository, IDatabaseAlbum } from "../../models/album.model";
import { ValidationError } from "../../errors/validation.error";


describe("testes unitários do método getById do service de album", () => {
  let service: AlbumService;
  let mockRepository: jest.Mocked<IAlbumRepository>;
  let albums: IDatabaseAlbum[];

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

    //configuração do mock
    mockRepository.getById.mockImplementation(async (id) => {
      return albums.find((album) => {
        return album.id === id;
      });
    });

    //instância de service com repositório mockado
    service = new AlbumService(mockRepository);
  });

  it("success case: deve retornar o album de acordo com o id", async () => {
    const album = albums[0];
    const data = await service.getById(1);
    console.log(
      `deve retornar o album de acordo com o id\n
            dados repository: ${JSON.stringify(album)}\n
            dados retornados: ${JSON.stringify(data)}
            `
    );
    expect(data).toEqual(album);
  });

  it("error case: deve retornar undefined pois nao existe item no banco", async () => {
    const data = await service.getById(3);
    console.log(
      `
            error case: deve retornar undefined pois nao existe item no banco\n
            dados retornados: ${JSON.stringify(data)}
            `
    );
    expect(data).toBe(undefined);
  });

  it("error case: erro caso o id passado nao seja um número", async () => {
    try {
      await service.getById("a2" as any);
      throw new Error(
        "Era esperado que lançasse ValidationError, mas não lançou"
      );
    } catch (err) {
      console.log(
        "error case: erro caso o id passado nao seja um número\n",
        `dados retornados ${(err as Error).message}`
      );
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as Error).message).toEqual('"id" must be a number');
    }
  });
});
