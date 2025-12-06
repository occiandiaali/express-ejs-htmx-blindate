import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  meetingID: { type: String, unique: true, required: true },
  startDate: { type: String, required: true }, // YYYY/mm/dd
  startTime: { type: String, required: true }, // 18:45
  sceneType: String,
  sceneURL: {
    type: String,
    required: true,
  },
  duration: Number,
  participants: {
    type: [String],
    validate: (v) => v.length <= 2,
  },
});

export default mongoose.model("Meeting", meetingSchema);
