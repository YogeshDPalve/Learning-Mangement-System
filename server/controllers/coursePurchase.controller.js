import { Stripe } from "stripe";
import { courseModel } from "../models/course.model.js";
import { coursePurchaseModel } from "../models/coursePurchase.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
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

export default createCheckoutSession;
