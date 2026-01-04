import mongoose, { Types } from "mongoose";

export interface ResetPassword extends mongoose.Document  {
    userId:Types.ObjectId,
    token: string,
    createdAt: Date
}

export interface ResetPasswordDocument extends ResetPassword {}

export const resetpasswordSchema = new mongoose.Schema<ResetPasswordDocument>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{type:String, required:true},
    createdAt: {
        type:Date,
        default:Date.now,
        expires:300 // TTL: Document deletes itself after 5 minutes
    },
})

export const ResetPassword = mongoose.model<ResetPasswordDocument>("ResetPassword",resetpasswordSchema)