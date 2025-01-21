import express from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updateProfileController,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/logout", logoutController);

router.get("/profile", authMiddleware, getUserProfileController);

router.put(
  "/profile/update",
  authMiddleware,
  upload.single("profilePhoto"),
  updateProfileController
);
export default router;
