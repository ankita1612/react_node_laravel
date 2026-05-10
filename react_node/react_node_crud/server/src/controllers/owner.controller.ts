import { Request, Response, NextFunction } from "express";
import Owner from "../models/owner.model";

class OwnerController {
  getOwners = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const owners = await Owner.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        message: "Owners fetched successfully",
        data: owners,
      });
    } catch (error) {
      next(error);
    }
  };

  seedOwners = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const count = await Owner.countDocuments();

      if (count === 0) {
        await Owner.insertMany([
          { name: "Rahul Sharma" },
          { name: "Amit Patel" },
          { name: "Priya Shah" },
          { name: "Neha Joshi" },
        ]);
      }

      res.status(200).json({
        success: true,
        message: "Owners seeded successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const ownerController =
  new OwnerController();