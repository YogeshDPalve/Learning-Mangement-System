import express from "express";
import {
  createCourseController,
  createLectureController,
  editCourseController,
  editLectureController,
  getCourseByIdController,
  getCreatorCoursesController,
  getLectureByIdController,
  getLectureController,
  getPublishedCourseController,
  removeLectureController,
  searchCourseController,
  togglePublicCourseController,
} from "../controllers/course.controller.js";
import authMiddleware from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/", authMiddleware, createCourseController);
router.get("/search", authMiddleware, searchCourseController);

router.get("/published-courses", authMiddleware, getPublishedCourseController);
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

router.post(
  "/:courseId/lectures/:lectureId",
  authMiddleware,
  editLectureController
);
router.delete("/lectures/:lectureId", authMiddleware, removeLectureController);

router.get("/lectures/:lectureId", authMiddleware, getLectureByIdController);

router.patch("/:courseId", authMiddleware, togglePublicCourseController);

export default router;
