import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.DB_KEY);
    console.log("db connected host:", dbConnection.connection.host)
  } catch (error) {
    console.log("db connection failed", error);
    process.exit(1);
  }
}

export {connectDb}