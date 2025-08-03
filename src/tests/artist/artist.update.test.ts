import ArtistService from "../../services/artist.service";
import { IArtistRepository, IDatabaseArtist, UpdateArtist } from "../../models/artist.model";
import { ValidationError } from "../../errors/validation.error";
import { NotFoundError } from "../../errors/not-found.error";

describe('testes unitários do método update do service de artist', () => {
    let service: ArtistService
    let mockRepository: jest.Mocked<IArtistRepository>
    let artists: IDatabaseArtist[]
    let artist: UpdateArtist

    beforeEach(() => {
         artist = {
            id: 3,
            name: 'teste UPDATE',
            nationality: 'teste UPDATE'
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
        },
        {
            id: 3,
            name: 'teste3',
            nationality: 'teste3'
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
        mockRepository.update.mockImplementation(async (item: IDatabaseArtist | UpdateArtist) => {
            artists.forEach(artist => {
                if(item.id === artist.id) {
                    artist.name = (item as IDatabaseArtist).name,
                    artist.nationality = (item as IDatabaseArtist).nationality
                }
            })
        })

        mockRepository.getById.mockImplementation(async (id: number) => {
            const artist = artists.find(artist => artist.id === id)

            if(!artist) return undefined

            return artist
        })


        //instância de service com repositório mockado
        service = new ArtistService(mockRepository)
    })

    afterEach(async () => {
        artists[2].name = 'teste 3';
        artists[2].nationality = 'teste 3'
    })

    it('sucess case: deve atualizar um artista de acordo com o id', async () => {
        
        const oldArtist: IDatabaseArtist = {...artists[2]}
        await service.update(artist)
        console.log(
            `deve atualizar um artista de acordo com id\n
            dados passados para atualização: ${JSON.stringify(artist)},
            dados no banco antes da atualização: ${JSON.stringify(oldArtist)}
            dados no banco depois da atualização: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(artists[2]).toEqual(artist)
    })

    it('sucess case: deve atualizar o nome do artista de acordo com o id', async () => {
        delete artist.nationality
        const oldArtist = {...artists[2]}
        await service.update(artist)
        console.log(
            `deve atualizar o nome do artista de acordo com o id\n
            dados passados para atualização: ${JSON.stringify(artist)},
            dados no banco antes da atualização: ${JSON.stringify(oldArtist)}
            dados no banco depois da atualização: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(artists[2]).toEqual({...artist, nationality: oldArtist.nationality})
    })

    it('sucess case: deve atualizar a nacionalidade do artista de acordo com o id', async () => {
        delete artist.name
        const oldArtist = {...artists[2]}
        await service.update(artist)
        console.log(
            `deve atualizar a nacionalidade do artista de acordo com o id\n
            dados passados para atualização: ${JSON.stringify(artist)},
            dados no banco antes da atualização: ${JSON.stringify(oldArtist)}
            dados no banco depois da atualização: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(artists[2]).toEqual({...artist, name: oldArtist.name})
    })

    it('error case: deve dar erro pois é necessário no mínimo 1 campo para atualização', async () => {
        delete artist.name
        delete artist.nationality

        try{
            await service.update(artist)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois é necessário no mínimo 1 campo para atualização\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"value" must contain at least one of [name, nationality]')


        }
        
    })

    it('error case: deve dar erro pois não existe artista no id informado', async () => {
       artist.id = 4

        try{
            await service.update(artist)
            throw new Error('Era esperado que lançasse NotFoundError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois não existe artista no id informado\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(NotFoundError)
            expect((err as NotFoundError).message).toEqual('artista não encontrado')


        }
        
    })

    it('error case: deve dar erro pois id não é um número', async () => {
       artist.id = ('4a' as any)

        try{
            await service.update(artist)
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

     it('error case: deve dar erro pois nationality não é uma string', async () => {
       artist.nationality = (123 as any)

        try{
            await service.update(artist)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois nationality não é uma string\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"nationality" must be a string')

        }
        
    })

     it('error case: deve dar erro pois name não é uma string', async () => {
       artist.name = (123 as any)

        try{
            await service.update(artist)
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

