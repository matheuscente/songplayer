import { iId, Duration } from "./global.model"

export interface iAlbum {
    title: string,
    year: number,
    songsNumber: number,
    artistId: number
}



//album armarzenado no database
export type DatabaseAlbum = iAlbum & iId & Duration<number>

//album vindo do cliente
export type ClientAlbum = iAlbum & Duration<string>
