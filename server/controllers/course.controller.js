import { courseModel } from "../models/course.model.js";
import { lectureModel } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

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

const editCourseController = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // delete old image
      }
      // upload a thumbnail on clourdinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await courseModel.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

const getCourseByIdController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({
        success: false,
        message: "course not found",
      });
    }

    return res.status(200).send({
      success: true,
      course,
      message: "Course info get successfully by id.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get create course by id",
    });
  }
};

const createLectureController = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    // console.log(`lecturetitle: ${lectureTitle} couresId: ${courseId}`);
    if (!lectureTitle || !courseId) {
      return res.status(400).send({
        success: false,
        message: "Lecture title is required.",
      });
    }
    // create lecture
    const lecture = await lectureModel.create({ lectureTitle });

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(201).send({
        lecture,
        success: true,
        message: "Course not found.",
      });
    }
    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).send({
      lecture,
      success: true,
      message: "Lecture created succesfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "failed to create lecture",
    });
  }
};

const getLectureController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(201).send({
        lecture,
        success: true,
        message: "Course not found.",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Lectures get successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "failed to get lecture",
    });
  }
};

 

export {
  createCourseController,
  getCreatorCoursesController,
  editCourseController,
  getCourseByIdController,
  createLectureController,
  getLectureController,
};
