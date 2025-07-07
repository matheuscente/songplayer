import { iId, iName } from "./global.model"

export type ClientArtist = {
    nationality: string
} & iName



//artista armarzenado no database
export type DatabaseArtist = ClientArtist & iId