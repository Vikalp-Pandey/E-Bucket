import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import env from "../../env"

// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: env.CLOUD_NAME, 
//         api_key: env.CLOUDINARY_API_KEY, 
//         api_secret: env.CLOUDINARY_API_SECRET 
//     });
    
//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//        .upload(
//             'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//                resource_type:'auto'
//            }
//        )
//        .catch((error) => {
           
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();



export default class CloudinaryService {
    #cloud_name: string;
    #api_key: string;
    #api_secret: string;

    constructor(){
        this.#cloud_name=env.CLOUD_NAME
        this.#api_key=env.CLOUDINARY_API_KEY
        this.#api_secret=env.CLOUDINARY_API_SECRET
    }
    
    async #uploadResult(filepath:string){
        try{
            const uploadedFile = await cloudinary.uploader.upload(filepath)
            return uploadedFile   
        }catch(error){
            console.log("FileError: ",error);
        }
    }

    async #optimizeUrl(){
        const optimizeUrl = cloudinary.url('shoes',{
            fetch_format:'auto',
            quality:'auto'
         });
         return optimizeUrl
    } 

    async #autoCropUrl(){
        const modifiedURL = cloudinary.url('shoes',{
            crop:'auto',
            gravity:'auto',
            width:500,
            height:500,
        });
        return modifiedURL
    }  
}


