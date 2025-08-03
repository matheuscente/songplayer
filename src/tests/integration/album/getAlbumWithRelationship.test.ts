import { IAlbumRepository, IAlbumService, IClientAlbum } from "../../../models/album.model"
import { IArtistRepository, IArtistService, IClientArtist } from "../../../models/artist.model"
import { IComposerRepository, IComposerService } from "../../../models/composer.model"
import { IAlbumWithArtistAndSongs, IGetAlbumWithRelationshipService } from "../../../models/getAlbumsWithRelationship.model"
import { IArtistWithAlbums, IGetArtistWithRelationshipService } from "../../../models/getArtistsWithRelationship.model"
import { IGetComposerWithRelationshipService } from "../../../models/getComposersWithRelationship.model"
import { IGetSongWithRelationshipService } from "../../../models/getSongsWithRelationship.model"
import { IClientSong, ISongRepository, ISongService } from "../../../models/song.model"
import { ISongAlbumRepository, ISongAlbumService } from "../../../models/songAlbum.model"
import { ISongComposerRepository, ISongComposerService } from "../../../models/songComposer.model"
import AlbumRepository from "../../../repositories/album.repository"
import ArtistRepository from "../../../repositories/artist.repository"
import ComposerRepository from "../../../repositories/composer.repository"
import SongRepository from "../../../repositories/song.repository"
import SongAlbumRepository from "../../../repositories/songAlbum.repository"
import SongComposerRepository from "../../../repositories/songComposer.repository"
import AlbumService from "../../../services/album.service"
import AlbumWithRelationship from "../../../services/albumWithRelationship.service"
import ArtistService from "../../../services/artist.service"
import ArtistWithRelationship from "../../../services/artistWithRelationship.service"
import ComposerService from "../../../services/composer.service"
import ComposerWithRelationship from "../../../services/composerWithRelationship.service"
import SongService from "../../../services/song.service"
import SongAlbumService from "../../../services/songAlbum.service"
import SongComposerService from "../../../services/songComposer.service"
import SongWithRelationship from "../../../services/songWithRelationship.service"
import { ValidationError } from "../../../errors/validation.error"
import TimeConverter from "../../../utils/timeConverter.utils"
import database from "../../../prismaUtils/client"

jest.setTimeout(20000);


