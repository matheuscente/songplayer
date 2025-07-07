import { iId, Duration, iName } from "./global.model"

 type Song = {
    year: number
} & iName

//musica armarzenada no database
export type DatabaseSong = Song & iId & Duration<number>

//musica vinda do cliente
export type ClientSong = Song & Duration<string>
