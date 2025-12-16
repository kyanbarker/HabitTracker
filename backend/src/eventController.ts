import { Request, Response } from "express";
import { CrudController, ICrudController } from "./crudController";
import { prisma } from "./prisma";

interface CrudDelegate {
  findMany: (args?: any) => Promise<any[]>;
  update: (args: { where: { id: number }; data: any }) => Promise<any>;
  deleteMany: (args?: any) => Promise<any>;
  delete: (args: { where: { id: number } }) => Promise<any>;
  create: (args: { data: any }) => Promise<any>;
}

export class EventController implements ICrudController {
  private crudController: CrudController;

  constructor(delegate: CrudDelegate) {
    this.crudController = new CrudController(delegate);
  }

  findMany = (req: Request, res: Response) => {
    this.crudController.findMany(req, res);
  };

  create = (req: Request, res: Response) => {
    this.crudController.create(req, res);
  };

  delete = (req: Request, res: Response) => {
    this.crudController.delete(req, res);
  };

  deleteMany = (req: Request, res: Response) => {
    this.crudController.deleteMany(req, res);
  };

  update = (req: Request, res: Response) => {
    (async () => {
      try {
        (async () => {
          const { seriesId } = req.body ?? {};
          if (seriesId != null) {
            const idNum = Number(seriesId);
            if (!Number.isFinite(idNum)) {
              res.status(400).json({ message: "seriesId must be a number" });
              return;
            }
            const exists = await prisma.series.findUnique({
              where: { id: idNum },
            });
            if (!exists) {
              res
                .status(400)
                .json({ message: `Target series ${idNum} does not exist` });
              return;
            }
          }
          this.crudController.update(req, res);
        })();
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    })();
  };
}
