import app from "./app.js";
console.log("Server started");
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
console.log(process.env.ACCESS_TOKEN_EXPIRE);
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
