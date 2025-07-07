import { iId } from "./global.model"

export interface ClientSongAlbum {
    musicId: number,
    albumId: number 
}

export type DatabaseSongAlbum = ClientSongAlbum & iId