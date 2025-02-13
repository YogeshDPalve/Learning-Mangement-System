import express from "express";
import "colors";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import purchaseCourseRoutes from "./routes/purchaseCourse.routes.js";
import courseProgressRoutes from "./routes/courseProgess.routes.js";
dotenv.config({});
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// call database connection
connectDb();

// apis
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/purchase", purchaseCourseRoutes);
app.use("/api/v1/progress", courseProgressRoutes);

// global catch
app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).send({
    success: false,
    message: "Backend is Down !!!",
    err,
  });
});

app.listen(port, () => {
  console.log(`Server listen at http://localhost:${port}`.bgWhite.black);
});
