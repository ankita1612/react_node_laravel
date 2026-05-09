import { Request, Response, NextFunction } from "express";
import { employeeService } from "../services/employee.service";
import  IEmployee  from "../interface/employee.interface";
import Employee from "../models/employee.model"
import { Types } from "mongoose";
import path from "path";
import  ApiError  from "../utils/api.error";
  interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}
  
import fs from "fs";
class EmployeeController {
  addEmployee = async (req: Request<{}, {}, IEmployee>, res: Response, next: NextFunction): Promise<void> => {    
    try {
        const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      
      let singleImagePath = files?.single_image ? files.single_image[0].path : "";    
      const multiImagePaths = files?.multiple_image ? files.multiple_image.map(file => file.path.replace(/\\/g, "/")): [];

      singleImagePath= singleImagePath.replace(/\\/g, "/")
           
      const employee = await employeeService.createEmployee({
          ...req.body,                  
          single_image: singleImagePath,
          multiple_image: multiImagePaths,
          DOB: req.body.DOB,
      });
      res.status(201).json({"success":true,"message":"Employee created successfully","data":employee});
    } catch (error) {
      next(error);
    }
  };

  getEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {     
      const employees = await employeeService.getEmployees();
      res.status(200).json({"success":true,"message":"","data":employees});
    } catch (error) {
      next(error);
    }
  };

  getEmployee = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;     
      const employee = await employeeService.getEmployee(id);      
      res.status(200).json({success: true,data: employee,});
    } catch (error) {
      next(error); 
    }
};



updateEmployee = async (  req: Request<{ id: string }, {}, any>,  res: Response,  next: NextFunction): Promise<void> => {
  try {
    const files = req.files as MulterFiles | undefined;

    // 📸 Single Image
    let singleImagePath: string = files?.single_image?.[0]?.path.replace(/\\/g, "/") || "";

    // 🖼 Multiple New Uploads
    const multiImagePaths: string[] = files?.multiple_image
      ? files.multiple_image.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const existingEmployee = await Employee.findById(req.params.id);
    if (!existingEmployee) {
      return next(new ApiError("Employee not found", 404));
    }

    // 👇 Old images user decided to KEEP
    const existingImages: string[] = JSON.parse(req.body.existingImages || "[]");

    // 👇 Final images list
    const updatedImages: string[] = [...existingImages, ...multiImagePaths];

    const dbImages: string[] = existingEmployee.multiple_image || [];

const removedImages: string[] = dbImages.filter(
  (img) => !existingImages.includes(img)
);

    // 🗑 Remove deleted files from disk
    removedImages.forEach((img) => {
      const fullPath = path.join(process.cwd(), img);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Failed to delete:", fullPath);
      });
    });

    const employee = await employeeService.updateEmployee(req.params.id, {
      ...req.body,
      single_image: singleImagePath || existingEmployee.single_image,
      multiple_image: updatedImages,
      DOB: req.body.DOB,
    });

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

  deleteEmployee = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {     
      await employeeService.deleteEmployee(req.params.id);     
      res.status(200).json({"success":true,"message":"Employee deleted successfully","data":[]});
    } catch (error) {
      next(error);
    }
  };
  staticResult  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {     
      
      const data=[{"Jan":100},{"feb":200},{"march":300},{"April":400},{"May":500}]
      res.status(200).json({"success":true,"message":"success","data":data});
    } catch (error) {
      next(error);
    }
  };
  
}
export const employeeController = new EmployeeController();
