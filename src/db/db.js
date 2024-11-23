import mongoose from "mongoose";
import { app } from "../app.js";
const connectDb = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGO_URI}`)
      .then(() => {
        app.listen(8000 || process.env.PORT, () => {
          console.log(`server is running at port : ${process.env.PORT}`);
        });
      })
      .catch((err) => {
        console.log("server problem ...", err);
      });
  } catch (error) {
    console.log("Mongoose server error ... : ...", error);
    process.exit(1);
  }
};
export default connectDb;
