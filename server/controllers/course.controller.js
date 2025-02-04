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

const searchCourseController = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    // create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    // if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // defile sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // sort by price in ascending order
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // descending order
    }

    let courses = await courseModel
      .find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).send({
      success: true,
      courses: courses || [],
      message: "Courses search get successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getPublishedCourseController = async (_, res) => {
  try {
    const courses = await courseModel
      .find({ isPublished: true })
      .populate({ path: "creator", select: "name photoUrl" });
    // console.log(courses);
    if (!courses) {
      return res.status(404).send({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Courses get successfully.",
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to get published courses.",
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

const editLectureController = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    // console.log(req.body);

    if (!lectureTitle) {
      return res.status(404).send({
        success: false,
        message: `Enter Lecture Title`,
      });
    }
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).send({
        success: false,
        message: "Lecture not found",
      });
    }

    //  update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    // if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;
    if (typeof isPreviewFree !== "undefined")
      lecture.isPreviewFree = isPreviewFree;

    await lecture.save();
    // console.log(lecture);
    // ensure the course still has the lecture id if it was not alreay added
    const course = await courseModel.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).send({
      success: true,
      message: "Lecture updated successfully.",
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "failed to update lecture",
    });
  }
};

const removeLectureController = async (req, res) => {
  try {
    const { lectureId } = req.params;
    // console.log(req.params);
    const lecture = await lectureModel.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).send({
        success: false,
        message: "Lecture not found",
      });
    }
    // delete the lecture from cloudinary as well
    if (lecture.publicId) {
      await deleteMediaFromCloudinary(lecture.publicId);
    }

    // remove the lecture reference form the associated course
    await courseModel.updateOne(
      { lectures: lectureId }, // find the course that contains the lecture
      { $pull: { lectures: lectureId } } // remove the lecture id from the lectures array
    );

    return res.status(200).send({
      success: true,
      message: "Lecture remove successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "failed to remove lecture",
    });
  }
};

const getLectureByIdController = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).send({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).send({
      lecture,
      success: true,
      message: "Lecture get successfully by id.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "failed to get lecture by id",
    });
  }
};

// publish and unpublish course logic

const togglePublicCourseController = async (req, res) => {
  try {
    // console.log(req.params);
    const { courseId } = req.params;
    const { publish } = req.query; // true , false

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(400).send({
        success: false,
        message: "Course not found",
      });
    }
    // publish status based on the query parameter
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";

    return res.status(200).send({
      success: true,
      message: `Course is ${statusMessage} successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "failed to update status",
    });
  }
};
export {
  createCourseController,
  getCreatorCoursesController,
  getPublishedCourseController,
  editCourseController,
  getCourseByIdController,
  createLectureController,
  getLectureController,
  editLectureController,
  removeLectureController,
  getLectureByIdController,
  togglePublicCourseController,
};
