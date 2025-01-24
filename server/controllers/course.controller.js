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

const getCreatorCoursesController = async (req, res) => {
  try {
    const userId = req.id;

    const courses = await courseModel.find({ creator: userId });
    if (!courses) {
      res.status(404).send({
        success: false,
        message: "Course not found.",
        courses: [],
      });
    }
    return res.status(200).send({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to get courses.",
      error,
    });
  }
};

export { createCourseController, getCreatorCoursesController };
