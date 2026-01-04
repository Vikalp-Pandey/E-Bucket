import mongoose from "mongoose"

export const connectToMongoDb = async (MongoURI:string)=>{
try{await mongoose.connect(MongoURI)
    console.log("MongoDb connected successfully")
}catch(error){
    console.log("DbConnectionError: ",error);
    
}
}