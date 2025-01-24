import express from "express";

import {
  createCourseController,
  getCreatorCoursesController,
} from "../controllers/course.controller.js";
import authMiddleware from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/", authMiddleware, createCourseController);
router.get("/", authMiddleware, getCreatorCoursesController);

export default router;
