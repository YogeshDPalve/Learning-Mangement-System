import express from "express";
import authMiddleware from "../middlewares/isAuthenticated.js";
import { createCourseController } from "../controllers/course.controller.js";

const router = express.Router();

router.post("/", createCourseController);

export default router;
