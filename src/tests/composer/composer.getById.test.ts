import ComposerService from "../../services/composer.service";
import { IComposerRepository, IDatabaseComposer } from "../../models/composer.model";
import { ValidationError } from "../../errors/validation.error";

describe('testes unitários do método getById do service de composer', () => {
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

        //configuração do mock
        mockRepository.getById.mockImplementation((id) => {
            return composers.find((composer) => {
                return composer.composerId === id
            })
        })


        //instância de service com repositório mockado
        service = new ComposerService(mockRepository)
    })

    it('success case: deve retornar o composer de acordo com o id', () => {
        const composer = composers[0]
        const data = service.getById(1)
        console.log(
            `deve retornar o composera de acordo com o id\n
            dados repository: ${JSON.stringify(composer)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(composer)
    })

    it('error case: deve retornar undefined pois nao existe item no banco', () => {
        
        const data = service.getById(3)
        console.log(
            `
            error case: deve retornar undefined pois nao existe item no banco\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toBe(undefined)
    })

        it('error case: erro caso o id passado nao seja um número', () => {
            try{
                service.getById('a2' as any);
                throw new Error('Era esperado que lançasse ValidationError, mas não lançou');            }catch(err) {
                console.log('error case: erro caso o id passado nao seja um número\n', `dados retornados ${(err as Error).message}`);
                expect(err).toBeInstanceOf(ValidationError);
                expect((err as Error).message).toEqual('"id" must be a number')
            }
        
    })

})

