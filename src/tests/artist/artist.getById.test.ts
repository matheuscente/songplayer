import ArtistService from "../../services/artist.service";
import { IArtistRepository, IDatabaseArtist } from "../../models/artist.model";
import { ValidationError } from "../../errors/validation.error";

describe("testes unitários do método getById do service de artist", () => {
  let service: ArtistService;
  let mockRepository: jest.Mocked<IArtistRepository>;
  let artists: IDatabaseArtist[];

  beforeAll(() => {
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

    //configuração do mock
    mockRepository.getById.mockImplementation(async (id) => {
      return artists.find((artist) => {
        return artist.id === id;
      });
    });

    //instância de service com repositório mockado
    service = new ArtistService(mockRepository);
  });

  it("success case: deve retornar o artista de acordo com o id", async () => {
    const artist = artists[0];
    const data = await service.getById(1);
    console.log(
      `deve retornar o artista de acordo com o id\n
            dados repository: ${JSON.stringify(artist)}\n
            dados retornados: ${JSON.stringify(data)}
            `
    );
    expect(data).toEqual(artist);
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
