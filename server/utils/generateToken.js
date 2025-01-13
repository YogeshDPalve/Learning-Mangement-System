import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECTET, {
    expiresIn: "1d",
  });

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 100, //! for 1 day
    })
    .send({
      success: true,
      message,
      user,
    });
};
