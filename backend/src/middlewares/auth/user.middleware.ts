import { Request, Response, NextFunction } from "express";
import env from "src/env";

import { verifyJwt } from "src/services/auth/auth.service";
import { ZodObject, ZodError } from "zod";

export const validateSchema = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body and replace it with the validated/transformed version
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.json({Error: error.issues})
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.body._id
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        const decoded = await verifyJwt(token,env.ACCESS_SECRET);
        if(userId === decoded) {
            next();
        } else {
            return res.status(401).json({ UserAuthenticationError : "Unauthorized User" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
} 