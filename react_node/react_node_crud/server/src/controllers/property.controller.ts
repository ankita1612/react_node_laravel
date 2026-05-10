import { Request, Response, NextFunction } from "express";
import Property from "../models/property.model";
import ApiError from "../utils/api.error";
import fs from "fs";
import path from "path";

class PropertyController {
  // =========================
  // ADD PROPERTY
  // =========================
 addProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const brochure =
      files?.brochure?.[0]?.path.replace(/\\/g, "/") || "";

    const photos =
      files?.photos?.map((file) =>
        file.path.replace(/\\/g, "/")
      ) || [];

    // amenities array
    let amenities =
      req.body.amenities || [];

    if (!Array.isArray(amenities)) {
      amenities = [amenities];
    }

    const propertyData: any = {
      property_name: req.body.property_name,

      property_detail: req.body.property_detail,

      property_type: req.body.property_type,

      owner_id: req.body.owner_id,

      property_address: req.body.property_address,

      amenities,

      brochure,

      photos,
    };

    // only residential
    if (
      req.body.property_type === "Residential" &&
      req.body.property_size
    ) {
      propertyData.property_size =
        req.body.property_size;
    }

    const property =
      await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

  // =========================
  // GET PROPERTIES
  // SEARCH + SORT + PAGINATION
  // =========================
  getProperties = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page =
        parseInt(req.query.page as string) || 1;

      const perPage =
        parseInt(req.query.per_page as string) || 10;

      const search =
        (req.query.search as string) || "";

      const sortBy =
        (req.query.sort_by as string) ||
        "createdAt";

      const sortOrder =
        (req.query.sort_order as "asc" | "desc") ||
        "desc";

      const skip = (page - 1) * perPage;

      // SEARCH FILTER
      const filter: any = {};

      if (search) {
        filter.$or = [
          {
            property_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            property_address: {
              $regex: search,
              $options: "i",
            },
          },
          {
            property_type: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      // SORT
      const sort: any = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };

      const [properties, total] =
        await Promise.all([
          Property.find(filter)
            .populate("owner_id")            
            .sort(sort)
            .skip(skip)
            .limit(perPage),

          Property.countDocuments(filter),
        ]);

      res.status(200).json({
        success: true,
        message: "Properties fetched successfully",
        data: {
          data: properties,
          current_page: page,
          per_page: perPage,
          total,
          last_page: Math.ceil(total / perPage),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // GET SINGLE PROPERTY
  // =========================
  getProperty = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const property =
        await Property.findById(req.params.id)
          .populate("owner_id")
          .populate("amenities");

      if (!property) {
        return next(
          new ApiError("Property not found", 404),
        );
      }

      res.status(200).json({
        success: true,
        message: "Property fetched successfully",
        data: property,
      });
    } catch (error) {
      next(error);
    }
  };

  // =========================
  // UPDATE PROPERTY
  // =========================
  updateProperty = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const property =
      await Property.findById(req.params.id);

    if (!property) {
      return next(
        new ApiError("Property not found", 404)
      );
    }

    let amenities =
      req.body.amenities || [];

    if (!Array.isArray(amenities)) {
      amenities = [amenities];
    }

    const updateData: any = {
      property_name: req.body.property_name,

      property_detail: req.body.property_detail,

      property_type: req.body.property_type,

      owner_id: req.body.owner_id,

      property_address: req.body.property_address,

      amenities,
    };

    // residential only
    if (
      req.body.property_type === "Residential" &&
      req.body.property_size
    ) {
      updateData.property_size =
        req.body.property_size;
    } else {
      updateData.property_size = undefined;
    }

    // brochure
    if (files?.brochure?.[0]) {
      if (property.brochure) {
        const oldPath = path.join(
          process.cwd(),
          property.brochure
        );

        fs.unlink(oldPath, () => {});
      }

      updateData.brochure =
        files.brochure[0].path.replace(
          /\\/g,
          "/"
        );
    }
    
   // photos
    if (files?.photos?.length) {
      const newPhotos =
        files.photos.map((file) =>
          file.path.replace(/\\/g, "/")
        );

      updateData.photos = [
        ...property.photos,
        ...newPhotos,
      ];
    }

    const updatedProperty =
      await Property.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("owner_id");

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

  // =========================
  // DELETE PROPERTY
  // =========================
  deleteProperty = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const property =
        await Property.findById(req.params.id);

      if (!property) {
        return next(
          new ApiError("Property not found", 404),
        );
      }

      // DELETE BROCHURE
      if (property.brochure) {
        const brochurePath = path.join(
          process.cwd(),
          property.brochure,
        );

        fs.unlink(brochurePath, (err) => {
          if (err)
            console.error(
              "Failed to delete brochure",
            );
        });
      }

      // DELETE PHOTOS
      if (
        property.photos &&
        property.photos.length > 0
      ) {
        property.photos.forEach((photo: string) => {
          const photoPath = path.join(
            process.cwd(),
            photo,
          );

          fs.unlink(photoPath, (err) => {
            if (err)
              console.error(
                "Failed to delete image",
              );
          });
        });
      }

      await Property.findByIdAndDelete(
        req.params.id,
      );

      res.status(200).json({
        success: true,
        message: "Property deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const propertyController =
  new PropertyController();