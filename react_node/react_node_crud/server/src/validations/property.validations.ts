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
  body("property_owner").notEmpty(),
  body("property_address").notEmpty(),
];
export const validateEdit = [
    body("property_name").notEmpty(),
  body("property_detail").notEmpty(),
  body("property_type").isIn(["Residential", "Commercial"]),
  body("property_owner").notEmpty(),
  body("property_address").notEmpty(),
];
export const isRequestValidated = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 422);             
  }
  next();
};

