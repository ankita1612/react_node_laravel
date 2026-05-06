import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api.error";
import IUser from "../interface/user.interface";

interface AuthRequest extends Request {
  user?: any;
}

export const authentication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
  
    const token = req.cookies.adminToken;
console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user11" });
    }

    const decoded: any = jwt.verify(token, process.env.ACCESS_SECRET!);

    const user = await User.findOne({
  _id: decoded.id,
  deletedAt: null,
}).select("_id name email role");
console.log(user)
    if (
      !user ||
      (user.role !== "Admin" && user.role !== "User")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    req.user = user;

    next();
  } catch (error: any) {
  console.error(error); // log full error in backend

    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authentication;