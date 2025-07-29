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
            artistId: 3,
            artistName: 'teste UPDATE',
            artistNationality: 'teste UPDATE'
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
        },
        {
            artistId: 3,
            artistName: 'teste3',
            artistNationality: 'teste3'
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
        mockRepository.update.mockImplementation((item: IDatabaseArtist | UpdateArtist) => {
            artists.forEach(artist => {
                if(item.artistId === artist.artistId) {
                    artist.artistName = (item as IDatabaseArtist).artistName,
                    artist.artistNationality = (item as IDatabaseArtist).artistNationality
                }
            })
        })

        mockRepository.getById.mockImplementation((id: number) => {
            const artist = artists.find(artist => artist.artistId === id)

            if(!artist) return undefined

            return artist
        })


        //instância de service com repositório mockado
        service = new ArtistService(mockRepository)
    })

    afterEach(() => {
        artists[2].artistName = 'teste 3';
        artists[2].artistNationality = 'teste 3'
    })

    it('sucess case: deve atualizar um artista de acordo com o id', () => {
        
        const oldArtist: IDatabaseArtist = {...artists[2]}
        service.update(artist)
        console.log(
            `deve atualizar um artista de acordo com id\n
            dados passados para atualização: ${JSON.stringify(artist)},
            dados no banco antes da atualização: ${JSON.stringify(oldArtist)}
            dados no banco depois da atualização: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(artists[2]).toEqual(artist)
    })

    it('sucess case: deve atualizar o nome do artista de acordo com o id', () => {
        delete artist.artistNationality
        const oldArtist = {...artists[2]}
        service.update(artist)
        console.log(
            `deve atualizar o nome do artista de acordo com o id\n
            dados passados para atualização: ${JSON.stringify(artist)},
            dados no banco antes da atualização: ${JSON.stringify(oldArtist)}
            dados no banco depois da atualização: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(artists[2]).toEqual({...artist, artistNationality: oldArtist.artistNationality})
    })

    it('sucess case: deve atualizar a nacionalidade do artista de acordo com o id', () => {
        delete artist.artistName
        const oldArtist = {...artists[2]}
        service.update(artist)
        console.log(
            `deve atualizar a nacionalidade do artista de acordo com o id\n
            dados passados para atualização: ${JSON.stringify(artist)},
            dados no banco antes da atualização: ${JSON.stringify(oldArtist)}
            dados no banco depois da atualização: ${JSON.stringify(artists[2])}
            `
            
        )
        expect(artists[2]).toEqual({...artist, artistName: oldArtist.artistName})
    })

    it('error case: deve dar erro pois é necessário no mínimo 1 campo para atualização', () => {
        delete artist.artistName
        delete artist.artistNationality

        try{
            service.update(artist)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois é necessário no mínimo 1 campo para atualização\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"value" must contain at least one of [artistName, artistNationality]')


        }
        
    })

    it('error case: deve dar erro pois não existe artista no id informado', () => {
       artist.artistId = 4

        try{
            service.update(artist)
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

    it('error case: deve dar erro pois id não é um número', () => {
       artist.artistId = ('4a' as any)

        try{
            service.update(artist)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois id não é um número\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"artistId" must be a number')

        }
        
    })

     it('error case: deve dar erro pois artistNationality não é uma string', () => {
       artist.artistNationality = (123 as any)

        try{
            service.update(artist)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois artistNationality não é uma string\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"artistNationality" must be a string')

        }
        
    })

     it('error case: deve dar erro pois artistName não é uma string', () => {
       artist.artistName = (123 as any)

        try{
            service.update(artist)
            throw new Error('Era esperado que lançasse ValidationError, mas não lançou');
        } catch(err){
            console.log(
            `deve dar erro pois artistName não é uma string\n
            resultado: ${err}
            `
            )
        
            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"artistName" must be a string')

        }
        
    })

    
})

