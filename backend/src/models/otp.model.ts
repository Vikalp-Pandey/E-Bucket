import mongoose from "mongoose";

interface IOTP extends mongoose.Document {
  email: string;
  otp: string;
  createdAt: Date;
}

export interface OTPDocument extends IOTP{}

export const otpSchema = new mongoose.Schema<IOTP>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // TTL: Document deletes itself after 5 minutes
  },
});

export const OTP = mongoose.model<OTPDocument>("OTP", otpSchema);