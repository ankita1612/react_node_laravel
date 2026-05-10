import { Request, Response, NextFunction } from "express";
import {authService} from "../services/auth.service";
import IUser, {ILogin} from "../interface/user.interface";

class AuthController {
    register = async (req: Request<{}, {},IUser>, res: Response, next: NextFunction): Promise<void> => {
      try {        
        const user = await authService.register({
            ...req.body,
          //  profile_image: req.file?.path
        });
        res.status(201).json({"success":true,"message":"You are register successfully. Please Login","data":user});
      } catch (error : any) {        
        next(error);
      }
    };    
    
    login = async (
    req: Request<{}, {}, ILogin>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const response = await authService.login(req.body);
       const { user, adminToken } = response as {
        user: any;
        adminToken: string;
      };
        
      res.cookie("adminToken", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,        
      });

      res
        .status(200)
        .json({ success: true, message: "Login successfully", data: { user } });
    } catch (error: any) {
      next(error);
    }
  };
  profile = async (req: Request, res: Response) => {
    //res.json( req.user)
    res.status(200).json({
      success: true,
      data:  (req as any).user
    });
  };
    // refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{    
    //   try {
    //     const token = req.cookies?.refreshToken;
    //       if (!token) 
    //         return next(new ApiError("No refresh token", 401));

    //     const accessToken = await  authService.refreshAccessToken(token);
    //     res.status(200).json({"success":true,"accessToken":accessToken});
    //   } catch (err) {
    //     next(err);
    //   }
    // }
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        res.clearCookie("adminToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        res.status(200).json({
          success: true,
          message: "Logout successfully",
        });
      } catch (err) {
        next(err);
      }
    };
}
export const authController = new AuthController();
 