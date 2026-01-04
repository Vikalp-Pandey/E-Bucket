
import {Request,Response} from "express";
import { OTP } from "src/models/otp.model";
import { AccountType } from "src/models/user.model";

import authService from "src/services/auth/auth.service";
import socialProvidersService from "src/services/auth/oauth.service";
import emailService  from "src/services/email";
import sessionService from "src/services/session/session.service";
import userService from "src/services/users/user.service";
import { string } from "zod";


export const signupUser = async (req:Request, res:Response) => {
    try {
        const {name,email,password} = req.body
        const newUser = await userService.createUser({ name,
                                                       email,
                                                       type:AccountType.LOCAL, 
                                                       password})
        console.log(newUser);
        const userId = newUser._id.toString();
        const {accessToken,refreshToken} = await authService.generateTokens(userId);
        if (!accessToken || !refreshToken) return res.json({message:"No Access or No Refresh Token"})

        const session = await sessionService.generateSession({
            userId:newUser._id,
            access_token:accessToken,
            refresh_token:refreshToken,
            last_accessed_at:new Date(),
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"] 
        })
        console.log(session);
        console.log({accessToken,refreshToken});

        return res.status(200).json({newUser,accessToken,refreshToken,session});
    } catch(error:any){
       console.error("Signup Error:", error);
       return res.status(500).json({
        message: error.message || "Internal Server Error"
    });
    }


};


export const signinUser = async (req:Request,res:Response) => {
    try{
        const {email,password} = req.body
        const registeredUser = await userService.findUser(email)
        if (registeredUser) {
            const isMatching = await userService.validatePassword(password, registeredUser.password)
            if(!registeredUser || !isMatching)  return res.status(400).json({"SigninError": "User not found"})
            
            const verificationOTP = await authService.generateOTP()

            await OTP.findOneAndUpdate(
                   { email },
                   { otp: verificationOTP, createdAt: new Date() },
                   { upsert: true }
                );
    
            try{await emailService.sendEmail({
                to: email,
                subject: 'OTP Verification for Login',
                template: {
                  type: 'login_otp',
                  data: {to_username: registeredUser.name,otp: verificationOTP},
                },
            })}catch(error){
                console.log({Error:error})
            }
            console.log({ message: "OTP sent to your email" });
            
    // 4️ Generate access & refresh tokens
    const { accessToken, refreshToken } = await authService.generateTokens(
      registeredUser._id.toString()
    );

    if (!accessToken || !refreshToken) {
      return res.status(500).json({ message: "Failed to generate tokens" });
    }

    // 5️ Create a session in DB
    const session = await sessionService.generateSession({
      userId: registeredUser._id,
      access_token: accessToken,
      refresh_token: refreshToken,
      last_accessed_at: new Date(),
      ipAddress: req.ip,
      deviceInfo: req.headers["user-agent"] ,
    });

    if (!session) {
            console.log("No Session");
            return res.status(500).json({ message: "Failed to create session" });
    }

    // 6️ Optional: validate session immediately (safety check)
    const validSession = await sessionService.validateSession(session._id.toString());
    if (!validSession) {
      return res.status(500).json({ message: "Session validation failed" });
    }

    // 7 Respond to client
    return res.status(200).json({
      message: "OTP sent to your email",
      session: validSession,
      accessToken,
      refreshToken,
    });
        }
        
    }catch(error){
        return res.json({"Error":error})
    }
}  

export const verifyOTP = async (req:Request,res:Response) => {
    // 1. Verify Otp Existence
    const { otp } = req.body
    if (!otp) return res.json({
        message:"OTP is required"
    });
    const validOtp = await authService.validateOTP(otp);

    // 2. Fetch user
    if(!validOtp){
        return res.status(400).json({message:"Invalid OTP"})
    }
    
    const user = await userService.findUser(validOtp.email);
    if (!user) return res.status(404).json({ message: "User no longer exists" });
    
    //3. Generate the Jwt Tokens
    const userId = user._id.toString(); // UserDocument --> String
    const {accessToken,refreshToken} = await authService.generateTokens(userId);

    //4.  Double Deleting: Deleting the OTP(One Time Password) so that attacker can't use that otp again.
       // Though already TTL is applied on otp field of OTP Model
    if (validOtp != null) {
        authService.deleteOtp(validOtp)
    }

    return res.status(200).json({  
        user: { name: user.name, email: user.email, accessToken, refreshToken  },
     });
}

export const forgotPassword = async (req:Request,res:Response) => {
    try{
        console.log(req.body)
       const {email} = req.body
       const user = await userService.findUser(email)
       if(!user){
        return res.status(404).json({Message:"User not Found"})
       }
       const {token,resetLink} = authService.generateResetTokenandLink()
       
       const savedToken = await authService.saveResetToken(user._id.toString(), token);
       
       try{
        await emailService.sendEmail({
            to:email,
            subject: "Reset Password on E-Bucket",
            template:{
                type:'forgot_password',
                data: {to_username:user.name,reset_link:resetLink},
            },
        })
        console.log("Email sent to user");
       }catch(error){
        console.log(error);
       }
    }catch(error){
        console.log({"Message":error});       
    }
};

export const resetPassword = async (req:Request,res:Response) => {
    try{
       const { token, password } = req.body
    //    console.log(token);
       
       const validToken = await authService.validateToken(token)
    //    console.log(validToken);
       
       if(!validToken) return res.status(404).json("Invalid Reset Token")

       const user = await userService.findUserbyID((validToken.userId).toString())
       console.log(user)
       if(!user) return res.status(404).json({Message:"User Not Found"})

       console.log(user)

       user.password = password
       
       console.log(user.password);
       
       user.save()
       console.log(user);
       
       return res.status(200).json({Message:"Password Resetted Successfully"})

    }catch(error){
        console.log(error);  
    }
}




const authController = {
   signupUser,
   signinUser,
   verifyOTP,
   forgotPassword,
   resetPassword,

}
export default authController;

