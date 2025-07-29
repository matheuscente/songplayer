import Database from "better-sqlite3"
import { IAlbumRepository, IAlbumService, IClientAlbum } from "../../../models/album.model"
import { IArtistRepository, IArtistService, IClientArtist } from "../../../models/artist.model"
import { IClientComposer, IComposerRepository, IComposerService } from "../../../models/composer.model"
import { IGetAlbumWithRelationshipService } from "../../../models/getAlbumsWithRelationship.model"
import { IGetArtistWithRelationshipService } from "../../../models/getArtistsWithRelationship.model"
import { IGetComposerWithRelationshipService } from "../../../models/getComposersWithRelationship.model"
import { IGetSongWithRelationshipService, ISongWithComposersAndAlbums } from "../../../models/getSongsWithRelationship.model"
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
import { DbManager } from "../../../repositories/database/database.utils"
import { ValidationError } from "../../../errors/validation.error"

describe('testes de integração de song com suas relações',() => {
    const dbManager = new DbManager()
    const database: Database.Database = new Database(":memory:")
    const albumRepository: IAlbumRepository = new AlbumRepository(database)
    const songRepository: ISongRepository = new SongRepository(database)
    const artistRepository: IArtistRepository  = new ArtistRepository(database)
    const composerRepository: IComposerRepository = new ComposerRepository(database)
    const songAlbumRepository: ISongAlbumRepository = new SongAlbumRepository(database)
    const songComposerRepository: ISongComposerRepository = new SongComposerRepository(database)
    const albumService: IAlbumService = new AlbumService(albumRepository);
    const artistService: IArtistService = new ArtistService(artistRepository);
    const songService: ISongService = new SongService(songRepository);
    const composerService: IComposerService = new ComposerService(composerRepository);
    const songComposerService: ISongComposerService = new SongComposerService(songComposerRepository);
    const songAlbumService: ISongAlbumService = new SongAlbumService(songAlbumRepository);
    const albumWithRelationshipService: IGetAlbumWithRelationshipService = new AlbumWithRelationship();
    const songWithRelationshipService: IGetSongWithRelationshipService = new SongWithRelationship();
    const composerWithRelationshipService: IGetComposerWithRelationshipService = new ComposerWithRelationship();
    const artistWithRelationshipService: IGetArtistWithRelationshipService = new ArtistWithRelationship();
    const album1: IClientAlbum = {albumTitle: "teste", albumYear: 2000, artistId: 1}
    const album2: IClientAlbum = {albumTitle: "teste 2", albumYear: 2000, artistId: 1}
    const artist: IClientArtist = {artistName: "teste", artistNationality: "teste"}
    const composer1: IClientComposer = {composerName: "teste"}
     const composer2: IClientComposer = {composerName: "teste 2"}
     const song1: IClientSong = {songDuration: "00:01:00", songName: "teste", songYear: 2000}
    const song2: IClientSong = {songDuration: "00:01:00", songName: "teste 2", songYear: 2000}

    beforeAll(() => {
        database.pragma('journal_mode = WAL')
        database.pragma('foreign_keys = ON')
        dbManager.createAllTables(database)

         albumService.setDependencies(artistService);

        artistService.setDependencies(albumService);
        songComposerService.setDependencies(songService, composerService)
        songAlbumService.setDependencies(songService, albumService)

        albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

        songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

        artistWithRelationshipService.setDependencies(artistService, albumService)

        composerWithRelationshipService.setDependencies(composerService, songComposerService)

        composerService.create(composer1)
        composerService.create(composer2)

        artistService.create(artist)

       albumService.create(album1)
       albumService.create(album2)

       songService.create(song1)
        songService.create(song2)


        songComposerService.create({songId: 1, composerId: 1, composition: "letra"})
        songComposerService.create({songId: 1, composerId: 2, composition: "letra"})
        songComposerService.create({songId: 2, composerId: 1, composition: "letra"})
        songAlbumService.create({songId: 2, albumId: 1})
        songAlbumService.create({songId: 1, albumId: 2})


    })

    it('success case: busca todos os songs com suas relações correspondentes', () => {
        const expected: ISongWithComposersAndAlbums[] = [
            {
                songId: 1,
                ...song1,
                albums: [2],
                composers: [
                    {composerId: 1, composition: "letra"},
                    {composerId: 2, composition: "letra"},
                ]
            },

            {
                 songId: 2,
                ...song2,
                albums: [1],
                composers: [{composerId: 1, composition: "letra"}]
            }
        ]
        
        const songs: ISongWithComposersAndAlbums[] = songWithRelationshipService.getAll()

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(songs)}
                `)

        expect(songs).toEqual(expected)


    })


    it('success case: deve retornar song de acordo com seu id', () => {
        const expected: ISongWithComposersAndAlbums = 
            {
                songId: 1,
                ...song1,
                albums: [2],
                composers: [
                    {composerId: 1, composition: "letra"},
                    {composerId: 2, composition: "letra"},
                ]
            }
        
        
        const song: ISongWithComposersAndAlbums | undefined = songWithRelationshipService.getById(1)

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(song)}
                `)

        expect(song).toEqual(expected)

    })

    it('error case: deve dar erro pois id passado não é um number ', () => {
        
        try
        {
            songWithRelationshipService.getById('1a' as any)

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

    it('error case: deve dar undefined não existem songs com o id 1 no banco ', () => {
        songService.delete(1)
        const songAlbum = songAlbumService.getBySongId(1)
        const songComposer = songComposerService.getBySongId(1)

        const songs = songWithRelationshipService.getAll()

         const song = songWithRelationshipService.getById(1)

        console.log(`
                    deve retornar undefined
                    dados no banco: ${JSON.stringify(songs)}
                    dados retornados: ${JSON.stringify(song)}
        `)

        expect(song).toBe(undefined)
        expect(songAlbum.length).toBe(0)
        expect(songComposer.length).toBe(0)

    })

    it('error case: deve retornar array vazio pois não possuem songs no banco ', () => {
        songService.delete(2)
        const songAlbum = songAlbumService.getBySongId(2)
        const songComposer = songComposerService.getBySongId(2)

         const songs = songWithRelationshipService.getAll()

        console.log(`
                    deve retornar array vazio
                    dados retornados: ${JSON.stringify(songs)}
        `)

        expect(songs.length).toBe(0)
        expect(songAlbum.length).toBe(0)
        expect(songComposer.length).toBe(0)
    })
})