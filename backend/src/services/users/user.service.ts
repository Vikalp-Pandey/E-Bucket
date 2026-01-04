import User, { UserDocument } from "src/models/user.model";
import UserModel, { UserInput } from "src/models/user.model";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { maskEmail } from "./utils";
import { ResetPasswordDocument } from "src/models/resetpassword.model";

export const validatePassword = async (password:string|undefined, comparePassword:string|undefined) => {
    try{
        if(password && comparePassword){
           const isMatching = await bcrypt.compare(password,comparePassword)
            return isMatching
        }

    }catch(error){
        return {"Error":error}
    }
}

export const createUser = async (input:UserInput): Promise<UserDocument> => {
        const isExisting = await User.findOne({email: input.email})
        if(isExisting)  {
            console.log("User already exists");
            throw new Error("User already exists") 
        };
        const user = await User.create(input)
        return user
}

export const findUser = async (email:string):Promise<UserDocument | null> => {
    try{
        const user = await User.findOne({email}).select('+password');
        return user
    }catch(error){
        return null
    }
}

export const findUserbyID = async (id:string)=>{
    try{
        const user = await User.findById(id).select('+password');
        return user
    }catch(error){
        return null
    }
}

const userService = {
    validatePassword,
    createUser,
    findUser,
    findUserbyID
}
export default userService;