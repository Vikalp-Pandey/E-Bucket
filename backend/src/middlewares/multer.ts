import multer, { DiskStorageOptions } from "multer";
import { Request } from 'express';

// 1. Define the specific callback types Multer expects
type DestinationCallback = (error: Error | null,  destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// 2. Use the correct types in the storage functions
const storage = multer.diskStorage({
    // Type checking the entire object as DiskStorageOptions ensures all parts conform
    destination: function (
        req: Request, 
        file: Express.Multer.File, 
        cb: DestinationCallback // Use the specific callback type
    ) {
        // Ensure this path exists and your application has write permissions
        cb(null, "src/public/temp"); 
    },
    filename: function (
        req: Request, 
        file: Express.Multer.File, 
        cb: FileNameCallback  // Use the specific callback type
    ) {
        // ⚠️ WARNING: Using file.filename here is incorrect 
        // Multer doesn't populate file.filename for diskStorage's filename function.
        cb(null, file.originalname); // Recommended fix: Use originalname
    }
})
 
//3. We will use this upload as a middleware in it
const upload = multer({ 
    storage, 
    // You might also want to set limits, e.g., fileSize: 1024 * 1024 * 5 // 5MB
});

export default upload;