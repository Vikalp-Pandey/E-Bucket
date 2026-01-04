import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema ,Types} from "mongoose";


export enum AccountType {
  LOCAL = "Local",
  GOOGLE = "Google",
  GITHUB = "Github",
  FACEBOOK = "Facebook",
}

export interface UserInput {
  name:string;
  email:string;
  password?:string;
  picture?: string;
  type:AccountType;
}

//  1. `UserDocument` = user fields + Mongoose’s built-in fields & methods like (_id,_v).
// We can also put this userStructure in the Document{}
export interface UserDocument extends UserInput, mongoose.Document{
  createdAt:Date;
  updatedAt:Date;
  comparePassword(candidatePassword:string): Promise<boolean> // This field is a function/method not a data field, so no need to add in Schema
};

// 2. Define the Model Interface (Optional but recommended for Mongoose)
export interface UserModel extends Model<UserDocument> {}

// 3. Define the User Model
const userSchema= new mongoose.Schema <UserDocument,UserModel> ({
  email: {type:String, required:true,unique:true},
  name:  {type:String, required:true},
  picture: { type: String },
  type: {type:String,  enum:["Local","Github","Google","Facebook"],  required:true},
  password: {type:String, required:false, select:false}, // select:false will make this field omitted where a wuery for user is run

},{
  timestamps: true, // Automatically Includes two date keys(created_at,updated_at)
});


// 4. pre('save') hook — important: use a normal function to get correct `this`
userSchema.pre('save',async function(this:UserDocument){
  /*
   * `this` is the document being saved.
   * `isModified('password')` returns true if `password` has been changed since the doc
   * was loaded/created. For new docs it's true.
   * Check if the password field was modified or if it's a new document
  */
  
    // If password doesn't exist, skip hashing (OAuth users)
    if(!this.password){
        return {"message":"This user does not have a password (OAuth user)"};
    }

     if(!this.isModified('password')){
        return;
     }

    //  Generate salt for hashing the password
     const Salt_Rounds = 10
     const salt =await bcrypt.genSalt(Salt_Rounds);

    //  Hashing the Password 
     this.password = await bcrypt.hash(this.password, salt);
})

// 5. A Method for comparing a password with hashed password
   userSchema.methods.comparePassword = async function(this:UserDocument, candidatePassword:string){
  try{
    if (this.password){
        const isPasswordMatching = await bcrypt.compare(candidatePassword, this.password)
        return isPasswordMatching
    }
    return ;
    
  }catch(error){
    console.log("Error occured during matching of candidatePassword and actual password",error);
  }
   }

// 6. Create and Export the Model
const User: UserModel = mongoose.model <UserDocument, UserModel> ("User", userSchema);
export default User;


