import express from "express"
import { RoutesDataValidator } from "../middlewares/data-validator.middleware"
import { composerSchemaValidate, composerUpdateSchemaValidate } from "../models/composer.model"
import composerController from "../factories/controllers/composer.controller.factory"
import { idSchemaValidate } from "../models/global.model"




export const composerRoutes: express.Router = express.Router()

composerRoutes.get('/', composerController.getAll.bind(composerController))
composerRoutes.get('/:id',RoutesDataValidator.paramsValidator(idSchemaValidate), composerController.getById.bind(composerController))
composerRoutes.post('/', RoutesDataValidator.bodyValidator(composerSchemaValidate), composerController.create.bind(composerController))
composerRoutes.put('/',  RoutesDataValidator.bodyValidator(composerUpdateSchemaValidate), composerController.update.bind(composerController))
composerRoutes.delete('/:id', RoutesDataValidator.paramsValidator(idSchemaValidate), composerController.delete.bind(composerController))
