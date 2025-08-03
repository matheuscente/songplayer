import ArtistService from "../../services/artist.service";
import { IArtistRepository, IClientArtist, IDatabaseArtist } from "../../models/artist.model";
import { ValidationError } from "../../errors/validation.error";


describe('testes unitários do método create do service de artist', () => {
    let service: ArtistService
    let mockRepository: jest.Mocked<IArtistRepository>
    let artists: IDatabaseArtist[]
    let artist: IClientArtist

    beforeAll( () => {
        artist = {
            name: 'teste3',
            nationality: 'teste3'
        }

        artists = [
            {
            id: 1,
            name: 'teste',
            nationality: 'teste'
        },
        {
            id: 2,
            name: 'teste2',
            nationality: 'teste2'
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
        mockRepository.create.mockImplementation(async (item: IClientArtist) => {
            const newItem: IDatabaseArtist = {
                id: 3,
                ...item
            }
            artists.push(newItem)
            return newItem.id
        })


        //instância de service com repositório mockado
        service = new ArtistService(mockRepository)
    })

    it('success case: deve criar um artista e receber o indice do artista criado', async () => {
        const data = await service.create(artist)
        console.log(
            `deve criar um artista e receber o indice do artista criado\n
            dados passados para criação: ${JSON.stringify(artist)}
            dados no banco: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(data).toBe(3)
        expect({id: 3, ...artist}).toEqual(artists[2])
    })

    it('error case: deve dar erro por receber um artista sem nome', async () => {
        try {
            await service.create({nationality: 'teste'} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista sem nome\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"name" is required')
        
        }
        
    })

    it('error case: deve dar erro por receber um artista sem nacionalidade', async () => {
        try {
            await service.create({name: 'teste'} as any)
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista sem nacionalidade\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"nationality" is required')
        
        }
        
    })

    it('error case: deve dar erro por receber um artista sem propriedades', async () => {
        try {
            await service.create({} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista sem propriedades\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"name" is required, "nationality" is required')
        }
        
    })

    it('error case: deve dar erro por receber um artista com propriedade inválida', async () => {
        try {
            await service.create({...artist, invalidField: 'true!'} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista com propriedade inválida\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"invalidField" is not allowed')
        }
        
    })

    it('error case: deve dar erro por receber um artista com nome como number', async () => {
        try {
            await service.create({name: 2, nationality: 'teste3'} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista com nome como number\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"name" must be a string')
        }
        
    })

    it('error case: deve dar erro por receber um artista com nacionalidade como number', async () => {
        try {
            await service.create({name: 'teste3', nationality: 1} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista com nacionalidade como number\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"nationality" must be a string')
        }
        
    })

})

