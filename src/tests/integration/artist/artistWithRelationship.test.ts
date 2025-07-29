import Database from "better-sqlite3"
import { IAlbumRepository, IAlbumService } from "../../../models/album.model"
import { IArtistRepository, IArtistService } from "../../../models/artist.model"
import { IComposerRepository, IComposerService } from "../../../models/composer.model"
import { IGetAlbumWithRelationshipService } from "../../../models/getAlbumsWithRelationship.model"
import { IArtistWithAlbums, IGetArtistWithRelationshipService } from "../../../models/getArtistsWithRelationship.model"
import { IGetComposerWithRelationshipService } from "../../../models/getComposersWithRelationship.model"
import { IGetSongWithRelationshipService } from "../../../models/getSongsWithRelationship.model"
import { ISongRepository, ISongService } from "../../../models/song.model"
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

describe('testes de integração de artist com suas relações',() => {
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
    const artist1 = {artistName: "teste", artistNationality: "teste"}
    const artist2 = {artistName: "teste 2", artistNationality: "teste"}
    const album1 = {albumTitle: "teste", albumYear: 2000, artistId: 1}
     const album2 = {albumTitle: "teste 2", albumYear: 2000, artistId: 1}
     const album3 = {albumTitle: "teste 3", albumYear: 2000, artistId: 2}
    beforeAll(() => {
        database.pragma('journal_mode = WAL')
        database.pragma('foreign_keys = ON')
        dbManager.createAllTables(database)

         albumService.setDependencies(artistService);

        artistService.setDependencies(albumService);

        albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

        songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

        artistWithRelationshipService.setDependencies(artistService, albumService)

        composerWithRelationshipService.setDependencies(composerService, songComposerService)

        artistService.create(artist1)
        artistService.create(artist2)

        albumService.create(album1)
        albumService.create(album2)
        albumService.create(album3)
    })

    it('success case: busca todos os artistas com seus albuns correspondentes', () => {
        const expected: IArtistWithAlbums[] = [
            {
                artistId: 1,
                ...artist1,
                albums: [1, 2]
            },

            {
                artistId: 2,
                ...artist2,
                albums: [3]
            }
        ]
        
        const artists: IArtistWithAlbums[] = artistWithRelationshipService.getAll()

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(artists)}
                `)

        expect(artists).toEqual(expected)


    })


    it('success case: deve retornar artista de acordo com seu id', () => {
        const expected: IArtistWithAlbums = 
            {
                artistId: 1,
                ...artist1,
                albums: [1, 2]
            }
        
        
        const artists: IArtistWithAlbums | undefined = artistWithRelationshipService.getById(1)

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(artists)}
                `)

        expect(artists).toEqual(expected)

    })

    it('error case: deve dar erro pois id passado não é um number ', () => {
        
        try
        {
            artistWithRelationshipService.getById('1a' as any)

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

    it('error case: deve dar undefined pois não tem artista com o id 1 no banco ', () => {
        albumService.delete(1)
        albumService.delete(2)
        artistService.delete(1)

        const artists = artistWithRelationshipService.getAll()

         const artist = artistWithRelationshipService.getById(1)

        console.log(`
                    deve retornar undefined
                    dados no banco: ${JSON.stringify(artists)}
                    dados retornados: ${JSON.stringify(artist)}
        `)

        expect(artist).toBe(undefined)
    })

    it('error case: deve retornar array vazio pois não possuem artistas no banco ', () => {
        albumService.delete(3)
        artistService.delete(2)

         const artists = artistWithRelationshipService.getAll()

        console.log(`
                    deve retornar array vazio
                    dados retornados: ${JSON.stringify(artists)}
        `)

        expect(artists).toEqual([])
    })
})