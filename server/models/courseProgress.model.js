import mongoose from "mongoose";

const lectueProgressSchema = new mongoose.Schema({
  lectureId: { type: String },
  viewed: { type: Boolean },
});

const courseProgressSchema = new mongoose.Schema({
  userId: { type: String },
  courseId: { type: String },
  completed: { type: Boolean },
  lectueProgress: [lectueProgressSchema],
});

export const courseProgressModel = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
