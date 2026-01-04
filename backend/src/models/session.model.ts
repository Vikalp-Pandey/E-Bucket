

// export interface SessionInput extends mongoose.Document {
//     userId: Types.ObjectId;
//     access_token:string;
//     refresh_token:string;

//     expires_at?:Date;
//     last_accessed_at:Date;
//     revoked_at?:Date | null; // While expiresAt tells the system when a session should naturally die of old age, 
//     // revokedAt tells the system that someone—either the user or a security admin—manually ended the session early.

//     ipAddress?:string; // Device Ip
//     userAgent?:string; // Browser or Device Info
// }

// export interface sessionDocument extends SessionInput {};

// export const sessionSchema = new mongoose.Schema<sessionDocument>({
//     userId:{
//           type:mongoose.Schema.Types.ObjectId,
//           ref:"User",
//           required:true
//       },
//     access_token:{
//         type:String,
//         required:true,
//         expires:env.ACCESS_SECRET_TTL
//     },
//     refresh_token:{
//         type:String,
//         required:true,
//         expires:env.REFRESH_SECRET_TTL
//     },
//     last_accessed_at:{
//         type:Date,
//     },
//     expires_at:{
//         type:Date,
//         default:Date.now()+env.REFRESH_SECRET_TTL
//     },
//     revoked_at:{
//         type:Date,
//         default:null
//     },
// },{
//     timestamps:true
// })

// export const Session = mongoose.model<sessionDocument>("Session",sessionSchema);



import mongoose, { Schema, Document, Types } from "mongoose";
import env from "src/env";


/**
 * Input type → used when creating a session
 *  MUST NOT extend mongoose.Document
 */

export interface SessionInput {
  userId: Types.ObjectId;
  access_token: string;
  refresh_token: string;

  expires_at?: Date;
  last_accessed_at: Date;
  revoked_at?: Date | null;

  ipAddress?: string;
  deviceInfo?: string;
}

/**
 * MongoDB document type → returned from DB
 *  Extends mongoose.Document
 */
export interface sessionDocument extends Document {
  userId: Types.ObjectId;
  access_token: string;
  refresh_token: string;

  expires_at: Date;
  last_accessed_at?: Date;
  revoked_at?: Date | null;

  ipAddress?: string;
  deviceInfo?: string;

  createdAt: Date;
  updatedAt: Date;
}


const sessionSchema = new Schema<sessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    access_token: {
      type: String,
      required: true,
    },

    refresh_token: {
      type: String,
      required: true,
    },

    last_accessed_at: {
      type: Date,
    },

    expires_at: {
      type: Date,
      required: true,
      /*
      You need a function in default because:
      Mongoose needs to run the default value EVERY time a new document is created.
      If you don’t use a function, the value is calculated once, not per document.
      */
      default: () => new Date(Date.now() + Number(env.REFRESH_SECRET_TTL)),
    },

    revoked_at: {
      type: Date,
      default: null,
    },

    ipAddress: {
      type: String,
    },

    deviceInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


export const Session = mongoose.model<sessionDocument>(
  "Session",
  sessionSchema
);
