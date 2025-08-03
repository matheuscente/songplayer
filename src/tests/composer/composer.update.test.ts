import ComposerService from "../../services/composer.service";
import { IComposerRepository, IDatabaseComposer, UpdateComposer } from "../../models/composer.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe('testes unitários do método update do service de composer', () => {
    let service: ComposerService
    let mockRepository: jest.Mocked<IComposerRepository>
    let composers: IDatabaseComposer[]
    let composer: UpdateComposer

    beforeEach(() => {
         composer = {
            id: 3,
            name: 'teste UPDATE'
        }

        composers = [
            {
            id: 1,
            name: 'teste'
        },
        {
            id: 2,
            name: 'teste2'
        },
        {
            id: 3,
            name: 'teste3'
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

        //comportamento do mock
        mockRepository.update.mockImplementation(async (item: IDatabaseComposer | UpdateComposer) => {
            composers.forEach(composer => {
                if(item.id === composer.id) {
                    composer.name = (item as IDatabaseComposer).name
                }
            })
        })

        mockRepository.getById.mockImplementation(async (id: number) => {
            const composer = composers.find(composer => composer.id === id)

            if(!composer) return undefined

            return composer
        })


        //instância de service com repositório mockado
        service = new ComposerService(mockRepository)
    })

    afterEach(async () => {
        composers[2].name = 'teste 3';
    })

    it('sucess case: deve atualizar um composer de acordo com o id', async () => {
        
        const oldcomposer: IDatabaseComposer = {...composers[2]}
        await service.update(composer)
        console.log(
            `deve atualizar um composer de acordo com id\n
            dados passados para atualização: ${JSON.stringify(composer)},
            dados no banco antes da atualização: ${JSON.stringify(oldcomposer)}
            dados no banco depois da atualização: ${JSON.stringify(composers[2])}
            `
            
        )
        expect(composers[2]).toEqual(composer)
    })

    it('error case: deve dar erro pois é necessário no mínimo 1 campo para atualização', async () => {
        delete composer.name
        try{
            await service.update(composer as any)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois é necessário no mínimo 1 campo para atualização\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"name" is required')
        }
        
    })

    it('error case: deve dar erro pois não existe composer no id informado', async () => {
       composer.id = 4

        try{
            await service.update(composer)
            throw new Error('Era esperado que lançasse NotFoundError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois não existe composer no id informado\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(NotFoundError)
            expect((err as NotFoundError).message).toEqual('compositor não encontrado')


        }
        
    })

    it('error case: deve dar erro pois id não é um número', async () => {
       composer.id = ('4a' as any)

        try{
            await service.update(composer)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois id não é um número\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"id" must be a number')

        }
        
    })

     it('error case: deve dar erro pois name não é uma string', async () => {
       composer.name = (123 as any)

        try{
            await service.update(composer)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois name não é uma string\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"name" must be a string')

        }
        
    })

    
})

