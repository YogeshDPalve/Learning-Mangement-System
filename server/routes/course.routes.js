import express from "express";
import {
  createCourseController,
  createLectureController,
  editCourseController,
  getCourseByIdController,
  getCreatorCoursesController,
  getLectureController,
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

router.post("/:courseId/lectures", authMiddleware, createLectureController);
router.get("/:courseId/lectures", authMiddleware, getLectureController);

export default router;
