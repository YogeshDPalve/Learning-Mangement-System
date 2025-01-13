import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const registerController = async (req, res) => {
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

    const isPasswordCorrect = bcrypt.compare(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(400).send({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    return res.status(200).send({
      success: false,
      message: "Failed to login.",
    });
  }
};

export { registerController, loginController };
