import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // CDN link
    },
    avatarId: {
      type: String, // Cloudinary public_id
    },
    bio: {
      type: String,
      maxlength: 500, // optional
    },
    phone: {
      type: String,
      sparse: true, // can be null but must be unique
    },
  },
  {
    timestamps: true,
  }
);

export type UserType = InferSchemaType<typeof userSchema>;

const User = mongoose.model("User", userSchema);
export default User;
