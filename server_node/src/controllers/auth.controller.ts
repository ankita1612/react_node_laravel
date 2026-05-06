import { Request, Response, NextFunction } from "express";
import {authService} from "../services/auth.service";
import IUser, {ILogin} from "../interface/user.interface";
import  ApiError  from "../utils/api.error";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  //secure: true work on https only
  sameSite: "lax" as const,
  path: "/", 
};
class AuthController {
    register = async (req: Request<{}, {},IUser>, res: Response, next: NextFunction): Promise<void> => {
      try {        
        const user = await authService.register({
            ...req.body,
            profile_image: req.file?.path
        });
        res.status(201).json({"success":true,"message":"You are register successfully. Please Login","data":user});
      } catch (error : any) {        
        next(error);
      }
    };    
    
    login = async (req: Request<{}, {},ILogin>, res: Response, next: NextFunction): Promise<void> => {
        try {
          const response = await authService.login(req.body);
          const { user, accessToken, refreshToken } = response as { user: any; accessToken: string; refreshToken: string };

          res.cookie("refreshToken", refreshToken, cookieOptions);
          res.status(200).json({"success":true,"message":"Login successfully","data":{ user, accessToken }});

        } catch (error:any) {         
          next(error);
        }
      };
    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{    
      try {
        const token = req.cookies?.refreshToken;
          if (!token) 
            return next(new ApiError("No refresh token", 401));

        const accessToken = await  authService.refreshAccessToken(token);
        res.status(200).json({"success":true,"accessToken":accessToken});
      } catch (err) {
        next(err);
      }
    }
    logout = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        await authService.logout(refreshToken);
        res.clearCookie("refreshToken", cookieOptions);
        return res.status(200).json({ success: true });
      } catch (err) {
          next(err);
      }
    }
}
export const authController = new AuthController();
