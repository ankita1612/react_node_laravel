import { Request, Response, NextFunction } from "express";
import { employeeService } from "../services/employee.service";
import  IEmployee  from "../interface/property.interface";
import Employee from "../models/property.model"
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
      
      let profileImagePath = files?.profile_image ? files.profile_image[0].path : "";    
      const logoPath = files?.logo ? files.logo[0].path : "";

      profileImagePath = profileImagePath.replace(/\\/g, "/");
      const logoPathFormatted = logoPath.replace(/\\/g, "/");
           
      const employee = await employeeService.createEmployee({
          ...req.body,                  
          profile_image: profileImagePath,
          logo: logoPathFormatted,
          dob: req.body.dob,
      });
      res.status(201).json({"success":true,"message":"Employee created successfully","data":employee});
    } catch (error) {
      next(error);
    }
  };

  getEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 10;
      const search = (req.query.search as string) || "";
      const sortBy = (req.query.sort_by as string) || "createdAt";
      const sortOrder = (req.query.sort_order as "asc" | "desc") || "desc";

      const result = await employeeService.getEmployees(page, perPage, search, sortBy, sortOrder);
      res.status(200).json({
        "success": true,
        "message": "Employees fetched successfully",
        "data": result
      });
    } catch (error) {
      next(error);
    }
  };

  getEmployee = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;     
      const employee = await employeeService.getEmployee(id);      
      res.status(200).json({success: true, message: "Employee fetched successfully", data: employee});
    } catch (error) {
      next(error); 
    }
};



updateEmployee = async (  req: Request<{ id: string }, {}, any>,  res: Response,  next: NextFunction): Promise<void> => {
  try {
    const files = req.files as MulterFiles | undefined;

    // 📸 Profile Image
    let profileImagePath: string = files?.profile_image?.[0]?.path.replace(/\\/g, "/") || "";

    // 🖼 Logo
    let logoPath: string = files?.logo?.[0]?.path.replace(/\\/g, "/") || "";

    const existingEmployee = await Employee.findById(req.params.id);
    if (!existingEmployee) {
      return next(new ApiError("Employee not found", 404));
    }

    // Delete old profile image if a new one is uploaded
    if (profileImagePath && existingEmployee.profile_image) {
      const fullPath = path.join(process.cwd(), existingEmployee.profile_image);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Failed to delete:", fullPath);
      });
    }

    // Delete old logo if a new one is uploaded
    if (logoPath && existingEmployee.logo) {
      const fullPath = path.join(process.cwd(), existingEmployee.logo);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Failed to delete:", fullPath);
      });
    }

    const employee = await employeeService.updateEmployee(req.params.id, {
      ...req.body,
      profile_image: profileImagePath || existingEmployee.profile_image,
      logo: logoPath || existingEmployee.logo,
      dob: req.body.dob,
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
