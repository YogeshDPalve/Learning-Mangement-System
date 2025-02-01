import { courseModel } from "../models/course.model.js";
import { courseProgressModel } from "../models/courseProgress.model.js";

const getCourseProgressController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // step-1 fetch the user course progress
    let courseProgress = await courseProgressModel
      .findOne({
        courseId,
        userId,
      })
      .populate("courseId");

    const courseDetails = await courseModel.findById(courseId);

    if (!courseDetails) {
      return res.status(404).send({
        success: false,
        message: "course not found",
      });
    }

    // step-2 if no progress found , return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).send({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // step-3 return user course progress with course details
    return res.status(200).send({
      data: {
        courseDetails,
        progress: courseProgress.lectueProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

