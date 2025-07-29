import SongService from "../../services/song.service";
import { ISongRepository, IDatabaseSong } from "../../models/song.model";
import { ValidationError } from "../../errors/validation.error";
import TimeConverter from "../../utils/timeConverter.utils";

describe('testes unitários do método getById do service de song', () => {
    let service: SongService
    let mockRepository: jest.Mocked<ISongRepository>
    let songs: IDatabaseSong[]

    beforeAll(() => {
        songs = [
            {
            songId: 1,
            songName: 'teste',
            songYear: 2000,
            songDuration: 15000
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

        //configuração do mock
        mockRepository.getById.mockImplementation((id) => {
            const song = songs.find((song) => {
                return song.songId === id
            })
            if(!song) return undefined
            return {...song}
        })


        //instância de service com repositório mockado
        service = new SongService(mockRepository)
    })

    it('success case: deve retornar o song de acordo com o id', () => {
        const song = {...songs[0]}
        song.songDuration  = TimeConverter.millisecondsToTime(song.songDuration as number)
        const data = service.getById(1)
        console.log(
            `deve retornar o song de acordo com o id\n
            dados repository: ${JSON.stringify(song)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(song)
    })

    it('error case: deve retornar undefined pois nao existe item no banco', () => {
        
        const data = service.getById(3)
        console.log(
            `
            error case: deve retornar undefined pois nao existe item no banco\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toBe(undefined)
    })

        it('error case: erro caso o id passado nao seja um número', () => {
            try{
                service.getById('a2' as any);
                throw new Error('Era esperado que lançasse ValidationError, mas não lançou');            }catch(err) {
                console.log('error case: erro caso o id passado nao seja um número\n', `dados retornados ${(err as Error).message}`);
                expect(err).toBeInstanceOf(ValidationError);
                expect((err as Error).message).toEqual('"id" must be a number')
            }
        
    })

})

