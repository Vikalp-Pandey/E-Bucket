import axios from "axios";
import type { OtpSchema, SigninSchema, SignupSchema } from "../../schema/auth.schema";



interface userInput{
    type: "signup" | "signin";
    data: SignupSchema | SigninSchema | OtpSchema;
}

export const postUser = async (input: userInput["data"], type:userInput["type"]) => {
    const baseURL = "http://localhost:3000"
    const response = await axios.post(`${baseURL}/api/auth/${type}`,input);
    return response.data;
}

export const sendMailandOtpForOtpVerification = async (inputOtp:string) => {
    const baseURL = "http://localhost:3000";
    const response = await axios.post(`${baseURL}/api/auth/verify-otp`,{
        otp: inputOtp
    },
        // {
        //     headers: {
        //         "Content-Type":"application/json"
        //     }
        // }
    )
    return response.data;
}

export const sendMailForResetPassword = async (inputEmail:string) => {
    const baseURL = "http://localhost:3000";
    const response = await axios.post(`${baseURL}/api/auth/forgot-password`,{email: inputEmail},
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
    )
    return response.data
}


export interface payloadSchema {
   token: string;
   password:string;
}
export const sendTokenandPassword = async (data: payloadSchema ) => {
    const baseURL = "http://localhost:3000";
    const response = await axios.post(`${baseURL}/api/auth/reset-password`,data)
    return response.data
}

export interface socailProviderInterface {
    type:"Google"|"Facebook"|"Github"
}

export const signUser =(socialProvider:socailProviderInterface["type"]) => {
    const baseURL = "http://localhost:3000"
    switch (socialProvider){
        case socialProvider="Github":
          // Direct the browser window to your backend endpoint.
            window.location.href = `${baseURL}/api/auth/github`;
            console.log("Consent Window opened");
            break;

        case socialProvider="Google":
            // Direct the browser window to your backend endpoint.
            window.location.href = `${baseURL}/api/auth/google`;
            console.log("Consent Window opened");
            break;
        default:
            console.log("Unknown provider");
    }      
}