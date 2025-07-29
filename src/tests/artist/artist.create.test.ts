import ArtistService from "../../services/artist.service";
import { IArtistRepository, IClientArtist, IDatabaseArtist } from "../../models/artist.model";
import { ValidationError } from "../../errors/validation.error";


describe('testes unitários do método create do service de artist', () => {
    let service: ArtistService
    let mockRepository: jest.Mocked<IArtistRepository>
    let artists: IDatabaseArtist[]
    let artist: IClientArtist

    beforeAll(() => {
        artist = {
            artistName: 'teste3',
            artistNationality: 'teste3'
        }

        artists = [
            {
            artistId: 1,
            artistName: 'teste',
            artistNationality: 'teste'
        },
        {
            artistId: 2,
            artistName: 'teste2',
            artistNationality: 'teste2'
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
        mockRepository.create.mockImplementation((item: IClientArtist) => {
            const newItem: IDatabaseArtist = {
                artistId: 3,
                ...item
            }
            artists.push(newItem)
            return newItem.artistId
        })


        //instância de service com repositório mockado
        service = new ArtistService(mockRepository)
    })

    it('success case: deve criar um artista e receber o indice do artista criado', () => {
        const data = service.create(artist)
        console.log(
            `deve criar um artista e receber o indice do artista criado\n
            dados passados para criação: ${JSON.stringify(artist)}
            dados no banco: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(data).toBe(3)
        expect({artistId: 3, ...artist}).toEqual(artists[2])
    })

    it('error case: deve dar erro por receber um artista sem nome', () => {
        try {
            service.create({artistNationality: 'teste'} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista sem nome\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"artistName" is required')
        
        }
        
    })

    it('error case: deve dar erro por receber um artista sem nacionalidade', () => {
        try {
            service.create({artistName: 'teste'} as any)
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista sem nacionalidade\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"artistNationality" is required')
        
        }
        
    })

    it('error case: deve dar erro por receber um artista sem propriedades', () => {
        try {
            service.create({} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista sem propriedades\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"artistName" is required, "artistNationality" is required')
        }
        
    })

    it('error case: deve dar erro por receber um artista com propriedade inválida', () => {
        try {
            service.create({...artist, invalidField: 'true!'} as any)
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

    it('error case: deve dar erro por receber um artista com nome como number', () => {
        try {
            service.create({artistName: 2, artistNationality: 'teste3'} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista com nome como number\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"artistName" must be a string')
        }
        
    })

    it('error case: deve dar erro por receber um artista com nacionalidade como number', () => {
        try {
            service.create({artistName: 'teste3', artistNationality: 1} as any)
             throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err) {
            console.log(
            `
            deve dar erro por receber um artista com nacionalidade como number\n
            dados retornados: ${(err as Error).message}
            `
            
        )
        expect(err).toBeInstanceOf(ValidationError)
        expect((err as Error).message).toEqual('"artistNationality" must be a string')
        }
        
    })

})

