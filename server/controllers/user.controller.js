import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
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
