
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

    artistsWithRelationship!: IGetArtistWithRelationshipService
    albumService!: IAlbumService
    songAlbumService!: ISongAlbumService
    songService!: ISongService
    
    setDependencies(
    artistsWithRelationship: IGetArtistWithRelationshipService,
    albumService: IAlbumService,
    songAlbumService: ISongAlbumService,
    songService: ISongService
    ) {
        this.artistsWithRelationship = artistsWithRelationship,
        this.albumService = albumService,
        this.songAlbumService = songAlbumService
        this.songService = songService
    }

    getAll(): IAlbumWithArtistAndSongs[] {
        const albums = this.albumService.getAll()

        //se albums não existir já retorna array vazio
        if(albums.length === 0) return [] as IAlbumWithArtistAndSongs[]

        return albums.map((album) => {
            return this.getById(album.albumId)
        }).filter((item) => item !== undefined)
    }

    getById(albumId: number): IAlbumWithArtistAndSongs | undefined {
        DataValidator.validator(idSchemaValidate, {id: albumId})


        const album = this.albumService.getById(albumId)

        //se album não existir já retorna undefined
        if(!album) return undefined

        const artist = this.artistsWithRelationship.getById(album.artistId)

        //se artista não existir retorna exessão pois regra de negócio diz que artista é obrigatório
        if(!artist) throw new ValidationError('album sem artista cadastrado')

        //encontra as musicas relacionadas de acordo com o id do album
        const relations: ISongAlbum[] = this.songAlbumService.getByAlbumId(albumId)

        //retorna album caso não possuir musicas
        if(relations.length === 0) return {...album, artist: artist, songs: []}

        //joga os ids das musicas em um array para retorno
        const songs: number[] = relations.map(item => item.songId)

        let albumDuration: number = 0
        let songsNumber = 0
        songs.forEach((song) => {
            songsNumber = songsNumber + 1
            const songDuration = this.songService.getById(song)?.songDuration
            if(songDuration) {
                albumDuration =  TimeConverter.timeToMilliseconds(songDuration as string) + albumDuration

            } else throw new InternalServerError('música sem duração')
        })

        //retorna objeto completo
        return {...album, artist: artist, songs: songs, albumDuration: TimeConverter.millisecondsToTime(albumDuration), songsNumber: songsNumber}
    }
    
}

export default AlbumWithRelationship