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
import { ValidationError } from "../../../errors/validation.error"
import database from "../../../prismaUtils/client"
import { execSync } from "child_process"
import { existsSync, unlinkSync } from "fs"
import path from "path"
 
describe('testes de integração de song com suas relações', () => {
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
    const album1: IClientAlbum = {title: "teste", year: 2000, artist_id: 1}
    const album2: IClientAlbum = {title: "teste 2", year: 2000, artist_id: 1}
    const artist: IClientArtist = {name: "teste", nationality: "teste"}
    const composer1: IClientComposer = {name: "teste"}
     const composer2: IClientComposer = {name: "teste 2"}
     const song1: IClientSong = {duration: "00:01:00", name: "teste", year: 2000}
    const song2: IClientSong = {duration: "00:01:00", name: "teste 2", year: 2000}

    const pathDatabase = path.resolve(__dirname, "../../../../test.db");
    
    beforeAll( async() => {
        if(existsSync(pathDatabase)) {
            unlinkSync(pathDatabase)
        }
        execSync("npx prisma db push", { stdio: "inherit" });


        albumService.setDependencies(artistService);
        artistService.setDependencies(albumService);
        songComposerService.setDependencies(songService, composerService)
        songAlbumService.setDependencies(songService, albumService)

        albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

        songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

        artistWithRelationshipService.setDependencies(artistService, albumService)

        composerWithRelationshipService.setDependencies(composerService, songComposerService)

        await composerService.create(composer1)
        await composerService.create(composer2)

        await artistService.create(artist)

       await albumService.create(album1)
       await albumService.create(album2)

       await songService.create(song1)
       await songService.create(song2)


        await songComposerService.create({song_id: 1, composer_id: 1, composition: "letra"})
        await songComposerService.create({song_id: 1, composer_id: 2, composition: "letra"})
        await songComposerService.create({song_id: 2, composer_id: 1, composition: "letra"})
        await songAlbumService.create({song_id: 2, album_id: 1})
        await songAlbumService.create({song_id: 1, album_id: 2})


    })

    afterAll(async () => {
  await database.$disconnect()
});

    it('success case: busca todos os songs com suas relações correspondentes',  async () => {
        const expected: ISongWithComposersAndAlbums[] = [
            {
                id: 1,
                ...song1,
                albums: [2],
                composers: [
                    {composerId: 1, composition: "letra"},
                    {composerId: 2, composition: "letra"},
                ]
            },

            {
                 id: 2,
                ...song2,
                albums: [1],
                composers: [{composerId: 1, composition: "letra"}]
            }
        ]
        
        const songs: ISongWithComposersAndAlbums[] = await songWithRelationshipService.getAll()

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(songs)}
                `)

        expect(songs).toEqual(expected)


    })


    it('success case: deve retornar song de acordo com seu id',  async () => {
        const expected: ISongWithComposersAndAlbums = 
            {
                id: 1,
                ...song1,
                albums: [2],
                composers: [
                    {composerId: 1, composition: "letra"},
                    {composerId: 2, composition: "letra"},
                ]
            }
        
        
        const song: ISongWithComposersAndAlbums | undefined = await songWithRelationshipService.getById(1)

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(song)}
                `)

        expect(song).toEqual(expected)

    })

    it('error case: deve dar erro pois id passado não é um number ',  async () => {
        
        try
        {
            await songWithRelationshipService.getById('1a' as any)

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

    it('error case: deve dar undefined não existem songs com o id 1 no banco ',  async () => {
        await songService.delete(1)
        const songAlbum = await songAlbumService.getBySongId(1)
        const songComposer = await songComposerService.getBySongId(1)

        const songs = await songWithRelationshipService.getAll()

         const song = await songWithRelationshipService.getById(1)

        console.log(`
                    deve retornar undefined
                    dados no banco: ${JSON.stringify(songs)}
                    dados retornados: ${JSON.stringify(song)}
        `)

        expect(song).toBe(undefined)
        expect(songAlbum.length).toBe(0)
        expect(songComposer.length).toBe(0)

    })

    it('error case: deve retornar array vazio pois não possuem songs no banco ',  async () => {
        await songService.delete(2)
        const songAlbum = await songAlbumService.getBySongId(2)
        const songComposer = await songComposerService.getBySongId(2)

         const songs = await songWithRelationshipService.getAll()

        console.log(`
                    deve retornar array vazio
                    dados retornados: ${JSON.stringify(songs)}
        `)

        expect(songs.length).toBe(0)
        expect(songAlbum.length).toBe(0)
        expect(songComposer.length).toBe(0)
    })
})