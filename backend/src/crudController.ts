import { Request, Response } from "express";

interface CrudDelegate {
  findMany: (args?: any) => Promise<any[]>;
  update: (args: { where: { id: number }; data: any }) => Promise<any>;
  deleteMany: (args?: any) => Promise<any>;
  delete: (args: { where: { id: number } }) => Promise<any>;
  create: (args: { data: any }) => Promise<any>;
}

/**
 * A generic CRUD controller for handling basic operations on a Prisma model.
 * It provides methods to get all entries, add a new entry, edit an existing entry,
 * delete a specific entry, and delete all entries.
 */
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
    res: Response,
    func: () => Promise<void>
  ) {
    try {
      await func();
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  /**
   * Sends a JSON response of all entries in the table.
   */
  getAll = (_: Request, res: Response) => {
    this.handleError(res, async () => {
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
    this.handleError(res, async () => {
      const { id } = req.params;
      const updatedEntry = await this.delegate.update({
        where: { id: Number(id) },
        data: req.body, // Contains subset of properties to update
      });
      res.json(updatedEntry);
    });
  };

  /**
   * Deletes all entries in the table.
   * `req` contains the optional criteria to filter entries to delete.
   * Sends a 204 No Content response.
   */
  deleteAll = (req: Request, res: Response) => {
    this.handleError(res, async () => {
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
    this.handleError(res, async () => {
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
    this.handleError(res, async () => {
      const newEntry = await this.delegate.create({
        data: req.body,
      });
      res.status(201).json(newEntry);
    });
  };
}
