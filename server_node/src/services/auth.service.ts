import User from "../models/user.model";
import RefreshToken from "../models/refresh.model";
import  IUser ,{ILoginResponse, ILogin}  from "../interface/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import  ApiError  from "../utils/api.error";
import crypto from "crypto";

export class AuthService {
  async register(data: IUser ): Promise<IUser> {
    const result  = await User.findOne({"email":data.email})
    if(result){      
      throw new ApiError("User with email already exist", 409);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    let user = await User.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      DOB: data.DOB,
      profile_image: data.profile_image
    });
    return user;
  }
  async login(data: ILogin ): Promise<ILoginResponse | null | String> {
    const user  = await User.findOne({"email":data.email})
    if(!user){        
        throw new ApiError("User not exist", 404);        
    }
    const passwordMatched = await bcrypt.compare(data.password, user.password );
    if(!passwordMatched){        
        throw new ApiError("Invalid password", 401);
    }

    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET  ) {
      throw new ApiError("ACCESS_SECRET or REFRESH_SECRET not configured",500);
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET!, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

  await RefreshToken.create({
    userId: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

    const userObj = user.toObject();
   // delete (userObj as any).password;

    return {
      user: userObj, "accessToken":accessToken,"refreshToken": refreshToken,
    };
  }


  async refreshAccessToken(incomingToken: string)  {
    if (!incomingToken) throw new ApiError("No refresh token", 401);

    const hashedToken = crypto.createHash("sha256").update(incomingToken).digest("hex");

    const stored = await RefreshToken.findOne({ token: hashedToken });
    if (!stored) throw new ApiError("Invalid session", 403);

    // Verify JWT integrity
    const decoded: any = jwt.verify(incomingToken, process.env.REFRESH_SECRET!);
    
    if (stored.expiresAt < new Date()) {
      throw new ApiError("Refresh token expired", 403);
    }

    const newAccessToken = jwt.sign({ id: decoded.id },process.env.ACCESS_SECRET!,{ expiresIn: "15m" });

    return newAccessToken;
  };

  async logout (refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await RefreshToken.deleteOne({ token: hashed });
  };
}
export const authService = new AuthService();