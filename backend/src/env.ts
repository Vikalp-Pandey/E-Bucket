import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),

  // Application
  ALLOWED_ORIGINS: z
    .string()
    .transform((val) => val.split(',').map((origin) => origin.trim())),

  
  // Database
  DATABASE_URL: z.string(),

  // Port
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),

  // JWT Secret Keys
  ACCESS_SECRET:z.string(),
  REFRESH_SECRET:z.string(),
  ACCESS_SECRET_TTL:z.string(),
  REFRESH_SECRET_TTL:z.string(),
  
  // SMTP Configuration
  SMTP_NAME: z.string(),
  SMTP_MAIL: z.string(),
  SMTP_REPLY_TO: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z
    .string()
    .default('587')
    .transform((val) => parseInt(val, 10)),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),

  // Cloudinary Variables
  CLOUD_NAME:z.string(),
  CLOUDINARY_API_KEY:z.string(),
  CLOUDINARY_API_SECRET:z.string(),

  //Aws S3 Variables
  AWS_REGION :z.string(),
  AWS_ACCESS_KEY_ID:z.string(),
  AWS_SECRET_ACCESS_KEY :z.string(),

  // Github Oauth Credentials
  GITHUB_CLIENT_ID:z.string(),
  GITHUB_SECRET_KEY:z.string(),
  GITHUB_REDIRECT_URI:z.string(),

  // Google Oauth Credentials
  GOOGLE_CLIENT_ID:z.string(),
  GOOGLE_SECRET_KEY:z.string(),
  GOOGLE_REDIRECT_URI:z.string(),

  // Facebook Oauth Credentials
  FACEBOOK_CLIENT_ID:z.string(),
  FACEBOOK_SECRET_KEY:z.string(),
  FACEBOOK_REDIRECT_URI:z.string(),
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success || !data) {
  console.error(error);
  process.exit(1);
}

const env = data;

export default env;
