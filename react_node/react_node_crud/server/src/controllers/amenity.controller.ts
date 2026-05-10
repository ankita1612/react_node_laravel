import { Request, Response, NextFunction } from "express";
import Amenity from "../models/amenity.model";

class AmenityController {
  getAmenities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const amenities = await Amenity.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        message: "Amenities fetched successfully",
        data: amenities,
      });
    } catch (error) {
      next(error);
    }
  };

  seedAmenities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const count =
        await Amenity.countDocuments();

      if (count === 0) {
        await Amenity.insertMany([
          { name: "Parking" },
          { name: "Swimming Pool" },
          { name: "Gym" },
          { name: "Garden" },
          { name: "Lift" },
          { name: "Security" },
        ]);
      }

      res.status(200).json({
        success: true,
        message: "Amenities seeded successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const amenityController =
  new AmenityController();