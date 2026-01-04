import { Request,Response,NextFunction } from "express";
import env from "src/env";
import authService from "src/services/auth/auth.service";

const deserializeUser = async (req:Request,res:Response,next:NextFunction) => {
    // Get Access Token from headers in request
    const accessToken = req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if(!accessToken) {
        // console.log("Access Token: ",undefined ,"In deserializeUser.ts");
        return next();
    }

    // Get Refresh Token from headers in request
    const refreshToken = req.header("x-refresh")

    // Verify the access Token whether it is expired or not
    const {decoded, expired} = await authService.verifyJwt(accessToken, env.ACCESS_SECRET);
      console.log("Decoded:", decoded);
      console.log("Expired:", expired);

    // If token is valid, attach user info to request
    // If decoded comes with data means is not empty then put this decoded in locals(Temporary Data Storage) of the Response Object. 
    if (decoded) {
      res.locals.user = decoded; // usually contains userId, roles, etc.
      return next()
    }

    // Generate the accessToken if expired using refreshToken with a service reIssueAccessToken  
    if(expired && refreshToken && typeof refreshToken === "string" ){
        const newAccessToken =  await authService.reIssueAccessToken(refreshToken);
        return newAccessToken
    }

    return accessToken 
}



const sessionMiddleware = {
  deserializeUser,
}

export default sessionMiddleware;