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

  getAll = (req: Request, res: Response) => {
    this.logRequest("getAll", req);
    return this.controller.getAll(req, res);
  };

  edit = (req: Request, res: Response) => {
    this.logRequest("edit", req);
    return this.controller.edit(req, res);
  };

  deleteAll = (req: Request, res: Response) => {
    this.logRequest("deleteAll", req);
    return this.controller.deleteAll(req, res);
  };

  delete = (req: Request, res: Response) => {
    this.logRequest("delete", req);
    return this.controller.delete(req, res);
  };

  add = (req: Request, res: Response) => {
    this.logRequest("add", req);
    return this.controller.add(req, res);
  };
}
