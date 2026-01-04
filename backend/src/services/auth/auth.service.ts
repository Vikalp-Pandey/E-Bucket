import { JsonWebTokenError } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import env from "src/env"
import { OTP, OTPDocument } from "src/models/otp.model"
import crypto from "crypto";
import { ResetPassword } from "src/models/resetpassword.model";
import { log } from "console";
import { Session } from "src/models/session.model";



export const signJwt = async (payload:Object,jwt_secret:string,options:Object) => {
    const token = jwt.sign(
        payload,jwt_secret,options
    )
    return token
    
}
export const verifyJwt = async (token:string,jwt_secret:string) => {
    try{
        const decoded = jwt.verify(token,jwt_secret)
        return {decoded,expired:false}
    }catch(error){
        if (error instanceof JsonWebTokenError) return {decoded:null,expired:false,JsonWebTokenError:error.message}
        return {decoded: null,expired: false};

    }
}

export const reIssueAccessToken =  async(refreshToken: string) => {
  try {
    // 1️ Verify refresh token
    const {decoded} = await verifyJwt(refreshToken,env.REFRESH_SECRET)

    if (!decoded) return null;


    // 2️ Fetch session from DB
    const session = await Session.findById(decoded);

    if (
    !session ||
    session.revoked_at ||
    !session.expires_at ||
    session.expires_at < new Date()
    ) {
    return null;
    }

    // 3. Create new access token
    const accessToken = await signJwt(decoded, env.ACCESS_SECRET, {expiresIn: env.ACCESS_SECRET_TTL})

    return accessToken;

  } catch (err) {
    console.error("Failed to reissue access token:", err);
    return null;
  }
}
export const generateTokens = async (userId:string) => {
    const accessToken = await signJwt({userId}, env.ACCESS_SECRET,{ expiresIn: "15m" });
    const refreshToken = await signJwt({ userId }, env.REFRESH_SECRET, { expiresIn: "7d" });
    return {accessToken,refreshToken};

};

export const generateOTP  = async () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const validateOTP = async (otp:string): Promise<OTPDocument | null> => {
        try{
           const validOTP = await OTP.findOne({otp});
           return validOTP;
        }catch(error){
            return null;
        }    
} 

export const deleteOtp = async (otp:OTPDocument)=>{
    try{
        OTP.deleteOne({_id:otp._id})
    }catch(error){
        return {"OTPDeletionError":error}
    }
}



export const generateResetTokenandLink = () => {
    const token = crypto.randomBytes(32).toString("hex");
    const resetLink = `${env.ALLOWED_ORIGINS}/reset-password?token=${token}`
    return {token,resetLink}

};


export const validateToken = async (token:string) => {
    try{
    const validToken = await ResetPassword.findOne({token})
    console.log(validToken);
    // if (!validToken) return null
    return validToken
    }catch(error){
    console.log(error);
     return null
   }
  }
  
export const saveResetToken = async (userId: string, token: string) => {
    try {
        // This keeps the DB logic out of the controller
        const savedRecord = await ResetPassword.create({ 
            userId, 
            token 
        });
        return savedRecord;
    } catch (error) {
        throw new Error("Error saving reset token to database");
    }
};


const authService = {
    signJwt,
    verifyJwt,
    generateTokens,
    reIssueAccessToken,
    generateOTP,
    validateOTP,
    deleteOtp,
    generateResetTokenandLink,
    validateToken,
    saveResetToken
}

export default authService;