import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from 'src/env';

// const s3Variables = {
//     region:env.REGION,
//     accessKeyId:env.ACCESS_KEY_ID,
//     secretAccessKey:env.SECRET_ACCESS_KEY
// }

const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    }
});

/*
 * Uploading a file to a specific S3 bucket
 */
const generateUploadUrl = async (fileName:string, fileType:string) => {
    const cleanFileName = fileName.replace(/[^\w.-]/g, '');
    // Path where uploaded file gets stored in S3 bucket
    const uniqueKey = `uploads/${cleanFileName}`;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: uniqueKey,
        ContentType: fileType,
        // Optional: Force the file to be private by default
        ACL: 'private' 
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return { url, key: uniqueKey };
};

