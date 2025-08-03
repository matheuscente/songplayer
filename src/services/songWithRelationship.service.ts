import { ISongWithComposersAndAlbums, IGetSongWithRelationshipService } from "../models/getSongsWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import { IDatabaseSong, ISongService } from "../models/song.model";
import { ISongAlbum, ISongAlbumService } from "../models/songAlbum.model";
import { ISongComposer, ISongComposerService } from "../models/songComposer.model";
import DataValidator from "../utils/dataValidator.utils";


class SongWithRelationship implements IGetSongWithRelationshipService {
    private songService!: ISongService
    private songAlbumService!: ISongAlbumService
    private songComposerService!: ISongComposerService

    setDependencies(
    songService: ISongService,
    songAlbumService: ISongAlbumService,
    songComposerService: ISongComposerService,
    ): void {
        this.songService = songService,
        this.songAlbumService = songAlbumService,
        this.songComposerService = songComposerService
    }

    async getAll(): Promise<ISongWithComposersAndAlbums[]> {
        //busca todas as musicas
        const songs: IDatabaseSong[] = await this.songService.getAll()

        //retorna array vazio caso não existir musicas
        if(songs.length === 0) return []

        //percore array de musicas e busca suas relações
        const returnSongs = await Promise.all(
            songs.map((song) => this.getById(song.id))
        )

        return returnSongs.filter((song): song is ISongWithComposersAndAlbums => song !== undefined)
    }

    async getById(songId: number): Promise<ISongWithComposersAndAlbums | undefined>{
        DataValidator.validator(idSchemaValidate, {id: songId})

        //busca a musica de acordo com o id
        const song: IDatabaseSong | undefined = await this.songService.getById(songId)

        //se não achar musica já retorna undefined
        if(!song) return undefined

        //busca os albums relacionados
        const relationsAlbums: ISongAlbum[] = await this.songAlbumService.getBySongId(songId)

        //busca os compositores relacionados
        const relationsComposers: ISongComposer[] = await this.songComposerService.getBySongId(songId)

        //cria objeto de album de acordo com albuns relacionados
        const albums: number[] = relationsAlbums.map((item) => item.album_id)

        //cria objeto de composer de acordo com composers relacionados
        const composers = relationsComposers.map((item) => ({composerId: item.composer_id, composition: item.composition}))
        //retorna objeto com todas as relações
        return {...song, composers: composers, albums: albums}

    }

}

export default SongWithRelationship