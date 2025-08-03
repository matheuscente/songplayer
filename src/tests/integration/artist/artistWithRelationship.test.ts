import { IAlbumRepository, IAlbumService, IClientAlbum } from "../../../models/album.model"
import { IArtistRepository, IArtistService, IClientArtist } from "../../../models/artist.model"
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
import { ValidationError } from "../../../errors/validation.error"
import database from "../../../prismaUtils/client"
import { execSync } from "child_process"
import { existsSync, unlinkSync } from "fs"
import path from "path"
 

describe('testes de integração de artist com suas relações', () => {
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
    const artist1: IClientArtist = {name: "teste", nationality: "teste"}
    const artist2: IClientArtist = {name: "teste 2", nationality: "teste"}
    const album1: IClientAlbum = {title: "teste", year: 2000, artist_id: 1}
     const album2: IClientAlbum = {title: "teste 2", year: 2000, artist_id: 1}
     const album3: IClientAlbum = {title: "teste 3", year: 2000, artist_id: 2}
    const pathDatabase = path.resolve(__dirname, "../../../../test.db");
    
    beforeAll( async() => {
        if(existsSync(pathDatabase)) {
            unlinkSync(pathDatabase)
        }
        execSync("npx prisma db push", { stdio: "inherit" });


           
         albumService.setDependencies(artistService);

        artistService.setDependencies(albumService);

        albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

        songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

        artistWithRelationshipService.setDependencies(artistService, albumService)

        composerWithRelationshipService.setDependencies(composerService, songComposerService)

        await artistService.create(artist1)
        await artistService.create(artist2)

        await albumService.create(album1)
        await albumService.create(album2)
        await albumService.create(album3)
    })

        afterAll(async () => {
 
  await database.$disconnect()
});

    it('success case: busca todos os artistas com seus albuns correspondentes', async () => {
        const expected: IArtistWithAlbums[] = [
            {
                id: 1,
                ...artist1,
                albums: [1, 2]
            },

            {
                id: 2,
                ...artist2,
                albums: [3]
            }
        ]
        
        const artists: IArtistWithAlbums[] = await artistWithRelationshipService.getAll()

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(artists)}
                `)

        expect(artists).toEqual(expected)


    })


    it('success case: deve retornar artista de acordo com seu id', async () => {
        const expected: IArtistWithAlbums = 
            {
                id: 1,
                ...artist1,
                albums: [1, 2]
            }
        
        
        const artists: IArtistWithAlbums | undefined = await artistWithRelationshipService.getById(1)

        console.log(`
                    esperado: ${JSON.stringify(expected)}
                    dados vindos do banco: ${JSON.stringify(artists)}
                `)

        expect(artists).toEqual(expected)

    })

    it('error case: deve dar erro pois id passado não é um number ', async () => {
        
        try
        {
            await artistWithRelationshipService.getById('1a' as any)

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

    it('error case: deve dar undefined pois não tem artista com o id 1 no banco ', async () => {
        await albumService.delete(1)
        await albumService.delete(2)
        await artistService.delete(1)

        const artists = await artistWithRelationshipService.getAll()

         const artist = await artistWithRelationshipService.getById(1)

        console.log(`
                    deve retornar undefined
                    dados no banco: ${JSON.stringify(artists)}
                    dados retornados: ${JSON.stringify(artist)}
        `)

        expect(artist).toBe(undefined)
    })

    it('error case: deve retornar array vazio pois não possuem artistas no banco ', async () => {
        await albumService.delete(3)
        await artistService.delete(2)

         const artists = await artistWithRelationshipService.getAll()

        console.log(`
                    deve retornar array vazio
                    dados retornados: ${JSON.stringify(artists)}
        `)

        expect(artists).toEqual([])
    })
})