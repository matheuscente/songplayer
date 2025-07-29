import { songRoutes } from "./song.route";
import { composerRoutes } from "./composer.route";
import { artistRoutes } from "./artist.route";
import { albumRoutes } from "./album.route";


import express, { Router } from "express"
import { songAlbumRoutes } from "./songAlbum.route";
import { songComposerRoutes } from "./songComposer.route";

export const routes = (app: express.Express) => {
    app.use(express.json())
    
    const api = Router()
    api.use('/song', songRoutes)
    api.use('/composer', composerRoutes)
    api.use('/artist', artistRoutes)
    api.use('/album', albumRoutes)
    api.use('/songAlbum', songAlbumRoutes)
    api.use('/songComposer', songComposerRoutes)


    app.use('/api/v1', api)
}
