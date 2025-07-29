import AlbumService from "../../services/album.service";
import { IAlbumRepository, IDatabaseAlbum } from "../../models/album.model";


describe('testes unitários do método getAll do service de album', () => {
    let service: AlbumService
    let mockRepository: jest.Mocked<IAlbumRepository>
    let albums: IDatabaseAlbum[]

    beforeAll(() => {
        albums = [
            {
            albumId: 1,
            albumTitle: 'teste',
            albumYear: 2000,
            artistId: 1
        },
        {
            albumId: 2,
            albumTitle: 'teste2',
            albumYear: 2000,
            artistId: 2
        }
    ];

        //mockando repository
        mockRepository = {
            getByArtistId: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }


        //instância de service com repositório mockado
        service = new AlbumService(mockRepository)
    })

    it('success case: deve retornar o todos os albums', () => {
        mockRepository.getAll.mockReturnValue(albums)
        const data = service.getAll()
        console.log(
            `deve retornar todos os albums\n
            dados repository: ${JSON.stringify(albums)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(albums)
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

