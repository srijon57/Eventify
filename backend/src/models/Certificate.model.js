import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    certificateUrl: {
      type: String,
      required: true, 
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


certificateSchema.index({ user: 1, event: 1 }, { unique: true });

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
