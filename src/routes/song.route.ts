import express from "express"
import { RoutesDataValidator } from "../middlewares/data-validator.middleware"
import { songSchemaValidate, songUpdateSchemaValidate } from "../models/song.model"
import songController from "../factories/controllers/song.controller.factory"
import { idSchemaValidate } from "../models/global.model"



export const songRoutes: express.Router = express.Router()

songRoutes.get('/', songController.getAll.bind(songController))
songRoutes.get('/:id',RoutesDataValidator.paramsValidator(idSchemaValidate), songController.getById.bind(songController))
songRoutes.post('/', RoutesDataValidator.bodyValidator(songSchemaValidate), songController.create.bind(songController))
songRoutes.put('/:id',  RoutesDataValidator.paramsValidator(idSchemaValidate),  RoutesDataValidator.bodyValidator(songUpdateSchemaValidate), songController.update.bind(songController))
songRoutes.delete('/:id', RoutesDataValidator.paramsValidator(idSchemaValidate), songController.delete.bind(songController))
