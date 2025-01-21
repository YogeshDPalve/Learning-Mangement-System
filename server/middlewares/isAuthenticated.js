import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "User not authenticated.",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).send({
        success: false,
        message: "Invalid token.",
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      // Changed status to 500 for server errors
      success: false,
      message: "Failed to authenticate user.",
      error,
    });
  }
};

export default authMiddleware;
