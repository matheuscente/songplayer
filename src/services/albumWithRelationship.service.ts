
import { InternalServerError } from "../errors/internal-server.error";
import { ValidationError } from "../errors/validation.error";
import { IAlbumService } from "../models/album.model";
import { IAlbumWithArtistAndSongs, IGetAlbumWithRelationshipService } from "../models/getAlbumsWithRelationship.model";
import { IGetArtistWithRelationshipService } from "../models/getArtistsWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import { ISongService } from "../models/song.model";
import { ISongAlbum, ISongAlbumService } from "../models/songAlbum.model";
import DataValidator from "../utils/dataValidator.utils";
import TimeConverter from "../utils/timeConverter.utils";

class AlbumWithRelationship implements IGetAlbumWithRelationshipService {

    private artistsWithRelationship!: IGetArtistWithRelationshipService
    private albumService!: IAlbumService
    private songAlbumService!: ISongAlbumService
    private songService!: ISongService
    
    setDependencies(
    artistsWithRelationship: IGetArtistWithRelationshipService,
    albumService: IAlbumService,
    songAlbumService: ISongAlbumService,
    songService: ISongService
    ): void {
        this.artistsWithRelationship = artistsWithRelationship,
        this.albumService = albumService,
        this.songAlbumService = songAlbumService
        this.songService = songService
    }

    async getAll(): Promise<IAlbumWithArtistAndSongs[]> {
        const albums = await this.albumService.getAll()

        //se albums não existir já retorna array vazio
        if(albums.length === 0) return [] as IAlbumWithArtistAndSongs[]

        const returnAlbums = await Promise.all(albums.map(async (album) => this.getById(album.id)))

        return returnAlbums.filter((item):item is IAlbumWithArtistAndSongs => item !== undefined)
    }

    async getById(albumId: number): Promise<IAlbumWithArtistAndSongs | undefined> {
        DataValidator.validator(idSchemaValidate, {id: albumId})

        const album = await this.albumService.getById(albumId)

        //se album não existir já retorna undefined
        if(!album) return undefined

        const artist = await this.artistsWithRelationship.getById(album.artist_id)

        //se artista não existir retorna exessão pois regra de negócio diz que artista é obrigatório
        if(!artist) throw new ValidationError('album sem artista cadastrado')

        //encontra as musicas relacionadas de acordo com o id do album
        const relations: ISongAlbum[] = await this.songAlbumService.getByAlbumId(albumId)

        //retorna album caso não possuir musicas
        if(relations.length === 0) return {...album, artist: artist, songs: []}

        //joga os ids das musicas em um array para retorno
        const songs: number[] = relations.map(item => item.song_id)

        //numero total de musicas
        const songsNumber = songs.length

        //cria um array com a duração das musicas relacionadas em milissegundos
        const durations = await Promise.all(songs.map(async (song) => {
            const data = await this.songService.getById(song)
            const songDuration = data?.duration
            if(!songDuration) {
                throw new InternalServerError('música sem duração')
            }
            return  TimeConverter.timeToMilliseconds(songDuration as string)
        }))

        //soma todas as durações das musicas relacionadas
        const albumDuration = durations.reduce((acc, current) => acc + current, 0)

        //retorna objeto completo
        return {...album, artist: artist, songs: songs, duration: TimeConverter.millisecondsToTime(albumDuration), songs_number: songsNumber}
    }
    
}

export default AlbumWithRelationship