import { IGetAlbumWithRelationshipService } from "../models/getAlbumsWithRelationship.model";
import { IGetComposerWithRelationshipService } from "../models/getComposersWithRelationship.model";
import { ISongWithComposersAndAlbums, IGetSongWithRelationshipService } from "../models/getSongsWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import { IDatabaseSong, ISongService } from "../models/song.model";
import { ISongAlbum, ISongAlbumService } from "../models/songAlbum.model";
import { ISongComposer, ISongComposerService } from "../models/songComposer.model";
import DataValidator from "../utils/dataValidator.utils";


class SongWithRelationship implements IGetSongWithRelationshipService {
    
    songService!: ISongService
    albumWithRelationship!: IGetAlbumWithRelationshipService
    songAlbumService!: ISongAlbumService
    songComposerService!: ISongComposerService
    composerWithRelationship!: IGetComposerWithRelationshipService


    setDependencies(
    songService: ISongService,
    songAlbumService: ISongAlbumService,
    songComposerService: ISongComposerService,
    ): void {
        this.songService = songService,
        this.songAlbumService = songAlbumService,
        this.songComposerService = songComposerService
    }

    getAll(): ISongWithComposersAndAlbums[] {
        //busca todas as musicas
        const songs: IDatabaseSong[] = this.songService.getAll()

        //retorna array vazio caso não existir musicas
        if(songs.length === 0) return [] as ISongWithComposersAndAlbums[]

        //percore array de musicas e busca suas relações
        return songs.map((song) => {
            return this.getById(song.songId)
        }).filter((song) => song !== undefined)
    }

    getById(songId: number): ISongWithComposersAndAlbums | undefined {
        DataValidator.validator(idSchemaValidate, {id: songId})

        //busca a musica de acordo com o id
        const song: IDatabaseSong | undefined = this.songService.getById(songId)

        //se não achar musica já retorna undefined
        if(!song) return undefined

        //busca os albums relacionados
        const relationsAlbums: ISongAlbum[] = this.songAlbumService.getBySongId(songId)

        //busca os compositores relacionados
        const relationsComposers: ISongComposer[] = this.songComposerService.getBySongId(songId)

        //cria objeto de album de acordo com albuns relacionados
        const albums: number[] = relationsAlbums.map((item) => item.albumId)

        //cria objeto de composer de acordo com composers relacionados
        const composers = relationsComposers.map((item) => ({composerId: item.composerId, composition: item.composition}))
        //retorna objeto com todas as relações
        return {...song, composers: composers, albums: albums}

    }

}

export default SongWithRelationship