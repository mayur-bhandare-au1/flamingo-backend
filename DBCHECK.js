import mongoose from "mongoose";

const connectDB = async () => {

  let MONGO_URI ="mongodb+srv://flamingo:bWyCz7AZV5XnAv37@flamingocluster1.noxlb9o.mongodb.net/?appName=flamingocluster1"

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  }
};

connectDB();
