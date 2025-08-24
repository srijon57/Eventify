import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    eventTime: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Tech", "Cultural", "Sports", "Workshop", "Other"],
    },
    organizingClub: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);