import SongService from "../../services/song.service";
import { ISongRepository, IDatabaseSong } from "../../models/song.model";


describe('testes unitários do método getAll do service de song', () => {
    let service: SongService
    let mockRepository: jest.Mocked<ISongRepository>
    let songs: IDatabaseSong[]

    beforeAll(() => {
        songs = [
            {
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: 150000
        },
        {
            songId: 2,
            songName: 'teste2',
            songYear: 2000,
            songDuration: 20000
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

    it('success case: deve retornar o todos os songs', () => {
        mockRepository.getAll.mockReturnValue([...songs])

        const data = service.getAll()
        console.log(
            `deve retornar todos os songs\n
            dados repository: ${JSON.stringify(songs)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(songs)
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

