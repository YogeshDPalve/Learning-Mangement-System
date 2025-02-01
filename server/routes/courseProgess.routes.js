import express from "express";
import authMiddleware from "../middlewares/isAuthenticated.js";
import {
  getCourseProgressController,
  markAsCompletedController,
  markAsInompletedController,
  updateLectureProgressController,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.get("/:courseId", authMiddleware, getCourseProgressController);

router.post(
  "/:courseId/:lectureId/view".authMiddleware,
  updateLectureProgressController
);

router.post("/:courseId/complete", authMiddleware, markAsCompletedController);

router.post(
  "/:courseId/incomplete",
  authMiddleware,
  markAsInompletedController
);

export default router;
