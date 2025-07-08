import express, { Response, Request, NextFunction } from "express";
import { NotFoundError } from "../errors/not-found.error";

export abstract class PageNotFoundMiddleware {
  static PageNotFound(app: express.Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      next(new NotFoundError("página não encontrada"));
    });
  }
}
