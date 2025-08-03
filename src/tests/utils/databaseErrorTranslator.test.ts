import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IArtistRepository, IArtistService } from "../../models/artist.model";
import ArtistService from "../../services/artist.service";

describe('testes unitários databaseErrorTranslator', () => {
    let service: IArtistService
    const repositoryMock: jest.Mocked<IArtistRepository> = {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
        
    }

    beforeAll(() => {
        service = new ArtistService(repositoryMock)
    })


    it('deve retornar erro pois já tem artista com este nome cadastrado no banco', async () => {
       const fakePrismaError: PrismaClientKnownRequestError = {
           code: "P2002",
           message: "Unique constraint failed on the fields: (`name`)",
           meta: { target: ["name"] },
           name: "PrismaClientKnownRequestError",
           clientVersion: "1",
           [Symbol.toStringTag]: ""
       };
        repositoryMock.create.mockRejectedValue(fakePrismaError)

    const data = service.create({name: "teste", nationality: "teste"})

    await expect(data).rejects.toThrow("please send another name")
    })
})