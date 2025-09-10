import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
  title: {
    required: true,
    type: String,
    maxlength: 50
  },
  subTitle: {
    type: String,
    default: "no subtext were given",
    maxlength: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    default: "Low",
    enum: ["Low", "Medium", "High"]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  }
}, {timestamps: true});

export const Todo = mongoose.model("Todo", todoSchema);