import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  bio: String,
  gender: String,
  avatar: String,
  age: Number,
  // likes: { type: Number, default: 0 },
  likedBy: {
    type: [String],
    default: [],
  },
  status: String,
});

export default mongoose.model("User", userSchema);
