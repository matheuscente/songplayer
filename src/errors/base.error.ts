import { Response } from "express";

export class ErrorBase extends Error {
  constructor(protected status: number, message: string) {
    super (message);
  }

  send(res: Response) {
    res.status(this.status).json({message: this.message})
  }
}

