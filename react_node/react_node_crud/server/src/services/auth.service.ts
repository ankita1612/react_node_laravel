import User from "../models/user.model";
import IUser, { ILoginResponse, ILogin } from "../interface/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/api.error";

export class AuthService {
  async register(data: IUser): Promise<IUser> {
    const result = await User.findOne({ email: data.email });

    if (result) {
      throw new ApiError("User with email already exist", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      DOB: data.DOB,
      profile_image: data.profile_image,
    });

    return user;
  }
  
  async login(data: ILogin): Promise<ILoginResponse> {
    const user = await User.findOne({
      email: data.email,
      role: { $in: ["Admin", "User"] },
    });

    if (!user) {
      throw new ApiError("User not exist", 404);
    }

    const passwordMatched = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new ApiError("Invalid password", 401);
    }

    if (!process.env.ACCESS_SECRET) {
      throw new ApiError("ACCESS_SECRET not configured", 500);
    }

    const adminToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "1d" },
    );

    const userObj = user.toObject();

    delete (userObj as any).password;

    return {
      user: userObj,
      adminToken,
    };
  }
}

export const authService = new AuthService();