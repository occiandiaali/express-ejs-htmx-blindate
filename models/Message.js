import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
