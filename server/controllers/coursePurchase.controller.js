import { Stripe } from "stripe";
import { courseModel } from "../models/course.model.js";
import { coursePurchaseModel } from "../models/coursePurchase.model.js";
import { lectureModel } from "../models/lecture.model.js";
import { userModel } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSessionContoller = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await courseModel.findById(courseId);

    if (!course) {
      res.status(404).send({
        message: "course not found",
        success: false,
      });
    }

    //   create a new course purchase record
    const newPurchase = new coursePurchaseModel({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    //   create a stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in stripe initiation",
      success: false,
    });
  }
};

const stripeWebhookController = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await coursePurchaseModel
        .findOne({
          paymentId: session.id,
        })
        .populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await lectureModel.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await userModel.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await courseModel.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

const getCourseDetailsWithPurchaseStatusController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await courseModel
      .findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    const purchased = await coursePurchaseModel.findOne({ userId, courseId });

    return res.status(200).send({
      success: true,
      message: "Course get successfully with purchased status",
      course,
      purchased: !!purchased, //? purchased ? true : false
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllPurchasedCourseController = async (_, res) => {
  try {
    const purchasedCourses = await coursePurchaseModel
      .find({
        status: "completed",
      })
      .populate("courseId");

    if (!purchasedCourses) {
      return res.status(404).send({
        success: false,
        message: "Unable to found puchased courses",
        purchasedCourses: [],
      });
    }
    return res.status(200).send({
      success: false,
      purchasedCourses,
      message: "All purchased courses get successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  createCheckoutSessionContoller,
  stripeWebhookController,
  getCourseDetailsWithPurchaseStatusController,
  getAllPurchasedCourseController,
};
