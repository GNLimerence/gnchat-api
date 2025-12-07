import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./libs/db";
import { router } from "./routes/index.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// route
app.use("/api/v1", router);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started successfully on port: ${PORT}`);
  });
});
