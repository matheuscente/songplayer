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
            composerName: 'teste3'
        }

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

        //comportamento do mock
        mockRepository.create.mockImplementation((item: IClientComposer) => {
            const newItem: IDatabaseComposer = {
                composerId: 3,
                ...item
            }
            composers.push(newItem)
            return newItem.composerId
        })


        //instância de service com repositório mockado
        service = new ComposerService(mockRepository)
    })

    it('success case: deve criar um composer e receber o indice do composer criado', () => {
        const data = service.create(composer)
        console.log(
            `deve criar um composer e receber o indice do composer criado\n
            dados passados para criação: ${JSON.stringify(composer)}
            dados no banco: ${JSON.stringify(composers[2])}
            `
            
        )
        expect(data).toBe(3)
        expect({composerId: 3, ...composer}).toEqual(composers[2])
    })

    it('error case: deve dar erro por receber um composer sem propriedades', () => {
        try {
            service.create({} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um composer sem propriedades\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"composerName" is required')
        }
        
    })

    it('error case: deve dar erro por receber um composer com propriedade inválida', () => {
        try {
            service.create({...composer, invalidField: 'true!'} as any)
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

    it('error case: deve dar erro por receber um composer com nome como number', () => {
        try {
            service.create({composerName: 2} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um composer com nome como number\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"composerName" must be a string')
        }
        
    })

})

