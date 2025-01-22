import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required.",
      });
    }
    const exstingUser = await userModel.findOne({ email });
    if (exstingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exist with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).send({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Error while registering user",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not exist, Please register first.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password); // Correct order and added await

    if (!isPasswordCorrect) {
      return res.status(400).send({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      // Changed status to 500 for server errors
      success: false,
      message: "Failed to login.",
      error,
    });
  }
};

const logoutController = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).send({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      // Changed status to 500 for server errors
      success: false,
      message: "Failed to logout.",
      error,
    });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Profile not found.",
      });
    }
    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      // Changed status to 500 for server errors
      success: false,
      message: "Failed to load user.",
      error,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // extract public id of the old image from the url is it exists;
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
      deleteMediaFromCloudinary(publicId);
    }

    // upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, photoUrl };
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updatedData, {
        new: true,
      })
      .select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
export {
  registerController,
  loginController,
  getUserProfileController,
  logoutController,
  updateProfileController,
};
