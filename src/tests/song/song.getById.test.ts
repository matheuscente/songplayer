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
            id: 1,
            name: 'teste',
            year: 2000,
            duration: 15000
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

        //configuração do mock
        mockRepository.getById.mockImplementation(async (id) => {
            const song = songs.find((song) => {
                return song.id === id
            })
            if(!song) return undefined
            return {...song}
        })


        //instância de service com repositório mockado
        service = new SongService(mockRepository)
    })

    it('success case: deve retornar o song de acordo com o id', async () => {
        const song = {...songs[0]}
        song.duration  = TimeConverter.millisecondsToTime(song.duration as number)
        const data = await service.getById(1)
        console.log(
            `deve retornar o song de acordo com o id\n
            dados repository: ${JSON.stringify(song)}\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toEqual(song)
    })

    it('error case: deve retornar undefined pois nao existe item no banco', async () => {
        
        const data = await service.getById(3)
        console.log(
            `
            error case: deve retornar undefined pois nao existe item no banco\n
            dados retornados: ${JSON.stringify(data)}
            `
            
        )
        expect(data).toBe(undefined)
    })

        it('error case: erro caso o id passado nao seja um número', async () => {
            try{
                await service.getById('a2' as any);
                throw new Error('Era esperado que lançasse ValidationError, mas não lançou');            }catch(err) {
                console.log('error case: erro caso o id passado nao seja um número\n', `dados retornados ${(err as Error).message}`);
                expect(err).toBeInstanceOf(ValidationError);
                expect((err as Error).message).toEqual('"id" must be a number')
            }
        
    })

})

