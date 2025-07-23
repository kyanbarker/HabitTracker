import { Request, Response } from "express";

interface CrudDelegate {
  findMany: () => Promise<any[]>;
  update: (args: any) => Promise<any>;
  deleteMany: () => Promise<any>;
  delete: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
}

export class CrudController {
  private delegate: CrudDelegate;

  constructor(delegate: CrudDelegate) {
    this.delegate = delegate;
  }

  /**
   * Handles errors for the given function `func`.
   * If an error occurs, it logs the error and sends a 500 response with the error.
   */
  private async handleError(
    req: Request,
    res: Response,
    func: (req: Request, res: Response) => Promise<void>
  ) {
    try {
      await func(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  /**
   * Sends a JSON response of all entries in the table.
   * `req` is ignored.
   */
  getAll = (req: Request, res: Response) => {
    this.handleError(req, res, async () => {
      const entries = await this.delegate.findMany();
      res.json(entries);
    });
  };

  /**
   * Updates an entry in the table.
   * `req` contains the id of the entry to update and the properties to update.
   * Sends a JSON response of the updated entry.
   */
  edit = (req: Request, res: Response) => {
    this.handleError(req, res, async () => {
      const { id } = req.params;
      const updateData = req.body; // Contains subset of properties to update

      const updatedEntry = await this.delegate.update({
        where: { id: Number(id) },
        data: updateData,
      });
      res.json(updatedEntry);
    });
  };

  /**
   * Deletes all entries in the table.
   * `req` is ignored.
   * Sends a 204 No Content response.
   */
  deleteAll = (req: Request, res: Response) => {
    this.handleError(req, res, async () => {
      await this.delegate.deleteMany();
      res.status(204).send();
    });
  };

  /**
   * Deletes a specific entry in the table.
   * `req` contains the id of the entry to delete.
   * Sends a 204 No Content response.
   */
  delete = (req: Request, res: Response) => {
    this.handleError(req, res, async () => {
      const { id } = req.params;
      await this.delegate.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    });
  };

  /**
   * Adds a new entry to the table.
   * `req` contains the properties of the new entry to add.
   * Sends a 201 Created response with the new entry in JSON format.
   */
  add = (req: Request, res: Response) => {
    this.handleError(req, res, async () => {
      const { name, eventValueOptions, eventValueType } = req.body;
      const newEntry = await this.delegate.create({
        data: {
          name,
          eventValueOptions,
          eventValueType,
        },
      });
      res.status(201).json(newEntry);
    });
  };
}
