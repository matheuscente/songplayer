import express from "express"
import { RoutesDataValidator } from "../middlewares/data-validator.middleware"
import { artistSchemaValidate, artistUpdateSchemaValidate } from "../models/artist.model"
import artistController from "../factories/controllers/artist.controller.factory"
import { idSchemaValidate } from "../models/global.model"



export const artistRoutes: express.Router = express.Router()

artistRoutes.get('/', artistController.getAll.bind(artistController))
artistRoutes.get('/:id',RoutesDataValidator.paramsValidator(idSchemaValidate), artistController.getById.bind(artistController))
artistRoutes.post('/', RoutesDataValidator.bodyValidator(artistSchemaValidate), artistController.create.bind(artistController))
artistRoutes.put('/:id',  RoutesDataValidator.paramsValidator(idSchemaValidate),  RoutesDataValidator.bodyValidator(artistUpdateSchemaValidate), artistController.update.bind(artistController))
artistRoutes.delete('/:id', RoutesDataValidator.paramsValidator(idSchemaValidate), artistController.delete.bind(artistController))
