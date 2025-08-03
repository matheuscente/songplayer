import { IAlbumRepository, IAlbumService } from "../../../models/album.model"
import { IArtistRepository, IArtistService } from "../../../models/artist.model"
import { IClientComposer, IComposerRepository, IComposerService } from "../../../models/composer.model"
import { IGetAlbumWithRelationshipService } from "../../../models/getAlbumsWithRelationship.model"
import { IGetArtistWithRelationshipService } from "../../../models/getArtistsWithRelationship.model"
import { IComposerWithSongs, IGetComposerWithRelationshipService } from "../../../models/getComposersWithRelationship.model"
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
import database from "../../../prismaUtils/client"
import { execSync } from "child_process"


describe('testes de integração de composer com suas relações',async () => {
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
    const composer1: IClientComposer = {name: "teste"}
    const composer2: IClientComposer = {name: "teste 2"}
    const song1: IClientSong = {name: "teste", year: 2000, duration: "00:02:00"}
     const song2: IClientSong = {name: "teste 2", year: 2000, duration: "00:03:00"}
     const song3: IClientSong = {name: "teste 3", year: 2000, duration: "00:04:00"}
    beforeAll(async () => {
          execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });


         albumService.setDependencies(artistService);

        artistService.setDependencies(albumService);

        albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

        songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

        artistWithRelationshipService.setDependencies(artistService, albumService)

        composerWithRelationshipService.setDependencies(composerService, songComposerService)

        await composerService.create(composer1)
        await composerService.create(composer2)

       await songService.create(song1)
       await songService.create(song2)
       await songService.create(song3)

       songComposerService.setDependencies(songService, composerService),

        await songComposerService.create({song_id: 1, composer_id: 1, composition: "letra"})
        await songComposerService.create({song_id: 2, composer_id: 1, composition: "letra"})
        await songComposerService.create({song_id: 3, composer_id: 2, composition: "letra"})


    })

        afterAll(async () => {
  await database.$disconnect()
});

    it('success case: busca todos os compositores com suas musicas correspondentes', async () => {
        const expected: IComposerWithSongs[] = [
            {
                id: 1,
                ...composer1,
                songs: [{song: 1, composition: "letra"}, {song: 2, composition: "letra"}]
            },

            {
                 id: 2,
                ...composer2,
                songs: [{song: 3, composition: "letra"}]
            }
        ]
        
        const composers: IComposerWithSongs[] = await composerWithRelationshipService.getAll()

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(composers)}
                `)

        expect(composers).toEqual(expected)


    })


    it('success case: deve retornar compositor de acordo com seu id', async () => {
        const expected: IComposerWithSongs = 
            {
                id: 1,
                ...composer1,
                songs: [{song: 1, composition: "letra"}, {song: 2, composition: "letra"}]
            }
        
        
        const composer: IComposerWithSongs | undefined = await composerWithRelationshipService.getById(1)

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(composer)}
                `)

        expect(composer).toEqual(expected)

    })

    it('error case: deve dar erro pois id passado não é um number ', async () => {
        
        try
        {
            await composerWithRelationshipService.getById('1a' as any)

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

    it('error case: deve dar undefined não existem compositores com o id 1 no banco ', async () => {
        await composerService.delete(1)
        const songComposer = await songComposerService.getByComposerId(1)

        const composers = await composerWithRelationshipService.getAll()

         const composer = await composerWithRelationshipService.getById(1)

        console.log(`
                    deve retornar undefined
                    dados no banco: ${JSON.stringify(composers)}
                    dados retornados: ${JSON.stringify(composer)}
        `)

        expect(composer).toBe(undefined)
        expect(songComposer.length).toBe(0)
    })

    it('error case: deve retornar array vazio pois não possuem compositores no banco ', async () => {
        await composerService.delete(2)
        const songComposer = await songComposerService.getByComposerId(2)

         const composers = await composerWithRelationshipService.getAll()

        console.log(`
                    deve retornar array vazio
                    dados retornados: ${JSON.stringify(composers)}
        `)

        expect(composers.length).toEqual(0)
        expect(songComposer.length).toEqual(0)
    })
})