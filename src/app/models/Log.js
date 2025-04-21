import mongoose, { Schema, models } from "mongoose";

const log_schema = new Schema({
  message: String,
  level: { type: String, default: "info" },
  timestamp: { type: Date, default: Date.now },
  meta: Object, 
});

export const Log = models?.Log || mongoose.model("Log", log_schema);