import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.MONGO_URI);
    console.log("***Database Connection Successfull***".bgGreen.white);
  } catch (error) {
    console.log("error occured in db connection :", error);
  }
};

export default connectDB