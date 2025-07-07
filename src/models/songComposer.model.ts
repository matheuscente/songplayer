import { iId } from "./global.model"

export interface ClientSongComposer {
    musicId: number,
    composerId: number,
    composition: string
}

export type DatabaseSongComposer = ClientSongComposer & iId