import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  eta_minutes: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

const Log = mongoose.model("Log", logSchema);
export default Log;
