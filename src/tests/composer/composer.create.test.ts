import ComposerService from "../../services/composer.service";
import { IComposerRepository, IClientComposer, IDatabaseComposer } from "../../models/composer.model";
import { ValidationError } from "../../errors/validation.error";


describe('testes unitários do método create do service de composer', () => {
    let service: ComposerService
    let mockRepository: jest.Mocked<IComposerRepository>
    let composers: IDatabaseComposer[]
    let composer: IClientComposer

    beforeAll(() => {
        composer = {
            name: 'teste3'
        }

        composers = [
            {
            id: 1,
            name: 'teste'
        },
        {
            id: 2,
            name: 'teste2'
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
        mockRepository.create.mockImplementation(async (item: IClientComposer) => {
            const newItem: IDatabaseComposer = {
                id: 3,
                ...item
            }
            composers.push(newItem)
            return newItem.id
        })


        //instância de service com repositório mockado
        service = new ComposerService(mockRepository)
    })

    it('success case: deve criar um composer e receber o indice do composer criado', async () => {
        const data = await service.create(composer)
        console.log(
            `deve criar um composer e receber o indice do composer criado\n
            dados passados para criação: ${JSON.stringify(composer)}
            dados no banco: ${JSON.stringify(composers[2])}
            `
            
        )
        expect(data).toBe(3)
        expect({id: 3, ...composer}).toEqual(composers[2])
    })

    it('error case: deve dar erro por receber um composer sem propriedades', async () => {
        try {
            await service.create({} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um composer sem propriedades\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"name" is required')
        }
        
    })

    it('error case: deve dar erro por receber um composer com propriedade inválida', async () => {
        try {
            await service.create({...composer, invalidField: 'true!'} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um composer com propriedade inválida\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"invalidField" is not allowed')
        }
        
    })

    it('error case: deve dar erro por receber um composer com nome como number', async () => {
        try {
            await service.create({name: 2} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um composer com nome como number\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"name" must be a string')
        }
        
    })

})

