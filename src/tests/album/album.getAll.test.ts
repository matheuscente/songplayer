import AlbumService from "../../services/album.service";
import { IAlbumRepository, IDatabaseAlbum } from "../../models/album.model";
import database from "../../prismaUtils/client"



describe('testes unitários do método getAll do service de album', () => {
    let service: AlbumService
    let mockRepository: jest.Mocked<IAlbumRepository>
    let albums: IDatabaseAlbum[]

    beforeAll(() => {
        albums = [
            {
            id: 1,
            title: 'teste',
            year: 2000,
            artist_id: 1
        },
        {
            id: 2,
            title: 'teste2',
            year: 2000,
            artist_id: 2
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
        service = new AlbumService(mockRepository, database)
    })

    it('success case: deve retornar o todos os albums', async () => {
        mockRepository.getAll.mockResolvedValue(albums)
        const data = await service.getAll()
        console.log(
            `deve retornar todos os albums\n
            dados repository: ${JSON.stringify(albums)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(albums)
    })

    it('success case: deve retornar array vazio pois nao existe item no banco', async () => {
        mockRepository.getAll.mockResolvedValue([])
        const data = await service.getAll()
        console.log(
            `
            deve retornar array vazio pois nao existe item no banco\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data.length).toBe(0)
    })

})

