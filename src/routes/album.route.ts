import express from "express"
import { RoutesDataValidator } from "../middlewares/data-validator.middleware"
import { albumSchemaValidate, albumUpdateSchemaValidate } from "../models/album.model"
import albumController from "../factories/controllers/album.controller.factory"
import { idSchemaValidate } from "../models/global.model"



export const albumRoutes: express.Router = express.Router()

albumRoutes.get('/', albumController.getAll.bind(albumController))
albumRoutes.get('/:id',RoutesDataValidator.paramsValidator(idSchemaValidate), albumController.getById.bind(albumController))
albumRoutes.post('/', RoutesDataValidator.bodyValidator(albumSchemaValidate), albumController.create.bind(albumController))
albumRoutes.put('/',  RoutesDataValidator.bodyValidator(albumUpdateSchemaValidate), albumController.update.bind(albumController))
albumRoutes.delete('/:id', RoutesDataValidator.paramsValidator(idSchemaValidate), albumController.delete.bind(albumController))
