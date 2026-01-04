import env from './env';
import cors from 'cors';
import express from 'express';
import { connectToMongoDb } from './db/db';
import authRoutes from "./routes/auth.routes"

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
// Json Middleware
app.use(express.json());


app.use(
  "/api/auth", authRoutes
)

connectToMongoDb(env.DATABASE_URL);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
