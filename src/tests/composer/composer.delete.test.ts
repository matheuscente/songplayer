import ComposerService from "../../services/composer.service";
import { IComposerRepository, IDatabaseComposer } from "../../models/composer.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe("testes unitários do método delete do service de composer", () => {
  let service: ComposerService;
  let mockRepository: jest.Mocked<IComposerRepository>;
  let composers: IDatabaseComposer[];
  beforeEach(() => {
    composers = [
      {
        id: 1,
        name: "teste"
      },
      {
        id: 2,
        name: "teste2"
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

    

    //instância de service com repositório mockado
    service = new ComposerService(mockRepository);

    //comportamento do mock repository
    mockRepository.getById.mockImplementation(async (id: number) => {
      const composer = composers.find((composer) => composer.id === id);

      if (!composer) return undefined;

      return composer;
    });

    mockRepository.delete.mockImplementation(async (id: number) => {
      const index = composers.findIndex((composer) => composer.id === id);
      composers.splice(index, 1);
    });
  });

  afterEach(async () => {
    composers = [
      {
        id: 1,
        name: "teste"
      },
      {
        id: 2,
        name: "teste2"
      },
    ];
  });

  it("success: deve deletar um composer de acordo com o id", async () => {
    const oldRepo = [...composers];
    await service.delete(1);

    console.log(`
            deve deletar um composer de acordo com o id
            id: 1
            dados repository: ${JSON.stringify(oldRepo)}
            dados após a deleção: ${JSON.stringify(composers)}
            `);

    expect(composers.length).toBe(1);
    expect(composers).toEqual([
      {
        id: 2,
        name: "teste2"
      },
    ]);
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

  it("error case: deve dar erro caso composer não exista", async () => {
    try {
      await service.delete(3);
    } catch (err) {
      console.log(
        `error case: deve dar erro caso composer não exista\n
            retorno: ${err}
            `
      );
      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toBe(
        `compositor não encontrado`
      );
    }
  });
});
