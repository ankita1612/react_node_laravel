import Employee from "../models/employee.model";
import  IEmployee  from "../interface/employee.interface";
import  ApiError  from "../utils/api.error";
import { Types } from "mongoose";

export class EmployeeService {
  async createEmployee(data: IEmployee): Promise<IEmployee> {
    return Employee.create({
      first_name: data.first_name,
      last_name: data.last_name,
      salary: data.salary,
      age: data.age,
      dob: data.dob,
      DOJ: data.DOJ,
      description: data.description,
      profile_image: data.profile_image,
      logo: data.logo,
      hobbies: data.hobbies,
      status: data.status
    });
  }

 async getEmployees(
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<any> {
  const skip = (page - 1) * perPage;

  let searchFilter: any = {};

  if (search) {
    searchFilter = {
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { hobbies: { $regex: search, $options: "i" } },
      ],
    };
  }

  const sortObject: any = {};
  sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;

  const total = await Employee.countDocuments(searchFilter);

  const employees = await Employee.find(searchFilter)
    .sort(sortObject)
    .skip(skip)
    .limit(perPage)
    .lean();

  return {
    data: employees,
    current_page: page,
    per_page: perPage,
    total,
    last_page: Math.ceil(total / perPage),
  };
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
    
    const updateData: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      salary: data.salary,
      age: data.age,
      dob: data.dob,
      DOJ: data.DOJ,
      description: data.description,
      hobbies: data.hobbies,
      status: data.status
    };

    // Only update image fields if provided
    if (data.profile_image) {
      updateData.profile_image = data.profile_image;
    }
    if (data.logo) {
      updateData.logo = data.logo;
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      updateData,
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
       throw new ApiError("Employee not found", 404);
    }
    return employee
  } 
}
export const employeeService = new EmployeeService();
