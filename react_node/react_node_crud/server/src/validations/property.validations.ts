import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import  ApiError  from "../utils/api.error";
import { param } from "express-validator";

export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID"),
];
export const validateAdd = [
    body("property_name").notEmpty(),
  body("property_detail").notEmpty(),
  body("property_type").isIn(["Residential", "Commercial"]),
 body("owner_id")
  .notEmpty()
  .withMessage("Owner is required")
  .isMongoId()
  .withMessage("Invalid owner id"),
  body("property_address").notEmpty(),
  body("amenities")
  .optional()
  .isArray()
  .withMessage("Amenities must be array"),
];
export const validateEdit = [
    body("property_name").notEmpty(),
  body("property_detail").notEmpty(),
  body("property_type").isIn(["Residential", "Commercial"]),
 body("owner_id")
  .notEmpty()
  .withMessage("Owner is required")
  .isMongoId()
  .withMessage("Invalid owner id"),
  body("property_address").notEmpty(),
  body("amenities")
  .optional()
  .isArray()
  .withMessage("Amenities must be array"),
];
export const isRequestValidated = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 422);             
  }
  next();
};

