import { Request, Response } from "express";
import { CrudController } from "./crudController";

/**
 * A logging wrapper for CrudController that logs all incoming requests
 * before delegating to the underlying controller.
 */
export class LoggingCrudController {
  private controller: CrudController;

  constructor(controller: CrudController) {
    this.controller = controller;
  }

  /**
   * Logs request details before calling the underlying method.
   */
  private logRequest(methodName: string, req: Request) {
    console.log(`[${new Date().toISOString()}] ${methodName}:`, {
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body,
    });
  }

  findMany = (req: Request, res: Response) => {
    this.logRequest("findMany", req);
    return this.controller.findMany(req, res);
  };

  update = (req: Request, res: Response) => {
    this.logRequest("update", req);
    return this.controller.update(req, res);
  };

  deleteMany = (req: Request, res: Response) => {
    this.logRequest("deleteMany", req);
    return this.controller.deleteMany(req, res);
  };

  delete = (req: Request, res: Response) => {
    this.logRequest("delete", req);
    return this.controller.delete(req, res);
  };

  create = (req: Request, res: Response) => {
    this.logRequest("add", req);
    return this.controller.create(req, res);
  };
}