describe('testes de integração de album com suas relações', () => {
    const albumRepository: IAlbumRepository = new AlbumRepository(database)
    const songRepository: ISongRepository = new SongRepository(database)
    const artistRepository: IArtistRepository  = new ArtistRepository(database)
    const composerRepository: IComposerRepository = new ComposerRepository(database)
    const songAlbumRepository: ISongAlbumRepository = new SongAlbumRepository(database)
    const songComposerRepository: ISongComposerRepository = new SongComposerRepository(database)
    const albumService: IAlbumService = new AlbumService(albumRepository, database);
    const artistService: IArtistService = new ArtistService(artistRepository);
    const songService: ISongService = new SongService(songRepository);
    const composerService: IComposerService = new ComposerService(composerRepository);
    const songComposerService: ISongComposerService = new SongComposerService(songComposerRepository);
    const songAlbumService: ISongAlbumService = new SongAlbumService(songAlbumRepository);
    const albumWithRelationshipService: IGetAlbumWithRelationshipService = new AlbumWithRelationship();
    const songWithRelationshipService: IGetSongWithRelationshipService = new SongWithRelationship();
    const composerWithRelationshipService: IGetComposerWithRelationshipService = new ComposerWithRelationship();
    const artistWithRelationshipService: IGetArtistWithRelationshipService = new ArtistWithRelationship();
    const artist1: IClientArtist = {name: "teste", nationality: "teste"}
    const song1: IClientSong = {name: "teste", year: 2000, duration: "00:02:00"}
     const song2: IClientSong = {name: "teste 2", year: 2000, duration: "00:03:00"}
     const song3: IClientSong = {name: "teste 3", year: 2000, duration: "00:04:00"}
     const album1: IClientAlbum = {title: "teste", year: 2000, artist_id: 1}
     const album2: IClientAlbum = {title: "teste 2", year: 2000, artist_id: 1} 
     const albumDuration = (a: string, b: string, c:string): string => {
        let value: number = TimeConverter.timeToMilliseconds(a) + TimeConverter.timeToMilliseconds(b) + TimeConverter.timeToMilliseconds(c)
        return TimeConverter.millisecondsToTime(value)
    }
    let artist: IArtistWithAlbums | undefined
    beforeAll( async() => {
          await database.artists.deleteMany({});
            await database.albums.deleteMany({});
            await database.songs.deleteMany({});
            await database.song_album.deleteMany({});
            await database.song_composer.deleteMany({});

         albumService.setDependencies(artistService);

        artistService.setDependencies(albumService);

        albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

        songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

        artistWithRelationshipService.setDependencies(artistService, albumService)

        composerWithRelationshipService.setDependencies(composerService, songComposerService)

        await artistService.create(artist1)

        await albumService.create(album1)
        await albumService.create(album2)

        await songService.create(song1)
        await songService.create(song2)
        await songService.create(song3)

        songAlbumService.setDependencies(songService, albumService)

        await songAlbumService.create({album_id: 1, song_id: 1})
        await songAlbumService.create({album_id: 1, song_id: 2})
        await songAlbumService.create({album_id: 2, song_id: 3})
        await songAlbumService.create({album_id: 2, song_id: 2})

        artist = await artistWithRelationshipService.getById(1)

    })

        afterAll(async () => {
    await database.$disconnect()
});

    it('success case: busca todos os albuns com seus artistas e musicas correspondentes',  async() => {
        if(!artist) throw new Error('erro no artista')
        
        const expected: IAlbumWithArtistAndSongs[] = [
            {
                id: 1,
                ...album1,
                songs: [1, 2],
                artist: artist,
                duration: albumDuration("00:02:00", "00:03:00", "00:00:00"),
                songs_number: 2
            },

            {
                id: 2,
                ...album2,
                songs: [3, 2],
                artist: artist,
                duration: albumDuration("00:00:00", "00:03:00", "00:04:00"),
                songs_number: 2
            }
        ]
        
        const albums: IAlbumWithArtistAndSongs[] = await albumWithRelationshipService.getAll()

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(albums)}
                `)

        expect(albums).toEqual(expected)


    })


    it('success case: deve retornar album de acordo com seu id',  async() => {
        if(!artist) throw new Error('erro no artista')

        const expected: IAlbumWithArtistAndSongs = 
            {
                id: 1,
                ...album1,
                songs: [1, 2],
                artist: artist,
                duration: albumDuration("00:02:00", "00:03:00", "00:00:00"),
                songs_number: 2
            }
        
        
        const album: IAlbumWithArtistAndSongs | undefined = await albumWithRelationshipService.getById(1)

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(album)}
                `)

        expect(album).toEqual(expected)

    })

    it('error case: deve dar erro pois id passado não é um number ',  async() => {
        
        try
        {
            await albumWithRelationshipService.getById('1a' as any)

            throw new Error('era para lançar ValidationError mas não lançou')
        } catch(err) {
            console.log(`
                    deve retornar ValidationError
                    dados retornados: ${err}
                `)

            expect(err).toBeInstanceOf(ValidationError)
            expect((err as ValidationError).message).toEqual('"id" must be a number')
        }

        

    })

    it('error case: deve dar undefined pois não tem album com o id 1 no banco ',  async() => {
        albumService.delete(1)
        const songAlbum = await songAlbumService.getByAlbumId(1)

        const albums = await albumWithRelationshipService.getAll()

         const album = await albumWithRelationshipService.getById(1)

        console.log(`
                    deve retornar undefined
                    dados no banco: ${JSON.stringify(albums)}
                    dados retornados: ${JSON.stringify(album)}
        `)

        expect(album).toBe(undefined)
        expect(songAlbum.length).toBe(0)
    })

    it('error case: deve retornar array vazio pois não possuem albuns no banco ',  async() => {
        await albumService.delete(2)
        const songAlbum = await songAlbumService.getByAlbumId(2)

         const albums = await albumWithRelationshipService.getAll()

        console.log(`
                    deve retornar array vazio
                    dados retornados: ${JSON.stringify(albums)}
        `)

        expect(albums.length).toBe(0)
        expect(songAlbum.length).toBe(0)

    })
})