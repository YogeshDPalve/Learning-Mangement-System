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

    const courseDetails = await courseModel
      .findById(courseId)
      .populate("lectures");

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

const updateLectureProgressController = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      // if no progress exists, create a new record

      courseProgress = new courseProgressModel({
        userId,
        courseId,
        completed: false,
        lectueProgress: [],
      });
    }

    // find the lecture progress in the course progress
    const lectureIndex = courseProgress.lectueProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );
    if (lectureIndex !== -1) {
      // if lecture already exists, update its status
      courseProgress.lectueProgress[lectureIndex].viewed = true;
    } else {
      // add new lecture progress
      courseProgress.lectueProgress.push({
        lectureId,
        viewed: true,
      });
    }
    // if all lectures are complete
    const lectureProgressLength = courseProgress.lectueProgress.filter(
      (LectureProg) => LectureProg.viewed
    ).length;

    const course = await courseModel.findById(courseId);

    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();

    res.status(200).send({
      success: true,
      message: "Lecture progress updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const markAsCompletedController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });
    if (!courseProgress) {
      return res
        .status(404)
        .send({ success: false, message: "Course progress not found" });
    }

    courseProgress.lectueProgress.map(
      (lectueProg) => (lectueProg.viewed = true)
    );

    courseProgress.completed = true;
    await courseProgress.save();

 
    res.status(200).send({
      success: true,
      message: "Course mark as completed",
    });
  } catch (error) {
    console.log(error);
  }
};

const markAsInompletedController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });
    if (!courseProgress) {
      return res
        .status(404)
        .send({ success: false, message: "Course progress not found" });
    }

    courseProgress.lectueProgress.map(
      (lectueProg) => (lectueProg.viewed = false)
    );

    courseProgress.completed = false;
    await courseProgress.save();
 
    res.status(200).send({
      success: true,
      message: "Course mark as incompleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  getCourseProgressController,
  updateLectureProgressController,
  markAsCompletedController,
  markAsInompletedController,
};
