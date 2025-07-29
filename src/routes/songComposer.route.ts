import express from "express"
import { RoutesDataValidator } from "../middlewares/data-validator.middleware"
import songComposerController from "../factories/controllers/songComposer.controller.factory"
import { songComposerSchemaValidate } from "../models/songComposer.model"



export const songComposerRoutes: express.Router = express.Router()

songComposerRoutes.post('/',  RoutesDataValidator.bodyValidator(songComposerSchemaValidate), songComposerController.create.bind(songComposerController))
songComposerRoutes.delete('/', RoutesDataValidator.bodyValidator(songComposerSchemaValidate),  songComposerController.delete.bind(songComposerController))
