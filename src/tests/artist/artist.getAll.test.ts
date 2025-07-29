import ArtistService from "../../services/artist.service";
import { IArtistRepository, IDatabaseArtist } from "../../models/artist.model";


describe('testes unitários do método getAll do service de artist', () => {
    let service: ArtistService
    let mockRepository: jest.Mocked<IArtistRepository>
    let artists: IDatabaseArtist[]

    beforeAll(() => {
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


        //instância de service com repositório mockado
        service = new ArtistService(mockRepository)
    })

    it('success case: deve retornar o todos os artistas', () => {
        mockRepository.getAll.mockReturnValue(artists)
        const data = service.getAll()
        console.log(
            `deve retornar todos os artistas\n
            dados repository: ${JSON.stringify(artists)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(artists)
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

