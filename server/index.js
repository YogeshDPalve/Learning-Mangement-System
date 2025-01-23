import express from "express";
import "colors";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.routes.js";

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

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Web server started successfully",
  });
});

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
  console.log(`Server listen at http://localhost:${port}`.bgWhite);
});
