import { userModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).send({
        success: true,
        message: "User already exists.",
      });
    }

    const hashedPassword = bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to register.",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not exist, please register first.",
      });
    }
    const isPasswordMatch = await bcrypt.compare(user.password, password);

    if (!isPasswordMatch) {
      return res.status(400).send({
        success: false,
        message: "Incorrect email or passoword.",
      });
    }

    generateToken(res, user, `welcome back ${user.name}`);
  } catch (error) {
    return res.status(200).send({
      success: false,
      message: "Failed to login.",
    });
  }
};

export { loginController, registerController };
