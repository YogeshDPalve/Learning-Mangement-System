import { courseModel } from "../models/course.model.js";

const createCourseController = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).send({
        success: false,
        message: "Course title and category is required.",
      });
    }

    const course = await courseModel.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).send({
      success: true,
      course,
      message: "Course created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to create course.",
      error,
    });
  }
};

export { createCourseController };
