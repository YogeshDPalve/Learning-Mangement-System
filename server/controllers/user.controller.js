import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

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
    return res.status(500).send({ // Changed status to 500 for server errors
      success: false,
      message: "Failed to login.",
      error,
    });
  }
};

export { registerController, loginController }
