import ComposerService from "../../services/composer.service";
import { IComposerRepository, IDatabaseComposer } from "../../models/composer.model";


describe('testes unitários do método getAll do service de composer', () => {
    let service: ComposerService
    let mockRepository: jest.Mocked<IComposerRepository>
    let composers: IDatabaseComposer[]

    beforeAll(() => {
        composers = [
            {
            composerId: 1,
            composerName: 'teste'
        },
        {
            composerId: 2,
            composerName: 'teste2'
        }
    ];

        //mockando repository
        mockRepository = {
            getById: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }


        //instância de service com repositório mockado
        service = new ComposerService(mockRepository)
    })

    it('success case: deve retornar o todos os Composeras', () => {
        mockRepository.getAll.mockReturnValue(composers)
        const data = service.getAll()
        console.log(
            `deve retornar todos os Composeras\n
            dados repository: ${JSON.stringify(composers)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(composers)
    })

    it('success case: deve retornar array vazio pois nao existe item no banco', () => {
        mockRepository.getAll.mockReturnValue([])
        const data = service.getAll()
        console.log(
            `
            deve retornar array vazio pois nao existe item no banco\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data.length).toBe(0)
    })

})

