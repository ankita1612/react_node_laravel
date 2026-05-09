import Employee from "../models/employee.model";
import  IEmployee  from "../interface/employee.interface";
import  ApiError  from "../utils/api.error";
import { Types } from "mongoose";

export class EmployeeService {
  async createEmployee(data: IEmployee): Promise<IEmployee> {
    return Employee.create({
      title: data.title,
      single_image:data.single_image,
      multiple_image: data.multiple_image,    
      DOB:data.DOB
    });
  }

  async getEmployees(): Promise<IEmployee[]> {
    return Employee.find().sort({_id:-1});
  }

  async getEmployee(id: string): Promise<IEmployee | null> {   
    if (!Types.ObjectId.isValid(id)) { 
            throw new ApiError("Invalid employee id", 400);            
    }
    const employee = await Employee.findById(id);
    if (!employee) {        
            throw new ApiError("Employee not found", 404);
    }
    return employee;
  }

  async updateEmployee(id: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
    if (!Types.ObjectId.isValid(id)) { 
       throw new ApiError("Invalid employee id", 400);            
    }
    const employee = Employee.findByIdAndUpdate(
      id,
      {
        title: data.title,
        DOB: data.DOB,
        ...(data.single_image && { single_image: data.single_image }),
        ...(data.multiple_image && { multiple_image: data.multiple_image }),
      },
      { new: true }
    );   
    if (!employee) {
          throw new ApiError("Employee not found", 404);
        }
    return employee;
  }

  // delete employee
  async deleteEmployee(id: string): Promise<IEmployee | null> {
    if (!Types.ObjectId.isValid(id)) { 
      throw new ApiError("Invalid employee id", 400);            
    }
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
       throw new ApiError("Post not found", 404);
    }
    return employee
  } 
}
export const employeeService = new EmployeeService();
