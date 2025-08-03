
import { IAlbumService } from "../models/album.model";
import { IArtistService } from "../models/artist.model";
import { IGetArtistWithRelationshipService, IArtistWithAlbums } from "../models/getArtistsWithRelationship.model";
import { idSchemaValidate } from "../models/global.model";
import DataValidator from "../utils/dataValidator.utils";

class ArtistWithRelationship implements IGetArtistWithRelationshipService {
    private artistService!: IArtistService
    private albumService!: IAlbumService

    setDependencies(
    artistService: IArtistService,
    albumService: IAlbumService,
    ): void {
        this.artistService = artistService,
        this.albumService = albumService
    }

    async getAll(): Promise<IArtistWithAlbums[]> {

        const artists = await this.artistService.getAll()

        if(artists.length === 0) return []

        const returnArtists = await Promise.all(
            artists.map((artist) => this.getById(artist.id))
        )
        
        return returnArtists.filter((item): item is IArtistWithAlbums => item !== undefined)
        
    }

    async getById(artistId: number): Promise<IArtistWithAlbums | undefined> {
        DataValidator.validator(idSchemaValidate, {id: artistId})

        const artist = await this.artistService.getById(artistId)

        if(!artist) return undefined

        //retorna todos os albums relacionados com o artista
        const albums = await this.albumService.getByArtistId(artistId)

        if(albums.length === 0) return {...artist, albums: []}

        const albumsIds: number[] = albums.map((album) => album.id)

        return {...artist, albums: albumsIds}
    }

}

export default ArtistWithRelationship