import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Employee from "../models/employee.model";
import  ApiError  from "../utils/api.error";
import { param } from "express-validator";

export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID"),
];
export const validateAdd = [
  body("title").notEmpty().withMessage("Title is required"),
 
];
export const validateEdit = [
  body("title").notEmpty().withMessage("Title is required"),
 
];
export const isRequestValidated = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 422);             
  }
  next();
};
