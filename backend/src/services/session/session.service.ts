import { Session, SessionInput } from "src/models/session.model";
import User from "src/models/user.model";
import authService from "../auth/auth.service";
import env from "src/env";


export const generateSession = async (input:SessionInput) => {
    // Validate the user
    try {const isExisting = await User.findById(input.userId);
    if(!isExisting){
        console.log({message:"User doesnot exists"})
    }
    
    // const { accessToken, refreshToken } = await authService.generateTokens((input.userId.toString()))

    const session = await Session.create({
    userId: input.userId,                
    access_token: input.access_token,     
    refresh_token: input.refresh_token, 
    expires_at:input.expires_at,  
    last_accessed_at: input.last_accessed_at || new Date(),
    ipAddress: input.ipAddress,
    deviceInfo: input.deviceInfo,
    });
    await session.save();
    
    return session;
  }catch(error){
    console.log("SessionGenerationError: ",error);
  }
    
}

export const validateSession = async (
  sessionId: string
)=> {
  // 1️ Find session by its _id
  const session = await Session.findById(sessionId);
  if (!session) return null;

  // 2️ Check if session is revoked
  if (session.revoked_at) return null;

  // 3️ Check if session is expired
  const now = new Date();
  if (!session.expires_at || session.expires_at < now) return null;

  // 4️ Update last_accessed_at
  session.last_accessed_at = now;
  await session.save();

  // 5️ Return validated session
  return session;
};



export const sessionService = {
    generateSession,
    validateSession
}

export default sessionService;