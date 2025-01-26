import express from "express";
import {
  createCourseController,
  editCourseController,
  getCourseByIdController,
  getCreatorCoursesController,
} from "../controllers/course.controller.js";
import authMiddleware from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/", authMiddleware, createCourseController);
router.get("/", authMiddleware, getCreatorCoursesController);
router.put(
  "/:courseId",
  authMiddleware,
  upload.single("courseThumbnail"),
  editCourseController
);
router.get("/:courseId", authMiddleware, getCourseByIdController);

export default router;
