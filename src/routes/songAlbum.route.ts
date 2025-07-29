import express from "express"
import { RoutesDataValidator } from "../middlewares/data-validator.middleware"
import songAlbumController from "../factories/controllers/songAlbum.controller.factory"
import { songAlbumSchemaValidate } from "../models/songAlbum.model"

export const songAlbumRoutes: express.Router = express.Router()

songAlbumRoutes.post('/',  RoutesDataValidator.bodyValidator(songAlbumSchemaValidate), songAlbumController.create.bind(songAlbumController))
songAlbumRoutes.delete('/', RoutesDataValidator.bodyValidator(songAlbumSchemaValidate),  songAlbumController.delete.bind(songAlbumController))
