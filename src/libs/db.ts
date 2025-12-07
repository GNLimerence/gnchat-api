import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Database connection successfully!");
    } else {
      throw new Error("Can not find connection string");
    }
  } catch (error) {
    console.log("We ran into some problem: ", error);
    process.exit(1);
  }
};
