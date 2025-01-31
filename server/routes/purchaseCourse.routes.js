import express from "express";
import authMiddleware from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSessionContoller,
  getAllPurchasedCourseController,
  getCourseDetailsWithPurchaseStatusController,
  stripeWebhookController,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  authMiddleware,
  createCheckoutSessionContoller
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

router.get(
  "/course/:courseId/detail-with-status",
  getCourseDetailsWithPurchaseStatusController
);
router.get("/", getAllPurchasedCourseController);

export default router;
