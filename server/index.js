import express from "express";
import "colors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config({});
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// call database connection
connectDb();

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Web server started successfully",
  });
});

app.listen(port, () => {
  console.log(`Server listen at http://localhost:${port}`.bgWhite);
});

// global catch
app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).send("Error");
});
