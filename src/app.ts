import express from 'express'
import { ErrorHandler } from './middlewares/error-handler.middleware'
import { PageNotFoundMiddleware } from './middlewares/page-not-found-middleware'
import { routes } from './routes'
import setupDependencies from './factories/services/setDependencies.factory'

const app = express()
setupDependencies()
routes(app)
PageNotFoundMiddleware.PageNotFound(app)
ErrorHandler.handler(app)

export default app