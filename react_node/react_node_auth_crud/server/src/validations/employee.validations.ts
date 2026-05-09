import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Employee from "../models/employee.model";
import  ApiError  from "../utils/api.error";
import { param } from "express-validator";

export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID"),
];
export const validateAdd = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("salary").isNumeric().withMessage("Salary must be a number"),
  body("dob").isISO8601().withMessage("DOB must be a valid date"),
  body("description").notEmpty().withMessage("Description is required"),
  body("hobbies").notEmpty().withMessage("Hobbies is required"),
  body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),
];
export const validateEdit = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("salary").isNumeric().withMessage("Salary must be a number"),
  body("dob").isISO8601().withMessage("DOB must be a valid date"),
  body("description").notEmpty().withMessage("Description is required"),
  body("hobbies").notEmpty().withMessage("Hobbies is required"),
  body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),
];
export const isRequestValidated = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 422);             
  }
  next();
};

