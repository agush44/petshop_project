import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
