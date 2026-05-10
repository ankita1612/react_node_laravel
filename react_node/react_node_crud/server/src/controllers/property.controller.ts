import { Request, Response, NextFunction } from "express";
import { employeeService } from "../services/employee.service";
//import  IEmployee  from "../interface/property.interface";
//import Employee from "../models/property.model"
import { Types } from "mongoose";
import path from "path";
import  ApiError  from "../utils/api.error";
import Property from "../models/property.model";

class PropertyController {
  addProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = req.files as any;

      const brochure =
        files?.brochure?.[0]?.path.replace(/\\/g, "/") || "";

      const photos =
        files?.photos?.map((x: any) =>
          x.path.replace(/\\/g, "/")
        ) || [];

      const property = await Property.create({
        ...req.body,
        brochure,
        photos,
      });

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property,
      });
    } catch (error) {
      next(error);
    }
  };

  getProperties = async (
    req: Request,
    res: Response
  ) => {
    const properties = await Property.find()
      .populate("property_owner")
      .populate("amenities");

    res.json({
      success: true,
      data: properties,
    });
  };

  getProperty = async (
    req: Request,
    res: Response
  ) => {
    const property = await Property.findById(req.params.id)
      .populate("property_owner")
      .populate("amenities");

    res.json({
      success: true,
      data: property,
    });
  };

  updateProperty = async (
    req: Request,
    res: Response
  ) => {
    const files = req.files as any;

    const updateData: any = {
      ...req.body,
    };

    if (files?.brochure) {
      updateData.brochure =
        files.brochure[0].path.replace(/\\/g, "/");
    }

    if (files?.photos) {
      updateData.photos =
        files.photos.map((x: any) =>
          x.path.replace(/\\/g, "/")
        );
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: property,
    });
  };

  deleteProperty = async (
    req: Request,
    res: Response
  ) => {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  };
}

export const propertyController =  new PropertyController();