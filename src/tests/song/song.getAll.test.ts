import SongService from "../../services/song.service";
import { ISongRepository, IDatabaseSong } from "../../models/song.model";


describe('testes unitários do método getAll do service de song', () => {
    let service: SongService
    let mockRepository: jest.Mocked<ISongRepository>
    let songs: IDatabaseSong[]

    beforeAll(() => {
        songs = [
            {
            id: 1,
            name: 'teste',
            year: 2000,
            duration: 150000
        },
        {
            id: 2,
            name: 'teste2',
            year: 2000,
            duration: 20000
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
        service = new SongService(mockRepository)
    })

    it('success case: deve retornar o todos os songs', async () => {
        mockRepository.getAll.mockResolvedValue([...songs])

        const data = await service.getAll()
        console.log(
            `deve retornar todos os songs\n
            dados repository: ${JSON.stringify(songs)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(songs)
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

