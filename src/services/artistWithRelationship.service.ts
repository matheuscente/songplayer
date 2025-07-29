
import { IAlbumService } from "../models/album.model";
import { IArtistService } from "../models/artist.model";
import { IGetArtistWithRelationshipService, IArtistWithAlbums } from "../models/getArtistsWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import DataValidator from "../utils/dataValidator.utils";

class ArtistWithRelationship implements IGetArtistWithRelationshipService {
    artistService!: IArtistService
    albumService!: IAlbumService

    setDependencies(
    artistService: IArtistService,
    albumService: IAlbumService,
    ): void {
        this.artistService = artistService,
        this.albumService = albumService
    }

    getAll(): IArtistWithAlbums[] {

        const artists = this.artistService.getAll()

        if(artists.length === 0) return [] as IArtistWithAlbums[]

        return artists.map((artist) => {
            return this.getById(artist.artistId)
           
        }).filter((item) => item !== undefined)
        
    }

    getById(artistId: number): IArtistWithAlbums | undefined {
        DataValidator.validator(idSchemaValidate, {id: artistId})

        const artist = this.artistService.getById(artistId)

        if(!artist) return undefined

        //retorna todos os albums relacionados com o artista
        const albums = this.albumService.getByArtistId(artistId)

        if(albums.length === 0) return {...artist, albums: []}

        const albumsIds: number[] = albums.map((album) => album.albumId)

        return {...artist, albums: albumsIds}
    }

}

export default ArtistWithRelationship